import { pageMetadata } from "@/lib/site";
import { ContentPage } from "@/components/layout/content-page";
import { ChallengeBoard } from "@/features/challenges/challenge-board";
export const metadata = pageMetadata(
  "챌린지 · 학습 체험",
  "공용 데모 계정으로 예시 학습 챌린지에 참여하고 체크리스트의 진행률을 확인합니다. 실제 기록은 저장하지 않습니다.",
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
