"use client";

import { useEffect, useState } from "react";
import { fetchTextbooks } from "@/lib/textbooks";
import type { CategoryFilter } from "@/lib/catalog";
import type { Textbook } from "@/types/database";
type CatalogState =
  | { status: "loading" }
  | { status: "success"; textbooks: Textbook[] }
  | { status: "error"; message: string };

export function useTextbooks(query = "", category: CategoryFilter = "all") {
  const [result, setResult] = useState<{ key: string; state: CatalogState }>({
    key: "",
    state: { status: "loading" },
  });
  const [requestVersion, setRequestVersion] = useState(0);
  const key = JSON.stringify([query, category, requestVersion]);
  const state: CatalogState = result.key === key ? result.state : { status: "loading" };
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const textbooks = await fetchTextbooks(controller.signal, query, category);
        if (!controller.signal.aborted) setResult({ key, state: { status: "success", textbooks } });
      } catch (error) {
        if (!controller.signal.aborted)
          setResult({
            key,
            state: {
              status: "error",
              message: error instanceof Error ? error.message : "교재 정보를 불러오지 못했습니다.",
            },
          });
      }
    }
    void load();
    return () => controller.abort();
  }, [query, category, key]);
  return { state, retry: () => setRequestVersion((version) => version + 1) };
}
