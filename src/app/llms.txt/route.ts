import { absoluteUrl, publicPages, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${siteName}`,
    "",
    "> 교재 탐색부터 답안 채점, 학습 챌린지까지. 히든카이스와 함께 나만의 학습 루틴을 만들어보세요.",
    "",
    "스토어에서 제목과 과목으로 교재를 검색하고, 패스·단품 구성을 비교할 수 있습니다.",
    "게스트로 챌린지를 시작하고 연습 답안을 직접 입력해 채점할 수 있습니다. 게스트 상태는 새로고침하면 초기화됩니다. 주문·결제와 답안 사진 분석은 준비 중입니다.",
    "",
    "## 페이지",
    ...publicPages.map(
      ({ path, name, description }) => `- [${name}](${absoluteUrl(path)}): ${description}`,
    ),
    "",
    "## Optional",
    `- [사이트 안내 Markdown](${absoluteUrl("/site-guide.md")}): 서비스 소개와 자주 묻는 질문의 텍스트 안내입니다.`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
