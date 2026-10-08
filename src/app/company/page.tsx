import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "회사소개 · 예시",
  "제공 디자인을 재현한 과제용 회사소개 페이지입니다. 실제 회사의 운영 및 고객 상담 정보가 아닙니다.",
  "/company",
  { index: false },
);
export default function Page() {
  return <InformationPage kind="company" />;
}
