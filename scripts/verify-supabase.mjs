import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

assert.ok(url && key, "Set the two public Supabase variables in .env.local first.");

const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await client
  .from("textbooks")
  .select("id,category,price,image_path,display_order")
  .order("display_order")
  .abortSignal(AbortSignal.timeout(15_000));

assert.equal(error, null, "Anonymous catalog SELECT must succeed.");
assert.equal(data.length, 12, "The seed contains 12 textbooks.");
assert.equal(data.filter((row) => row.category === "single").length, 3);
assert.equal(data.filter((row) => row.category === "pass").length, 9);
assert.deepEqual(data.map((row) => row.display_order), Array.from({ length: 12 }, (_, index) => index + 1));

console.log("Supabase catalog verified: 12 rows, 3 single products, 9 passes, correct order.");
