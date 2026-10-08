import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "이용약관 · 데모 안내",
  "과제용 사이트의 교재 조회, 더미 기능과 임시 상태를 설명하는 예시 이용약관입니다.",
  "/terms",
  { index: false },
);
export default function Page() {
  return <InformationPage kind="terms" />;
}
