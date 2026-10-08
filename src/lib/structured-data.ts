/** JSON-LD is embedded in HTML, so escape '<' even when the data is trusted. */
export function serializeStructuredData(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
