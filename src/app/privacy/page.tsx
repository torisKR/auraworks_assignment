import { pageMetadata } from "@/lib/site";
import { InformationPage } from "@/components/layout/information-page";
export const metadata = pageMetadata(
  "개인정보처리방침 · 데모 안내",
  "과제용 사이트의 브라우저 임시 상태와 Supabase·Vercel 요청 범위를 설명하는 예시 안내입니다.",
  "/privacy",
  { index: false },
);
export default function Page() {
  return <InformationPage kind="privacy" />;
}
