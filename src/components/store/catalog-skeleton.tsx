export function CatalogSkeleton() {
  return (
    <div className="product-grid" role="status" aria-label="교재 목록을 불러오는 중">
      {Array.from({ length: 12 }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton-image" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line price" />
        </div>
      ))}
      <span className="sr-only">교재 목록을 불러오는 중입니다.</span>
    </div>
  );
}
