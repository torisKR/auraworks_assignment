import assert from "node:assert/strict";
import { test } from "node:test";
import { filterTextbooks, formatWon } from "./catalog.ts";
import type { Textbook } from "../types/database.ts";

function textbook(overrides: Partial<Textbook> = {}): Textbook {
  return {
    id: "test-single",
    title: "2026 Hidden Kice 시즌7",
    category: "single",
    subject: "국어",
    description: "테스트 교재",
    image_path: "/images/textbook-single.png",
    price: 40000,
    original_price: null,
    discount_percent: 0,
    display_order: 1,
    ...overrides,
  };
}

const single = textbook();
const pass = textbook({ id: "test-pass", category: "pass", subject: "수학", display_order: 2 });
const catalog = [single, pass];

test("category and subject search are applied together", () => {
  assert.deepEqual(filterTextbooks(catalog, "pass", " 수학 "), [pass]);
  assert.deepEqual(filterTextbooks(catalog, "single", "수학"), []);
});

test("title search ignores case and surrounding whitespace", () => {
  assert.deepEqual(filterTextbooks(catalog, "all", " HIDDEN KICE "), catalog);
});

test("search normalizes decomposed Korean characters", () => {
  assert.deepEqual(filterTextbooks(catalog, "all", "국어".normalize("NFD")), [single]);
});

test("blank search preserves order and does not mutate the input", () => {
  const frozenCatalog = Object.freeze([single, pass]);
  assert.deepEqual(filterTextbooks(frozenCatalog, "all", "  "), catalog);
  assert.deepEqual(frozenCatalog, catalog);
});

test("unknown searches and empty catalogs return no matches", () => {
  assert.deepEqual(filterTextbooks(catalog, "all", "없는교재"), []);
  assert.deepEqual(filterTextbooks([], "all", ""), []);
});

test("prices use Korean thousands separators and won units", () => {
  assert.equal(formatWon(40000), "40,000원");
  assert.equal(formatWon(64800), "64,800원");
  assert.equal(formatWon(0), "0원");
});
