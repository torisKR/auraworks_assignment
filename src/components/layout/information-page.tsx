import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { informationPages } from "@/data/information-pages";
export function InformationPage({ kind }: { kind: keyof typeof informationPages }) {
  const page = informationPages[kind];
  return (
    <ContentPage eyebrow={page.eyebrow} title={page.title} description={page.description}>
      <div className={kind === "terms" || kind === "privacy" ? "policy-content" : "brand-content"}>
        {page.notice && <p className="demo-notice">{page.notice}</p>}
        {page.sections.map((section, index) => (
          <section className="information-section" key={section.title}>
            {kind === "about" || kind === "company" ? (
              <span className="step-number">0{index + 1}</span>
            ) : null}
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <Link className="primary-button" href="/store">
          스토어 둘러보기 →
        </Link>
      </div>
    </ContentPage>
  );
}
