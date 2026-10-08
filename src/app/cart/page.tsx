import { CartPage } from "@/features/cart/cart-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "장바구니",
  "선택한 교재의 수량과 금액을 확인하세요.",
  "/cart",
  { index: false },
);
export default function Page() {
  return <CartPage />;
}
