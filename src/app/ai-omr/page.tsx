import { pageMetadata } from "@/lib/site";
import { ContentPage } from "@/components/layout/content-page";
import { OmrWorkspace } from "@/features/omr/omr-workspace";
export const metadata = pageMetadata(
  "AI OMR WORK",
  "답안을 직접 입력하고 채점 결과와 문항별 복습 포인트를 확인하세요. 답안 확인에서 오답 복습까지 학습을 이어갑니다.",
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
