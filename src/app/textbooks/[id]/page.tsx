import { pageMetadata } from "@/lib/site";
import { TextbookDetailPage } from "@/features/textbooks/textbook-detail-page";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return pageMetadata(
    "교재 상세",
    "교재의 가격, 목차와 학습 포인트를 살펴보고 나의 실전 준비에 맞는 구성을 선택하세요.",
    `/textbooks/${encodeURIComponent(id)}`,
    { index: false },
  );
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TextbookDetailPage key={id} id={id} />;
}
