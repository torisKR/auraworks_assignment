import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIDDEN KICE | 히든카이스 교재 스토어",
  description: "상위권이 선택한 문제집, 결과로 증명된 실전 대비서. 2026 히든카이스 시즌7 교재를 만나보세요.",
};

export const viewport: Viewport = { themeColor: "#8274e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
