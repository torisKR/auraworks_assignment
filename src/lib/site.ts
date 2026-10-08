import type { Metadata } from "next";

/** Keep canonical URLs independent of Vercel's per-deployment preview hostname. */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://auraworks-assignment-seven.vercel.app",
).origin;
export const isPreviewDeployment = process.env.VERCEL_ENV === "preview";
export const siteName = "HIDDEN KICE · AuraWorks 과제";
export const siteDescription =
  "제공 디자인을 Next.js로 구현한 히든카이스 과제용 데모입니다. Supabase 교재 검색과 상세 조회, 더미 로그인, OMR 채점 및 챌린지를 체험할 수 있습니다.";

export const publicPages = [
  {
    path: "/",
    name: "교재 스토어",
    description: "Supabase에 저장된 더미 교재를 검색하고 상세 정보를 확인합니다.",
  },
  {
    path: "/about",
    name: "사이트 소개와 자주 묻는 질문",
    description: "과제 구현 범위와 교재 데이터 및 데모 기능을 안내합니다.",
  },
  {
    path: "/ai-omr",
    name: "AI OMR WORK 체험",
    description:
      "5문항의 예시 답안을 선택해 준비된 정답과 비교합니다. 실제 AI 분석은 제공하지 않습니다.",
  },
  {
    path: "/challenges",
    name: "학습 챌린지 체험",
    description: "데모 로그인 후 예시 챌린지에 참여하고 학습 체크 상태를 확인합니다.",
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
          alt: "히든카이스 교재 스토어 디자인 재현 데모",
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
