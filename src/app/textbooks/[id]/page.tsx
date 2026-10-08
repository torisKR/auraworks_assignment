import { pageMetadata } from "@/lib/site";
import { TextbookDetailPage } from "@/features/textbooks/textbook-detail-page";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return pageMetadata(
    "교재 상세 · 더미 데이터",
    "Supabase에서 조회한 더미 교재의 가격과 상세 예시를 확인합니다. 실제 주문과 판매는 제공하지 않습니다.",
    `/textbooks/${encodeURIComponent(id)}`,
    { index: false },
  );
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TextbookDetailPage key={id} id={id} />;
}
