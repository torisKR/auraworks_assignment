import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "히든카이스 소개 · 과제용 데모",
  "AuraWorks 과제용 사이트의 교재 조회, 더미 로그인, OMR 채점 및 챌린지 범위와 자주 묻는 질문을 안내합니다.",
  "/about",
);
export default function Page() {
  return <InformationPage kind="about" />;
}
