import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";
export const metadata: Metadata = { title: "회사소개 | HIDDEN KICE" };
export default function Page() {
  return <InformationPage kind="company" />;
}
