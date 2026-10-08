"use client";

import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/components/layout/site-shell";
import { Icon } from "@/components/store/icon";
import { MAX_CART_QUANTITY, summarizeCart } from "@/lib/cart";
import { formatWon } from "@/lib/catalog";

export function CartContent({ onNavigate }: { onNavigate?: () => void }) {
  const { cart } = useSite();
  const summary = summarizeCart(cart.lines);
  const selectedCount = cart.entries.filter((entry) => entry.selected).length;

  if (cart.status === "loading")
    return (
      <p className="cart-state" role="status">
        장바구니의 교재를 확인하고 있습니다.
      </p>
    );
  if (cart.entries.length === 0)
    return (
      <div className="cart-empty">
        <Icon name="cart" />
        <h2>장바구니가 비어 있어요</h2>
        <p>나의 다음 성장을 위한 교재를 찾아보세요.</p>
        <Link href="/store" className="primary-button" onClick={onNavigate}>
          교재 둘러보기
        </Link>
      </div>
    );

  return (
    <div className="cart-content">
      {!cart.storageAvailable && (
        <p className="session-note" role="status">
          브라우저 저장 공간을 사용할 수 없어 장바구니는 이번 이용 중에만 유지됩니다.
        </p>
      )}
      <div className="cart-toolbar">
        <label className="cart-check">
          <input
            type="checkbox"
            checked={selectedCount === cart.entries.length}
            onChange={(event) => cart.selectAll(event.target.checked)}
          />
          전체 선택 ({selectedCount}/{cart.entries.length})
        </label>
        <button
          className="text-button"
          disabled={selectedCount === 0}
          onClick={cart.removeSelected}
        >
          선택 삭제
        </button>
      </div>
      {cart.status === "error" && (
        <div className="cart-error" role="alert">
          <p>{cart.message}</p>
          <button className="secondary-button" onClick={cart.retry}>
            다시 확인하기
          </button>
        </div>
      )}
      <div className="cart-layout">
        <ul className="cart-lines" aria-label="담은 교재">
          {cart.lines.map((line) => (
            <li className="cart-line" key={line.textbookId}>
              <input
                type="checkbox"
                aria-label={`${line.textbook?.title ?? "조회할 수 없는 교재"} ${line.textbook?.subject ?? ""} 선택`}
                checked={line.selected}
                onChange={(event) => cart.select(line.textbookId, event.target.checked)}
              />
              {line.textbook ? (
                <>
                  <Link
                    href={`/textbooks/${line.textbookId}`}
                    className="cart-cover"
                    onClick={onNavigate}
                    aria-label={`${line.textbook.title} ${line.textbook.subject} 상세 보기`}
                  >
                    <Image src={line.textbook.image_path} alt="" width={96} height={120} />
                  </Link>
                  <div className="cart-line-info">
                    <p className="product-category">
                      {line.textbook.category === "pass" ? "시즌 패스" : "단품 교재"} ·{" "}
                      {line.textbook.subject}
                    </p>
                    <Link
                      className="cart-product-title"
                      href={`/textbooks/${line.textbookId}`}
                      onClick={onNavigate}
                    >
                      {line.textbook.title}
                    </Link>
                    <p className="cart-unit-price">{formatWon(line.textbook.price)} / 권</p>
                    <div
                      className="cart-quantity"
                      aria-label={`${line.textbook.subject} 교재 수량`}
                    >
                      <button
                        aria-label={`${line.textbook.subject} 수량 줄이기`}
                        disabled={line.quantity === 1}
                        onClick={() => cart.setQuantity(line.textbookId, line.quantity - 1)}
                      >
                        −
                      </button>
                      <output aria-label={`${line.textbook.subject} 현재 수량`}>
                        {line.quantity}
                      </output>
                      <button
                        aria-label={`${line.textbook.subject} 수량 늘리기`}
                        disabled={line.quantity === MAX_CART_QUANTITY}
                        onClick={() => cart.setQuantity(line.textbookId, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    {line.quantity === MAX_CART_QUANTITY && (
                      <small>교재별 최대 99권까지 담을 수 있습니다.</small>
                    )}
                  </div>
                  <strong className="cart-line-price">
                    {formatWon(line.textbook.price * line.quantity)}
                  </strong>
                </>
              ) : (
                <div className="cart-line-info">
                  <strong>
                    {cart.status === "error"
                      ? "교재 정보를 확인할 수 없어요"
                      : "현재 판매하지 않는 교재예요"}
                  </strong>
                  <p className="muted">수량 {line.quantity}권 · 금액 합계에서 제외됩니다.</p>
                </div>
              )}
              <button
                className="cart-remove icon-button"
                aria-label={`${line.textbook?.title ?? "조회할 수 없는 교재"} ${line.textbook?.subject ?? ""} 삭제`}
                onClick={() => cart.remove(line.textbookId)}
              >
                <Icon name="close" />
              </button>
            </li>
          ))}
        </ul>
        <aside className="cart-summary" aria-label="선택한 교재 금액">
          <h2>선택한 교재</h2>
          {cart.status === "error" ? (
            <p className="muted">교재 정보를 확인한 후 금액을 안내합니다.</p>
          ) : (
            <>
              <dl>
                <div>
                  <dt>선택 수량</dt>
                  <dd>{summary.quantity}권</dd>
                </div>
                <div>
                  <dt>교재 정가</dt>
                  <dd>{formatWon(summary.subtotal + summary.discount)}</dd>
                </div>
                <div>
                  <dt>교재 할인</dt>
                  <dd>
                    {summary.discount > 0 ? "−" : ""}
                    {formatWon(summary.discount)}
                  </dd>
                </div>
              </dl>
              <p className="cart-summary-total">
                <span>교재 합계</span>
                <strong>{formatWon(summary.subtotal)}</strong>
              </p>
              {summary.unavailableCount > 0 && (
                <p className="dialog-note">
                  조회되지 않는 교재 {summary.unavailableCount}종은 합계에 포함되지 않습니다.
                </p>
              )}
            </>
          )}
          <button className="primary-button" disabled>
            주문 서비스 준비 중
          </button>
          <p className="dialog-note">
            주문이 접수되거나 비용이 청구되지 않습니다. 배송비는 주문 서비스가 열리면 안내합니다.
          </p>
          <Link className="text-button" href="/store" onClick={onNavigate}>
            교재 더 둘러보기 →
          </Link>
        </aside>
      </div>
    </div>
  );
}
