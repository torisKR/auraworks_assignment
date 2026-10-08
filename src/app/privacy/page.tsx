import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "개인정보처리방침",
  "히든카이스의 게스트 이용과 학습 상태, 서비스 요청에 따른 데이터 처리 범위를 안내합니다.",
  "/privacy",
  { index: false },
);
export default function Page() {
  return <InformationPage kind="privacy" />;
}
