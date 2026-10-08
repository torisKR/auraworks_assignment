import { Icon } from "@/components/store/icon";

type SiteHeaderProps = {
  cartCount: number;
  onOpenCart: () => void;
  onOpenInfo: (title: string) => void;
};

export function SiteHeader({ cartCount, onOpenCart, onOpenInfo }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="/" aria-label="히든카이스 홈">HIDDEN KICE</a>
        <nav className="main-nav" aria-label="주 메뉴">
          <a href="#catalog" aria-current="page">스토어</a>
          <button onClick={() => onOpenInfo("AI OMR WORK")}>AI OMR WORK</button>
          <button onClick={() => onOpenInfo("챌린지")}>챌린지</button>
          <button onClick={() => onOpenInfo("히든카이스 소개")}>히든카이스 소개</button>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label={`장바구니, ${cartCount}개 상품`} onClick={onOpenCart}>
            <Icon name="cart" />{cartCount > 0 && <span className="notification-badge">{cartCount}</span>}
          </button>
          <button className="icon-button" aria-label="알림" onClick={() => onOpenInfo("알림")}>
            <Icon name="bell" /><span className="notification-badge">1</span>
          </button>
          <button className="icon-button" aria-label="마이페이지" onClick={() => onOpenInfo("마이페이지")}><Icon name="user" /></button>
        </div>
      </div>
    </header>
  );
}
