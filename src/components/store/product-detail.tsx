import Image from "next/image";
import { formatWon } from "@/lib/catalog";
import type { Textbook } from "@/types/database";

type ProductDetailProps = {
  textbook: Textbook;
  onAddToCart: (textbook: Textbook) => void;
};

export function ProductDetail({ textbook, onAddToCart }: ProductDetailProps) {
  return (
    <div className="product-detail">
      <Image
        src={textbook.image_path}
        alt={`${textbook.title} 교재 표지`}
        width={250}
        height={320}
      />
      <p className="product-category">
        {textbook.subject} · {textbook.category === "single" ? "단품" : "패스"}
      </p>
      <p>{textbook.description}</p>
      <strong>{formatWon(textbook.price)}</strong>
      <button className="primary-button" onClick={() => onAddToCart(textbook)}>
        장바구니 담기
      </button>
    </div>
  );
}
