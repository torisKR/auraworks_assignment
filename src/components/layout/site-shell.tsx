"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";
import { StoreDialog } from "@/components/store/store-dialog";
import { CartContent } from "@/features/cart/cart-content";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { NotificationList } from "@/features/notifications/notification-list";
import { useNotifications } from "@/hooks/use-notifications";
import type { Textbook } from "@/types/database";

type GuestUser = { name: string };
type SiteContextValue = {
  user: GuestUser | null;
  signIn: () => void;
  signOut: () => void;
  addToCart: (textbook: Textbook) => void;
  cart: ReturnType<typeof useCart>;
};
const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("SiteShell 안에서 사용해야 합니다.");
  return value;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GuestUser | null>(null);
  const cart = useCart();
  const [dialog, setDialog] = useState<"cart" | "notifications" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const { items: notifications, unreadCount, markAllAsRead } = useNotifications();

  function addToCart(textbook: Textbook) {
    cart.add(textbook.id);
    cart.retry();
    setAnnouncement(`${textbook.subject} 교재를 장바구니에 담았습니다.`);
    setDialog("cart");
  }

  return (
    <SiteContext.Provider
      value={{
        user,
        signIn: () => setUser({ name: "히든 러너" }),
        signOut: () => setUser(null),
        addToCart,
        cart,
      }}
    >
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>
      <SiteHeader
        cartCount={cart.count}
        unreadNotificationCount={unreadCount}
        onOpenCart={cart.retry}
        onOpenNotifications={() => {
          markAllAsRead();
          setDialog("notifications");
        }}
      />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <p className="sr-only" role="status">
        {announcement}
      </p>
      {dialog && (
        <StoreDialog
          title={dialog === "cart" ? "장바구니" : "알림"}
          onClose={() => setDialog(null)}
        >
          {dialog === "cart" ? (
            <>
              <CartContent onNavigate={() => setDialog(null)} />
              <Link
                href="/cart"
                className="secondary-button cart-page-link"
                onClick={() => setDialog(null)}
              >
                장바구니 페이지로 이동
              </Link>
            </>
          ) : (
            <NotificationList items={notifications} onNavigate={() => setDialog(null)} />
          )}
        </StoreDialog>
      )}
    </SiteContext.Provider>
  );
}
