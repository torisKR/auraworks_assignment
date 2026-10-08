import { demoFaq } from "@/data/demo-faq";
import { absoluteUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${siteName} — 사이트 안내`,
    "",
    `원문: ${absoluteUrl("/about#faq")}`,
    "",
    ...demoFaq.flatMap(({ question, answer }) => [`## ${question}`, "", answer, ""]),
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex, follow" },
  });
}
