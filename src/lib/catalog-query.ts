/** Quote PostgREST values and escape LIKE wildcards for literal substring search. */
export function buildSearchFilter(query: string): string | null {
  const normalized = query.normalize("NFC").trim().replace(/\s+/g, " ");
  if (!normalized) return null;
  const pattern = `%${normalized.replace(/[\\%_]/g, (character) => `\\${character}`)}%`;
  const quoted = `"${pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  return `title.ilike.${quoted},subject.ilike.${quoted}`;
}
