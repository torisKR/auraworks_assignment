import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "이용약관",
  "교재 스토어, 게스트 이용, 답안 채점과 학습 챌린지의 서비스 이용 기준을 안내합니다.",
  "/terms",
  { index: false },
);
export default function Page() {
  return <InformationPage kind="terms" />;
}
