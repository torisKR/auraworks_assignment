import Image from "next/image";
import { formatWon } from "@/lib/catalog";
import type { Textbook } from "@/types/database";

type TextbookCardProps = { textbook: Textbook; onSelect: (textbook: Textbook) => void };

export function TextbookCard({ textbook, onSelect }: TextbookCardProps) {
  return (
    <article className="textbook-card">
      <button className="product-link" onClick={() => onSelect(textbook)} aria-label={`${textbook.title} ${textbook.subject} ${textbook.category === "single" ? "단품" : "패스"} 상세 보기`}>
        <div className="product-image">
          <Image src={textbook.image_path} alt={`${textbook.title} ${textbook.subject} 교재 표지`} width={250} height={320} sizes="(max-width: 600px) 46vw, (max-width: 1000px) 28vw, 250px" />
        </div>
        <span className="product-category">{textbook.category === "single" ? "단품" : "패스"}</span>
        <h3 className="product-title">{textbook.title}</h3>
        {textbook.original_price !== null && <del className="original-price">{formatWon(textbook.original_price)}</del>}
        <span className="product-price">
          {textbook.discount_percent > 0 && <span className="discount">{textbook.discount_percent}%</span>}
          <span>{formatWon(textbook.price)}</span>
        </span>
      </button>
    </article>
  );
}
