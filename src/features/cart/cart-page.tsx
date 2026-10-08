"use client";

import { CartContent } from "@/features/cart/cart-content";
import { useSite } from "@/components/layout/site-shell";

export function CartPage() {
  const { cart } = useSite();
  return (
    <div className="content-page cart-page">
      <header className="page-heading">
        <p className="eyebrow">YOUR NEXT STEP</p>
        <h1>장바구니 {cart.ready && <span className="cart-heading-count">{cart.count}</span>}</h1>
        <p>필요한 교재를 모으고, 나만의 학습을 준비하세요.</p>
      </header>
      <CartContent />
      <p className="cart-storage-note">
        장바구니는 현재 브라우저에 저장됩니다. 다른 기기와 공유되지 않으며 브라우저 데이터를 지우면
        삭제됩니다.
      </p>
    </div>
  );
}
