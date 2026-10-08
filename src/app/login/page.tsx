import { pageMetadata } from "@/lib/site";
import { LoginPage } from "@/features/demo-auth/login-page";
export const metadata = pageMetadata(
  "데모 로그인",
  "실제 계정 없이 안내된 공용 데모 계정으로 로그인 화면과 임시 사용자 상태를 체험합니다.",
  "/login",
  { index: false },
);
export default function Page() {
  return <LoginPage />;
}
