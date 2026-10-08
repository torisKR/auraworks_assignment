"use client";

import { useState } from "react";
import Image from "next/image";
import { CatalogSkeleton } from "@/components/store/catalog-skeleton";
import { CatalogToolbar } from "@/components/store/catalog-toolbar";
import { HeroBanner } from "@/components/store/hero-banner";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { StoreDialog } from "@/components/store/store-dialog";
import { TextbookCard } from "@/components/store/textbook-card";
import { useTextbooks } from "@/hooks/use-textbooks";
import { filterTextbooks, formatWon, type CategoryFilter } from "@/lib/catalog";
import type { Textbook } from "@/types/database";

type DialogState =
  | { type: "product"; textbook: Textbook }
  | { type: "cart" }
  | { type: "info"; title: string }
  | null;

export function Storefront() {
  const { state, retry } = useTextbooks();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [cart, setCart] = useState<Textbook[]>([]);
  const [announcement, setAnnouncement] = useState("");

  const textbooks = state.status === "success" ? filterTextbooks(state.textbooks, category, search) : [];

  function openInfo(title: string) { setDialog({ type: "info", title }); }

  function addToCart(textbook: Textbook) {
    setCart((items) => [...items, textbook]);
    setAnnouncement(`${textbook.title} 교재를 장바구니에 담았습니다.`);
    setDialog({ type: "cart" });
  }

  const dialogTitle = dialog?.type === "product" ? dialog.textbook.title : dialog?.type === "cart" ? "장바구니" : dialog?.title;

  return (
    <>
      <a className="skip-link" href="#catalog">교재 목록 바로가기</a>
      <SiteHeader cartCount={cart.length} onOpenCart={() => setDialog({ type: "cart" })} onOpenInfo={openInfo} />
      <main>
        <HeroBanner />
        <section id="catalog" className="catalog" aria-labelledby="catalog-title">
          <h2 id="catalog-title" className="sr-only">교재 스토어</h2>
          <CatalogToolbar search={search} category={category} onSearchChange={setSearch} onCategoryChange={setCategory} />
          {state.status === "loading" && <CatalogSkeleton />}
          {state.status === "error" && <div className="catalog-message" role="alert"><h3>교재 목록을 불러올 수 없습니다</h3><p>{state.message}</p><button className="primary-button" onClick={retry}>다시 시도</button></div>}
          {state.status === "success" && <>
            <p className="sr-only" role="status">{textbooks.length}개의 교재가 검색되었습니다.</p>
            {textbooks.length > 0 ? <div className="product-grid">{textbooks.map((textbook) => <TextbookCard key={textbook.id} textbook={textbook} onSelect={(selected) => setDialog({ type: "product", textbook: selected })} />)}</div> : <div className="catalog-message"><h3>{state.textbooks.length === 0 ? "등록된 교재가 없습니다" : "검색 결과가 없습니다"}</h3><p>{state.textbooks.length === 0 ? "새로운 교재를 준비하고 있습니다." : "다른 검색어나 교재 종류로 찾아보세요."}</p><button className="secondary-button" onClick={() => { setSearch(""); setCategory("all"); }}>전체 교재 보기</button></div>}
          </>}
        </section>
      </main>
      <SiteFooter onOpenInfo={openInfo} />
      <p className="sr-only" role="status">{announcement}</p>
      {dialog && dialogTitle && <StoreDialog title={dialogTitle} onClose={() => setDialog(null)}>
        {dialog.type === "product" && <div className="product-detail"><Image src={dialog.textbook.image_path} alt={`${dialog.textbook.title} 교재 표지`} width={250} height={320} /><p className="product-category">{dialog.textbook.subject} · {dialog.textbook.category === "single" ? "단품" : "패스"}</p><p>{dialog.textbook.description}</p><strong>{formatWon(dialog.textbook.price)}</strong><button className="primary-button" onClick={() => addToCart(dialog.textbook)}>장바구니 담기</button></div>}
        {dialog.type === "cart" && <div className="cart-content">{cart.length === 0 ? <p>장바구니가 비어 있습니다.</p> : <><ul>{cart.map((item, index) => <li key={`${item.id}-${index}`}><span>{item.title}<small>{item.subject}</small></span><strong>{formatWon(item.price)}</strong><button className="text-button" aria-label={`${item.subject} 교재 장바구니에서 삭제`} onClick={() => setCart((items) => items.filter((_, position) => position !== index))}>삭제</button></li>)}</ul><p className="cart-total">합계 <strong>{formatWon(cart.reduce((total, item) => total + item.price, 0))}</strong></p><p className="dialog-note">과제용 데모입니다. 실제 주문 및 결제는 제공하지 않습니다.</p></>}</div>}
        {dialog.type === "info" && <div className="info-content"><p>{dialog.title === "히든카이스 소개" || dialog.title === "회사소개" ? "상위권이 선택한 문제집, 결과로 증명된 실전 대비서. 히든카이스와 함께 실력을 완성하세요." : dialog.title === "알림" ? "2026 Hidden Kice 시즌7 교재가 업데이트되었습니다." : "현재 교재 스토어 화면을 중심으로 제작된 과제용 데모입니다. 이 메뉴의 세부 기능은 준비 중입니다."}</p></div>}
      </StoreDialog>}
    </>
  );
}
