import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";
export const metadata: Metadata = { title: "이용약관 | HIDDEN KICE" };
export default function Page() {
  return <InformationPage kind="terms" />;
}
