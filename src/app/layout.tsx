import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata("히든카이스 교재 스토어", siteDescription, "/"),
};

export const viewport: Viewport = { themeColor: "#8274e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeStructuredData({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              name: siteName,
              url: siteUrl,
              description: siteDescription,
              inLanguage: "ko-KR",
            }),
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
