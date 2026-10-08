import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";
export const metadata: Metadata = { title: "개인정보처리방침 | HIDDEN KICE" };
export default function Page() {
  return <InformationPage kind="privacy" />;
}
