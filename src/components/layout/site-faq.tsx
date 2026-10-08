import { siteFaq } from "@/data/site-faq";
import { absoluteUrl } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";

export function SiteFaq() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/about#faq"),
    mainEntity: siteFaq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <section id="faq" className="site-faq" aria-labelledby="site-faq-title">
      <h2 id="site-faq-title">자주 묻는 질문</h2>
      {siteFaq.map(({ question, answer }) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }}
      />
    </section>
  );
}
