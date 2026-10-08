import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="hero" aria-label="히든카이스 시리즈 소개">
      <h1 className="sr-only">히든카이스 — 모두가 푸는 건 이유가 있습니다</h1>
      <Image src="/images/hero.png" alt="상위권이 선택한 문제집, 결과로 증명된 실전 대비서. 실전 적중, 난이도별 구성, 검증된 결과." width={1440} height={490} priority sizes="100vw" className="hero-image" />
      <a className="hero-link" href="#catalog" aria-label="히든카이스 시리즈 보기"><span className="sr-only">히든카이스 시리즈 보기</span></a>
    </section>
  );
}
