import type { Textbook } from "../types/database.ts";

export type CategoryFilter = "all" | Textbook["category"];

const wonFormatter = new Intl.NumberFormat("ko-KR");

export function formatWon(amount: number): string {
  return `${wonFormatter.format(amount)}원`;
}

export function filterTextbooks(
  textbooks: readonly Textbook[],
  category: CategoryFilter,
  search: string,
): Textbook[] {
  const query = search.trim().normalize("NFC").toLocaleLowerCase("ko-KR");

  return textbooks.filter((textbook) => {
    const matchesCategory = category === "all" || textbook.category === category;
    const searchableText = `${textbook.title} ${textbook.subject}`
      .normalize("NFC")
      .toLocaleLowerCase("ko-KR");

    return matchesCategory && searchableText.includes(query);
  });
}
