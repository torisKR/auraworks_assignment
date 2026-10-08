import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="회사 및 정책 안내" className="footer-links">
        <Link href="/company">회사소개</Link>
        <Link href="/terms">이용약관</Link>
        <Link href="/privacy">개인정보처리방침</Link>
      </nav>
      <p>
        (주)히든카이스 | 대표: 안영호 | 사업자등록번호: 735-87-02522{" "}
        <span className="business-info">(사업자정보확인)</span>
      </p>
      <p>
        주소: 경기도 고양시 일산서구 일현로 97-11, 56F | 통신판매업신고: 제 2024-고양일산서-1209 |
        이메일: Hidden_kice@naver.com
      </p>
      <p className="copyright">Copyright © 2026 히든카이스. All rights reserved.</p>
    </footer>
  );
}
