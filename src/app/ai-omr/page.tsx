import { pageMetadata } from "@/lib/site";
import { ContentPage } from "@/components/layout/content-page";
import { OmrWorkspace } from "@/features/omr/omr-workspace";
export const metadata = pageMetadata(
  "AI OMR WORK · 채점 체험",
  "5문항의 예시 답안을 선택하고 준비된 정답과 비교하는 채점 데모입니다. 실제 AI 분석은 제공하지 않습니다.",
  "/ai-omr",
);
export default function Page() {
  return (
    <ContentPage
      eyebrow="AI OMR WORK"
      title="풀고, 확인하고, 성장하세요"
      description="답안 확인에서 오답 복습까지. 학습의 다음 단계를 만나보세요."
    >
      <OmrWorkspace />
    </ContentPage>
  );
}
