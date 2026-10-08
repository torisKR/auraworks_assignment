"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchTextbook } from "@/lib/textbooks";
import type { Textbook } from "@/types/database";
import { formatWon } from "@/lib/catalog";
import { textbookDetail } from "@/data/textbook-details";
import { useSite } from "@/components/layout/site-shell";

type DetailState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; textbook: Textbook | null };
export function TextbookDetailPage({ id }: { id: string }) {
  const [state, setState] = useState<DetailState>({ status: "loading" });
  const [version, setVersion] = useState(0);
  const { addToCart } = useSite();
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const textbook = await fetchTextbook(id, controller.signal);
        if (!controller.signal.aborted) setState({ status: "success", textbook });
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "교재를 불러올 수 없습니다.",
          });
      }
    }
    void load();
    return () => controller.abort();
  }, [id, version]);
  if (state.status === "loading")
    return (
      <div className="catalog-message" role="status">
        교재 상세를 불러오는 중입니다.
      </div>
    );
  if (state.status === "error")
    return (
      <div className="catalog-message" role="alert">
        <h1>잠시 후 다시 시도해 주세요</h1>
        <p>{state.message}</p>
        <button
          className="primary-button"
          onClick={() => {
            setState({ status: "loading" });
            setVersion((v) => v + 1);
          }}
        >
          다시 시도
        </button>
      </div>
    );
  if (!state.textbook)
    return (
      <div className="catalog-message">
        <h1>교재를 찾을 수 없습니다</h1>
        <Link className="primary-button" href="/store">
          스토어로 돌아가기
        </Link>
      </div>
    );
  const textbook = state.textbook;
  return (
    <div className="content-page">
      <nav className="breadcrumbs" aria-label="현재 위치">
        <Link href="/store">스토어</Link>
        <span> / 교재 상세</span>
      </nav>
      <section className="detail-overview">
        <div className="detail-cover">
          <Image
            src={textbook.image_path}
            alt={`${textbook.subject} 교재 표지`}
            width={350}
            height={448}
            sizes="(max-width: 700px) 80vw, 350px"
          />
        </div>
        <div className="detail-summary">
          <p className="eyebrow">
            2026 SEASON 7 · {textbook.category === "pass" ? "패스" : "단품"}
          </p>
          <h1>
            {textbook.title}
            <br />
            {textbook.subject}
          </h1>
          <p>{textbook.description}</p>
          {textbook.original_price && <del>{formatWon(textbook.original_price)}</del>}
          <strong className="detail-price">{formatWon(textbook.price)}</strong>
          <dl className="detail-spec">
            <div>
              <dt>출판사</dt>
              <dd>{textbookDetail.publisher}</dd>
            </div>
            <div>
              <dt>발행일</dt>
              <dd>{textbookDetail.publishedAt}</dd>
            </div>
            <div>
              <dt>학습 대상</dt>
              <dd>{textbookDetail.audience}</dd>
            </div>
            <div>
              <dt>배송</dt>
              <dd>주문 서비스 준비 중</dd>
            </div>
          </dl>
          <button className="primary-button" onClick={() => addToCart(textbook)}>
            장바구니 담기
          </button>
          <p className="dialog-note">
            필요한 교재를 장바구니에 모아보세요. 주문·결제 기능은 준비 중입니다.
          </p>
        </div>
      </section>
      <nav className="detail-tabs" aria-label="상세 정보">
        <a href="#description">교재 소개</a>
        <a href="#contents">목차</a>
        <a href="#study-guide">학습 가이드</a>
        <a href="#delivery">배송 안내</a>
      </nav>
      <section id="description" className="detail-section">
        <p className="eyebrow">WHY HIDDEN KICE</p>
        <h2>실전을 위한, 한 단계 더 깊은 준비</h2>
        <p>{textbook.description}</p>
        <div className="three-column">
          {textbookDetail.highlights.map((highlight, i) => (
            <article className="feature-card" key={highlight}>
              <span className="step-number">0{i + 1}</span>
              <h3>{highlight}</h3>
            </article>
          ))}
        </div>
      </section>
      <section id="contents" className="detail-section">
        <h2>교재 목차</h2>
        <p className="muted">개념부터 실전 점검까지, 단계별로 학습을 이어가세요.</p>
        <ol className="chapter-list">
          {textbookDetail.chapters.map((chapter) => (
            <li key={chapter}>{chapter}</li>
          ))}
        </ol>
      </section>
      <section id="study-guide" className="detail-section">
        <h2>교재 활용 가이드</h2>
        {textbookDetail.studyNotes.map((note) => (
          <article className="review" key={note.title}>
            <strong>{note.title}</strong>
            <p>{note.body}</p>
          </article>
        ))}
      </section>
      <section id="delivery" className="detail-section">
        <h2>배송 및 교환 안내</h2>
        <p>
          주문 서비스는 준비 중입니다. 배송 일정과 교환 기준은 주문 기능이 시작될 때 안내해
          드립니다.
        </p>
      </section>
    </div>
  );
}
