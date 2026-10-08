import type { Metadata } from "next";
import { LoginPage } from "@/features/demo-auth/login-page";
export const metadata: Metadata = { title: "로그인 | HIDDEN KICE" };
export default function Page() {
  return <LoginPage />;
}
