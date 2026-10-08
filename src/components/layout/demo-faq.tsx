import { demoFaq } from "@/data/demo-faq";
import { absoluteUrl } from "@/lib/site";
import { serializeStructuredData } from "@/lib/structured-data";

export function DemoFaq() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/about#faq"),
    mainEntity: demoFaq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <section id="faq" className="demo-faq" aria-labelledby="demo-faq-title">
      <h2 id="demo-faq-title">자주 묻는 질문</h2>
      {demoFaq.map(({ question, answer }) => (
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
