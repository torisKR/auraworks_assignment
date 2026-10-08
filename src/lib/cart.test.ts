import assert from "node:assert/strict";
import { test } from "node:test";
import { addCartEntry, parseCart, resolveCart, setCartQuantity, summarizeCart } from "./cart.ts";
import type { Textbook } from "../types/database.ts";

const id = "00000000-0000-0000-0000-000000000001";
const otherId = "00000000-0000-0000-0000-000000000002";
const textbook: Textbook = {
  id,
  title: "시즌7 수학",
  subject: "수학",
  category: "pass",
  description: "시즌 패스",
  image_path: "/images/textbook-pass.png",
  price: 64800,
  original_price: 72000,
  discount_percent: 10,
  display_order: 1,
};

test("repeated additions merge quantities and reselect the existing textbook", () => {
  const initial = Object.freeze([{ textbookId: id, quantity: 2, selected: false }]);
  assert.deepEqual(addCartEntry(initial, id), [{ textbookId: id, quantity: 3, selected: true }]);
  assert.equal(initial[0].quantity, 2);
  assert.equal(addCartEntry(addCartEntry([], id), otherId).length, 2);
});

test("quantity changes reject zero, fractions and excessive values without deleting products", () => {
  const entries = [{ textbookId: id, quantity: 1, selected: true }];
  for (const invalid of [0, -1, 1.5, 100, NaN, Infinity]) {
    assert.deepEqual(setCartQuantity(entries, id, invalid), entries);
  }
  assert.equal(setCartQuantity(entries, id, 99)[0].quantity, 99);
  assert.equal(addCartEntry(setCartQuantity(entries, id, 99), id)[0].quantity, 99);
});

test("storage recovery discards malformed entries, caps duplicate totals and ignores saved prices", () => {
  for (const broken of ["invalid json", "null", "{}", "42"])
    assert.deepEqual(parseCart(broken), []);
  assert.deepEqual(
    parseCart(
      JSON.stringify([
        { textbookId: id, quantity: 50, selected: false, price: 1 },
        { textbookId: id, quantity: 70, selected: true },
        { textbookId: "not-a-uuid", quantity: 1 },
        { textbookId: otherId, quantity: -2 },
        null,
      ]),
    ),
    [{ textbookId: id, quantity: 99, selected: true }],
  );
});

test("only selected available textbooks contribute current catalog prices and discounts", () => {
  const entries = [
    { textbookId: id, quantity: 2, selected: true },
    { textbookId: otherId, quantity: 1, selected: true },
  ];
  const lines = resolveCart(entries, [textbook]);
  assert.equal(lines[1].textbook, null);
  assert.deepEqual(summarizeCart(lines), {
    quantity: 2,
    subtotal: 129600,
    discount: 14400,
    unavailableCount: 1,
  });
  assert.equal(
    summarizeCart(resolveCart(entries, [{ ...textbook, price: 60000 }])).subtotal,
    120000,
  );
  assert.equal(summarizeCart(lines.map((line) => ({ ...line, selected: false }))).subtotal, 0);
});

test("a stored cart round-trips IDs, quantities and selection without textbook data", () => {
  const entries = [{ textbookId: id, quantity: 3, selected: false }];
  assert.deepEqual(parseCart(JSON.stringify(entries)), entries);
  assert.deepEqual(summarizeCart([]), {
    quantity: 0,
    subtotal: 0,
    discount: 0,
    unavailableCount: 0,
  });
});
