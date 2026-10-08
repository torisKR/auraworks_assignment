import type { Metadata } from "next";

/** Keep canonical URLs independent of Vercel's per-deployment preview hostname. */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://auraworks-assignment-seven.vercel.app",
).origin;
export const isPreviewDeployment = process.env.VERCEL_ENV === "preview";
export const siteName = "HIDDEN KICE";
export const siteDescription =
  "실전을 위한 한 단계 더 깊은 준비. 히든카이스 교재를 찾아보고, 답안 채점과 학습 챌린지로 나만의 공부 루틴을 만들어보세요.";

export const publicPages = [
  {
    path: "/",
    name: "교재 스토어",
    description: "과목별 교재와 시즌 패스를 찾아보고 학습에 맞는 구성을 선택하세요.",
  },
  {
    path: "/about",
    name: "히든카이스 소개",
    description: "좋은 문제에서 시작되는 학습의 변화와 서비스 이용 방법을 소개합니다.",
  },
  {
    path: "/ai-omr",
    name: "AI OMR WORK",
    description: "답안을 직접 입력하고 채점 결과와 문항별 복습 포인트를 확인하세요.",
  },
  {
    path: "/challenges",
    name: "학습 챌린지",
    description: "매일의 목표를 정하고 학습 습관과 오답 복습을 꾸준히 이어가세요.",
  },
] as const;

export function absoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).href;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  { index = true }: { index?: boolean } = {},
): Metadata {
  const fullTitle = `${title} | HIDDEN KICE`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: index && !isPreviewDeployment, follow: true },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName,
      locale: "ko_KR",
      images: [
        {
          url: absoluteUrl("/images/hero.png"),
          width: 1440,
          height: 490,
          alt: "히든카이스 시즌7 교재 스토어",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl("/images/hero.png")],
    },
  };
}
