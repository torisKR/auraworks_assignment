/** Detail-only sample content; core textbook data always comes from Supabase. */
export const textbookDetail = {
  publisher: "히든카이스 에듀",
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
  studyNotes: [
    {
      title: "시간을 정해 풀어보세요",
      body: "문항별 풀이 시간을 기록하면 실전에서 나의 시간 배분을 점검할 수 있습니다.",
    },
    {
      title: "해설은 복습의 시작입니다",
      body: "틀린 이유를 한 줄로 정리하고, 다음 날 해설 없이 다시 풀어보세요.",
    },
  ],
} as const;
