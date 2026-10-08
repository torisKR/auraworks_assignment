"use client";

import { useState } from "react";
import { CartContent } from "@/components/store/cart-content";
import { InfoContent } from "@/components/store/info-content";
import { ProductDetail } from "@/components/store/product-detail";
import { CatalogSkeleton } from "@/components/store/catalog-skeleton";
import { CatalogToolbar } from "@/components/store/catalog-toolbar";
import { HeroBanner } from "@/components/store/hero-banner";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { StoreDialog } from "@/components/store/store-dialog";
import { TextbookCard } from "@/components/store/textbook-card";
import { useTextbooks } from "@/hooks/use-textbooks";
import { filterTextbooks, type CategoryFilter } from "@/lib/catalog";
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

  const textbooks =
    state.status === "success" ? filterTextbooks(state.textbooks, category, search) : [];

  function openInfo(title: string) {
    setDialog({ type: "info", title });
  }

  function addToCart(textbook: Textbook) {
    setCart((items) => [...items, textbook]);
    setAnnouncement(`${textbook.title} 교재를 장바구니에 담았습니다.`);
    setDialog({ type: "cart" });
  }

  const dialogTitle =
    dialog?.type === "product"
      ? dialog.textbook.title
      : dialog?.type === "cart"
        ? "장바구니"
        : dialog?.title;

  return (
    <>
      <a className="skip-link" href="#catalog">
        교재 목록 바로가기
      </a>
      <SiteHeader
        cartCount={cart.length}
        onOpenCart={() => setDialog({ type: "cart" })}
        onOpenInfo={openInfo}
      />
      <main>
        <HeroBanner />
        <section id="catalog" className="catalog" aria-labelledby="catalog-title">
          <h2 id="catalog-title" className="sr-only">
            교재 스토어
          </h2>
          <CatalogToolbar
            search={search}
            category={category}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
          />
          {state.status === "loading" && <CatalogSkeleton />}
          {state.status === "error" && (
            <div className="catalog-message" role="alert">
              <h3>교재 목록을 불러올 수 없습니다</h3>
              <p>{state.message}</p>
              <button className="primary-button" onClick={retry}>
                다시 시도
              </button>
            </div>
          )}
          {state.status === "success" && (
            <>
              <p className="sr-only" role="status">
                {textbooks.length}개의 교재가 검색되었습니다.
              </p>
              {textbooks.length > 0 ? (
                <div className="product-grid">
                  {textbooks.map((textbook) => (
                    <TextbookCard
                      key={textbook.id}
                      textbook={textbook}
                      onSelect={(selected) => setDialog({ type: "product", textbook: selected })}
                    />
                  ))}
                </div>
              ) : (
                <div className="catalog-message">
                  <h3>
                    {state.textbooks.length === 0
                      ? "등록된 교재가 없습니다"
                      : "검색 결과가 없습니다"}
                  </h3>
                  <p>
                    {state.textbooks.length === 0
                      ? "새로운 교재를 준비하고 있습니다."
                      : "다른 검색어나 교재 종류로 찾아보세요."}
                  </p>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                    }}
                  >
                    전체 교재 보기
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter onOpenInfo={openInfo} />
      <p className="sr-only" role="status">
        {announcement}
      </p>
      {dialog && dialogTitle && (
        <StoreDialog title={dialogTitle} onClose={() => setDialog(null)}>
          {dialog.type === "product" && (
            <ProductDetail textbook={dialog.textbook} onAddToCart={addToCart} />
          )}
          {dialog.type === "cart" && (
            <CartContent
              items={cart}
              onRemove={(index) =>
                setCart((items) => items.filter((_, position) => position !== index))
              }
            />
          )}
          {dialog.type === "info" && <InfoContent title={dialog.title} />}
        </StoreDialog>
      )}
    </>
  );
}
