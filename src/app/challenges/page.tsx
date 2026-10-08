import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";
import { ChallengeBoard } from "@/features/challenges/challenge-board";
export const metadata: Metadata = { title: "챌린지 | HIDDEN KICE" };
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
