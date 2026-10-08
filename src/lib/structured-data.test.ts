import assert from "node:assert/strict";
import test from "node:test";
import { serializeStructuredData } from "./structured-data.ts";

test("JSON-LD cannot close its script element through a content string", () => {
  const data = { description: '</script><script>alert("test")</script>' };
  const output = serializeStructuredData(data);
  assert.equal(output.includes("<"), false);
  assert.deepEqual(JSON.parse(output), data);
});
