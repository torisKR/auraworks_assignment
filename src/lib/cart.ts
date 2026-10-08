import type { CartEntry, CartLine } from "../types/cart.ts";
import type { Textbook } from "../types/database.ts";

export const MAX_CART_QUANTITY = 99;
const textbookIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Stored prices are deliberately ignored; the catalog is the source of prices. */
export function parseCart(snapshot: string): CartEntry[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!Array.isArray(value)) return [];
    const entries = new Map<string, CartEntry>();
    for (const item of value) {
      if (!item || typeof item !== "object") continue;
      const { textbookId, quantity, selected } = item;
      if (typeof textbookId !== "string" || !textbookIdPattern.test(textbookId)) continue;
      if (typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 1) continue;
      const id = textbookId.toLowerCase();
      const existing = entries.get(id);
      entries.set(id, {
        textbookId: id,
        quantity: Math.min(MAX_CART_QUANTITY, quantity + (existing?.quantity ?? 0)),
        selected: existing ? existing.selected || selected !== false : selected !== false,
      });
    }
    return [...entries.values()];
  } catch {
    return [];
  }
}

export function addCartEntry(entries: readonly CartEntry[], textbookId: string): CartEntry[] {
  if (!textbookIdPattern.test(textbookId)) return [...entries];
  const id = textbookId.toLowerCase();
  const existing = entries.find((entry) => entry.textbookId === id);
  if (!existing) return [...entries, { textbookId: id, quantity: 1, selected: true }];
  return entries.map((entry) =>
    entry.textbookId === id
      ? { ...entry, quantity: Math.min(entry.quantity + 1, MAX_CART_QUANTITY), selected: true }
      : entry,
  );
}

export function setCartQuantity(entries: readonly CartEntry[], id: string, quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY)
    return [...entries];
  return entries.map((entry) => (entry.textbookId === id ? { ...entry, quantity } : entry));
}

export function resolveCart(
  entries: readonly CartEntry[],
  textbooks: readonly Textbook[],
): CartLine[] {
  const catalog = new Map(textbooks.map((textbook) => [textbook.id, textbook]));
  return entries.map((entry) => ({ ...entry, textbook: catalog.get(entry.textbookId) ?? null }));
}

export function summarizeCart(lines: readonly CartLine[]) {
  const selected = lines.filter((line) => line.selected && line.textbook);
  const subtotal = selected.reduce(
    (total, line) => total + line.textbook!.price * line.quantity,
    0,
  );
  const originalTotal = selected.reduce(
    (total, line) =>
      total + Math.max(line.textbook!.original_price ?? 0, line.textbook!.price) * line.quantity,
    0,
  );
  return {
    quantity: selected.reduce((total, line) => total + line.quantity, 0),
    subtotal,
    discount: originalTotal - subtotal,
    unavailableCount: lines.filter((line) => !line.textbook).length,
  };
}
