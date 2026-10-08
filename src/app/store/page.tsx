import { pageMetadata } from "@/lib/site";
import { Storefront } from "@/components/store/storefront";
export const metadata = pageMetadata(
  "교재 스토어",
  "국어·수학·영어·탐구 교재와 시즌 패스를 찾아보세요. 과목과 제목으로 검색하고 나에게 맞는 교재를 선택할 수 있습니다.",
  "/",
);
export default function StorePage() {
  return <Storefront />;
}
