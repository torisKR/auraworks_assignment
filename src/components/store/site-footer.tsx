type SiteFooterProps = { onOpenInfo: (title: string) => void };

export function SiteFooter({ onOpenInfo }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <nav aria-label="회사 및 정책 안내" className="footer-links">
        {["회사소개", "이용약관", "개인정보처리방침"].map((label) => <button key={label} onClick={() => onOpenInfo(label)}>{label}</button>)}
      </nav>
      <p>(주)히든카이스 | 대표: 안영호 | 사업자등록번호: 735-87-02522 <span className="business-info">(사업자정보확인)</span></p>
      <p>주소: 경기도 고양시 일산서구 일현로 97-11, 56F | 통신판매업신고: 제 2024-고양일산서-1209 | 이메일: Hidden_kice@naver.com</p>
      <p className="copyright">Copyright © 2026 히든카이스. All rights reserved.</p>
    </footer>
  );
}
