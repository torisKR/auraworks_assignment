import { pageMetadata } from "@/lib/site";
import { LoginPage } from "@/features/auth/login-page";
export const metadata = pageMetadata(
  "로그인 · 내 학습 공간",
  "히든카이스와 함께 나만의 학습 루틴을 시작하세요. 게스트로 학습 챌린지를 이용할 수 있습니다.",
  "/login",
  { index: false },
);
export default function Page() {
  return <LoginPage />;
}
