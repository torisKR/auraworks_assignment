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
              <dd>무료 배송 · 데모 안내</dd>
            </div>
          </dl>
          <button className="primary-button" onClick={() => addToCart(textbook)}>
            장바구니 담기
          </button>
          <p className="dialog-note">
            교재 정보는 Supabase 조회 결과입니다. 상세 구성·후기는 예시이며 실제 주문·결제는
            제공하지 않습니다.
          </p>
        </div>
      </section>
      <nav className="detail-tabs" aria-label="상세 정보">
        <a href="#description">교재 소개</a>
        <a href="#contents">목차</a>
        <a href="#reviews">학습 후기</a>
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
        <p className="muted">아래 목차는 상세 페이지 시연을 위한 예시입니다.</p>
        <ol className="chapter-list">
          {textbookDetail.chapters.map((chapter) => (
            <li key={chapter}>{chapter}</li>
          ))}
        </ol>
      </section>
      <section id="reviews" className="detail-section">
        <h2>
          학습 후기 <span className="muted">2</span>
        </h2>
        <p className="muted">실제 구매자가 작성한 후기가 아닌 더미 데이터입니다.</p>
        {textbookDetail.reviews.map((review) => (
          <article className="review" key={review.name}>
            <strong>{review.name}</strong>
            <span aria-label={`5점 만점에 ${review.rating}점`} className="review-stars">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
            <p>{review.body}</p>
          </article>
        ))}
      </section>
      <section id="delivery" className="detail-section">
        <h2>배송 및 교환 안내</h2>
        <p>
          무료 배송과 수령 후 7일 이내 교환 안내를 예시로 표시합니다. 실제 판매 조건이 아니며,
          결제와 배송은 이루어지지 않습니다.
        </p>
      </section>
    </div>
  );
}
