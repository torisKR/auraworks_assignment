import { formatWon } from "@/lib/catalog";
import type { Textbook } from "@/types/database";

type CartContentProps = {
  items: readonly Textbook[];
  onRemove: (index: number) => void;
};

export function CartContent({ items, onRemove }: CartContentProps) {
  if (items.length === 0) {
    return <p>장바구니가 비어 있습니다.</p>;
  }

  const total = items.reduce((amount, item) => amount + item.price, 0);

  return (
    <div className="cart-content">
      <ul>
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <span>
              {item.title}
              <small>{item.subject}</small>
            </span>
            <strong>{formatWon(item.price)}</strong>
            <button
              className="text-button"
              aria-label={`${item.subject} 교재 장바구니에서 삭제`}
              onClick={() => onRemove(index)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <p className="cart-total">
        합계 <strong>{formatWon(total)}</strong>
      </p>
      <p className="dialog-note">과제용 데모입니다. 실제 주문 및 결제는 제공하지 않습니다.</p>
    </div>
  );
}
