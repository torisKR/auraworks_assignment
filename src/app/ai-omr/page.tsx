import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";
import { OmrWorkspace } from "@/features/omr/omr-workspace";
export const metadata: Metadata = { title: "AI OMR WORK | HIDDEN KICE" };
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
