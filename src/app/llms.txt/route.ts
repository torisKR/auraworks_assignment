import { absoluteUrl, publicPages, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${siteName}`,
    "",
    "> 제공 에셋의 디자인을 재현한 Next.js 과제용 데모입니다. 실제 히든카이스 공식 사이트나 판매 서비스가 아닙니다.",
    "",
    "교재는 Supabase의 더미 데이터이며 CSR로 조회합니다. 상세 목차와 후기는 예시입니다.",
    "로그인·장바구니·챌린지는 브라우저 메모리의 임시 상태입니다. 실제 주문·결제·AI 분석은 제공하지 않습니다.",
    "",
    "## 페이지",
    ...publicPages.map(
      ({ path, name, description }) => `- [${name}](${absoluteUrl(path)}): ${description}`,
    ),
    "",
    "## Optional",
    `- [사이트 안내 Markdown](${absoluteUrl("/site-guide.md")}): 소개 페이지에 공개된 FAQ와 데모 범위의 텍스트 표현입니다.`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
