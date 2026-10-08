import type { Metadata } from "next";
import { InformationPage } from "@/components/layout/information-page";
export const metadata: Metadata = { title: "히든카이스 소개 | HIDDEN KICE" };
export default function Page() {
  return <InformationPage kind="about" />;
}
