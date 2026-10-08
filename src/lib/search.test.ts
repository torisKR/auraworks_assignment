import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSearchFilter } from "./catalog-query.ts";
import { createThrottle } from "./throttle.ts";

test("server search combines title and subject with normalized Korean input", () => {
  assert.equal(
    buildSearchFilter("  수학  심화  ".normalize("NFD")),
    'title.ilike."%수학 심화%",subject.ilike."%수학 심화%"',
  );
  assert.equal(buildSearchFilter("  "), null);
});

test("PostgREST structural characters stay inside quoted search values", () => {
  const input = '수학",category.eq.pass)';
  const filter = buildSearchFilter(input);
  assert.ok(filter);
  assert.equal(
    filter,
    'title.ilike."%수학\\",category.eq.pass)%",subject.ilike."%수학\\",category.eq.pass)%"',
  );
});

test("LIKE wildcards and backslashes are escaped for literal search", () => {
  assert.equal(
    buildSearchFilter("50%_\\"),
    'title.ilike."%50\\\\%\\\\_\\\\\\\\%",subject.ilike."%50\\\\%\\\\_\\\\\\\\%"',
  );
});

test("throttle emits leading and last input within a fixed 400ms window", (context) => {
  context.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 1000 });
  const values: string[] = [];
  const throttle = createThrottle((value: string) => values.push(value), 400);
  throttle.push("수");
  context.mock.timers.tick(100);
  throttle.push("수하");
  context.mock.timers.tick(100);
  throttle.push("수학");
  assert.deepEqual(values, ["수"]);
  context.mock.timers.tick(199);
  assert.deepEqual(values, ["수"]);
  context.mock.timers.tick(1);
  assert.deepEqual(values, ["수", "수학"]);
  throttle.push("수학 심화");
  context.mock.timers.tick(400);
  assert.deepEqual(values, ["수", "수학", "수학 심화"]);
});

test("clearing search immediately replaces pending input and cancellation stops trailing work", (context) => {
  context.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 1000 });
  const values: string[] = [];
  const throttle = createThrottle((value: string) => values.push(value), 400);
  throttle.push("국");
  context.mock.timers.tick(100);
  throttle.push("국어");
  throttle.push("", true);
  context.mock.timers.tick(400);
  assert.deepEqual(values, ["국", ""]);
  throttle.push("수학");
  context.mock.timers.tick(10);
  throttle.push("수학 심화");
  throttle.cancel();
  context.mock.timers.tick(1000);
  assert.deepEqual(values, ["국", "", "수학"]);
});
