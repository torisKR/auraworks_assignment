"use client";

import { useState } from "react";
import { CatalogSkeleton } from "@/components/store/catalog-skeleton";
import { CatalogToolbar } from "@/components/store/catalog-toolbar";
import { HeroBanner } from "@/components/store/hero-banner";
import { TextbookCard } from "@/components/store/textbook-card";
import { useTextbooks } from "@/hooks/use-textbooks";
import type { CategoryFilter } from "@/lib/catalog";
import { useThrottledSearch } from "@/hooks/use-throttled-search";

export function Storefront() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const { search, query, updateSearch, pending } = useThrottledSearch();
  const { state, retry } = useTextbooks(query, category);
  const textbooks = state.status === "success" ? state.textbooks : [];
  return (
    <>
      <HeroBanner />
      <section id="catalog" className="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title" className="sr-only">
          교재 스토어
        </h2>
        <CatalogToolbar
          search={search}
          category={category}
          onSearchChange={updateSearch}
          onCategoryChange={setCategory}
        />
        {(pending || state.status === "loading") && (
          <p className="search-status" role="status">
            교재를 검색하고 있습니다.
          </p>
        )}
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
                  <TextbookCard key={textbook.id} textbook={textbook} />
                ))}
              </div>
            ) : (
              <div className="catalog-message">
                <h3>
                  {query || category !== "all" ? "검색 결과가 없습니다" : "등록된 교재가 없습니다"}
                </h3>
                <p>다른 검색어나 교재 종류로 찾아보세요.</p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    updateSearch("");
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
    </>
  );
}
