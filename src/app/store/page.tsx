import { pageMetadata } from "@/lib/site";
import { Storefront } from "@/components/store/storefront";
export const metadata = pageMetadata(
  "스토어 · 과제용 데모",
  "Supabase의 더미 교재를 제목과 과목으로 검색하고 패스·단품으로 필터링하는 CSR 스토어입니다.",
  "/",
);
export default function StorePage() {
  return <Storefront />;
}
