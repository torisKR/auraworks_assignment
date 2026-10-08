import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "회사소개",
  "교재와 디지털 학습 도구를 연결해 배움의 가능성을 넓혀가는 히든카이스의 방향을 소개합니다.",
  "/company",
  { index: false },
);
export default function Page() {
  return <InformationPage kind="company" />;
}
