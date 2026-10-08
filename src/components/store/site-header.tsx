"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/store/icon";

const navigation = [
  { href: "/store", label: "스토어" },
  { href: "/ai-omr", label: "AI OMR WORK" },
  { href: "/challenges", label: "챌린지" },
  { href: "/about", label: "히든카이스 소개" },
];
type SiteHeaderProps = {
  cartCount: number;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
};

export function SiteHeader({ cartCount, onOpenCart, onOpenNotifications }: SiteHeaderProps) {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="히든카이스 홈">
          HIDDEN KICE
        </Link>
        <nav className="main-nav" aria-label="주 메뉴">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href ||
                (href === "/store" && (pathname === "/" || pathname.startsWith("/textbooks/")))
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label={`장바구니, ${cartCount}개 상품`}
            onClick={onOpenCart}
          >
            <Icon name="cart" />
            {cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
          </button>
          <button className="icon-button" aria-label="알림" onClick={onOpenNotifications}>
            <Icon name="bell" />
            <span className="notification-badge">1</span>
          </button>
          <Link className="icon-button" href="/login" aria-label="로그인 및 마이페이지">
            <Icon name="user" />
          </Link>
        </div>
      </div>
    </header>
  );
}
