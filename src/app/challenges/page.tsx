import { pageMetadata } from "@/lib/site";
import { ContentPage } from "@/components/layout/content-page";
import { ChallengeBoard } from "@/features/challenges/challenge-board";
export const metadata = pageMetadata(
  "학습 챌린지",
  "매일 30분 학습, 오답 복습, 실전 모의고사. 나에게 맞는 챌린지를 선택하고 오늘의 목표를 완료해 보세요.",
  "/challenges",
);
export default function Page() {
  return (
    <ContentPage
      eyebrow="HIDDEN CHALLENGE"
      title="함께하면, 꾸준함도 실력이 됩니다"
      description="오늘의 작은 실천을 내일의 자신감으로. 나에게 맞는 챌린지를 시작해 보세요."
    >
      <ChallengeBoard />
    </ContentPage>
  );
}
