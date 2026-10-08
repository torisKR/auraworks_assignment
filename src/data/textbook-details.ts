/** Detail-only sample content; core textbook data always comes from Supabase. */
export const textbookDetail = {
  publisher: "히든카이스 에듀 · 데모 출판 정보",
  publishedAt: "2026년 9월",
  audience: "고등학교 3학년 · N수생",
  highlights: [
    "실전 감각을 위한 단계별 문제 구성",
    "핵심 개념부터 고난도 적용까지",
    "자기 주도 학습을 위한 해설과 복습 가이드",
  ],
  chapters: [
    "01. 실전 준비와 핵심 개념",
    "02. 유형별 집중 훈련",
    "03. 고난도 문제 적용",
    "04. 시즌7 실전 모의 평가",
    "05. 해설과 오답 복습",
  ],
  reviews: [
    {
      name: "김○○",
      rating: 5,
      body: "매일 조금씩 풀기 좋은 구성입니다. 해설과 함께 복습하고 있어요.",
    },
    { name: "이○○", rating: 4, body: "실전 감각을 점검하는 데 도움이 되는 예시 교재입니다." },
  ],
} as const;
