"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";
import { StoreDialog } from "@/components/store/store-dialog";
import { CartContent } from "@/components/store/cart-content";
import type { Textbook } from "@/types/database";

type DemoUser = { name: string; email: string };
type SiteContextValue = {
  user: DemoUser | null;
  signIn: () => void;
  signOut: () => void;
  addToCart: (textbook: Textbook) => void;
};
const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("SiteShell 안에서 사용해야 합니다.");
  return value;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [cart, setCart] = useState<Textbook[]>([]);
  const [dialog, setDialog] = useState<"cart" | "notifications" | null>(null);
  const [announcement, setAnnouncement] = useState("");

  function addToCart(textbook: Textbook) {
    setCart((items) => [...items, textbook]);
    setAnnouncement(`${textbook.subject} 교재를 장바구니에 담았습니다.`);
    setDialog("cart");
  }

  return (
    <SiteContext.Provider
      value={{
        user,
        signIn: () => setUser({ name: "히든 러너", email: "demo@hiddenkice.test" }),
        signOut: () => setUser(null),
        addToCart,
      }}
    >
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>
      <SiteHeader
        cartCount={cart.length}
        onOpenCart={() => setDialog("cart")}
        onOpenNotifications={() => setDialog("notifications")}
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
            <CartContent
              items={cart}
              onRemove={(index) =>
                setCart((items) => items.filter((_, position) => position !== index))
              }
            />
          ) : (
            <div className="info-content">
              <p>2026 시즌7 교재가 업데이트되었습니다.</p>
              <p className="dialog-note">과제용 예시 알림입니다.</p>
            </div>
          )}
        </StoreDialog>
      )}
    </SiteContext.Provider>
  );
}
