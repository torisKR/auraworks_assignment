import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "히든카이스 소개",
  "좋은 문제에서 시작되는 변화. 교재부터 답안 채점과 학습 챌린지까지, 히든카이스의 학습 경험을 소개합니다.",
  "/about",
);
export default function Page() {
  return <InformationPage kind="about" />;
}
