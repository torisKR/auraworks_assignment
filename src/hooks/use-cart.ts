"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { addCartEntry, parseCart, resolveCart, setCartQuantity } from "@/lib/cart";
import { fetchCartTextbooks } from "@/lib/textbooks";
import type { CartEntry } from "@/types/cart";
import type { Textbook } from "@/types/database";

const storageKey = "hidden-kice:cart:v1";
const changeEvent = "hidden-kice:cart-changed";
// Keep this browser session usable when storage is disabled or full.
let sessionSnapshot: string | null = null;
let storageAvailable = true;
function getSnapshot() {
  if (sessionSnapshot !== null) return sessionSnapshot;
  try {
    return window.localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return "[]";
  }
}
function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changeEvent, onChange);
  };
}
function updateCart(update: (entries: CartEntry[]) => CartEntry[]) {
  const next = JSON.stringify(update(parseCart(getSnapshot())));
  try {
    window.localStorage.setItem(storageKey, next);
    sessionSnapshot = null;
    storageAvailable = true;
  } catch {
    sessionSnapshot = next;
    storageAvailable = false;
  }
  window.dispatchEvent(new Event(changeEvent));
}
type CatalogResult =
  | { key: string; status: "success"; textbooks: Textbook[] }
  | { key: string; status: "error"; message: string };

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const entries = parseCart(snapshot);
  const ids = JSON.stringify(entries.map((entry) => entry.textbookId).sort());
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<CatalogResult | null>(null);
  const key = JSON.stringify([ids, version]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const textbooks = await fetchCartTextbooks(JSON.parse(ids) as string[], controller.signal);
        if (!controller.signal.aborted) setResult({ key, status: "success", textbooks });
      } catch (error) {
        if (!controller.signal.aborted)
          setResult({
            key,
            status: "error",
            message: error instanceof Error ? error.message : "교재 정보를 불러오지 못했습니다.",
          });
      }
    }
    void load();
    return () => controller.abort();
  }, [ids, key]);

  const current = result?.key === key ? result : null;
  return {
    ready,
    entries,
    count: entries.reduce((total, entry) => total + entry.quantity, 0),
    status: !ready ? "loading" : entries.length === 0 ? "success" : (current?.status ?? "loading"),
    message: current?.status === "error" ? current.message : "",
    lines: resolveCart(entries, current?.status === "success" ? current.textbooks : []),
    storageAvailable,
    retry: () => setVersion((value) => value + 1),
    add: (id: string) => updateCart((items) => addCartEntry(items, id)),
    setQuantity: (id: string, quantity: number) =>
      updateCart((items) => setCartQuantity(items, id, quantity)),
    select: (id: string, selected: boolean) =>
      updateCart((items) =>
        items.map((item) => (item.textbookId === id ? { ...item, selected } : item)),
      ),
    selectAll: (selected: boolean) =>
      updateCart((items) => items.map((item) => ({ ...item, selected }))),
    remove: (id: string) => updateCart((items) => items.filter((item) => item.textbookId !== id)),
    removeSelected: () => updateCart((items) => items.filter((item) => !item.selected)),
  };
}
