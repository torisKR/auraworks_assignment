import type { Textbook } from "./database";

export type CartEntry = { textbookId: string; quantity: number; selected: boolean };
export type CartLine = CartEntry & { textbook: Textbook | null };
