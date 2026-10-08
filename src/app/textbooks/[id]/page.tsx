import type { Metadata } from "next";
import { TextbookDetailPage } from "@/features/textbooks/textbook-detail-page";
export const metadata: Metadata = { title: "교재 상세 | HIDDEN KICE" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TextbookDetailPage key={id} id={id} />;
}
