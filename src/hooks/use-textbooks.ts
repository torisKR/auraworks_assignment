"use client";

import { useEffect, useState } from "react";
import { fetchTextbooks } from "@/lib/textbooks";
import type { Textbook } from "@/types/database";

type CatalogState =
  | { status: "loading" }
  | { status: "success"; textbooks: Textbook[] }
  | { status: "error"; message: string };

export function useTextbooks() {
  const [state, setState] = useState<CatalogState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const textbooks = await fetchTextbooks(controller.signal);
        if (!controller.signal.aborted) setState({ status: "success", textbooks });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "교재 정보를 불러오지 못했습니다.",
        });
      }
    }

    void load();
    return () => controller.abort();
  }, [requestVersion]);

  function retry() {
    setState({ status: "loading" });
    setRequestVersion((version) => version + 1);
  }

  return { state, retry };
}
