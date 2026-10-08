import { Icon } from "@/components/store/icon";
import type { CategoryFilter } from "@/lib/catalog";

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pass", label: "패스" },
  { value: "single", label: "단품" },
];

type CatalogToolbarProps = {
  search: string;
  category: CategoryFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryFilter) => void;
};

export function CatalogToolbar({ search, category, onSearchChange, onCategoryChange }: CatalogToolbarProps) {
  return (
    <div className="catalog-toolbar">
      <div className="search-field" role="search">
        <Icon name="search" />
        <label className="sr-only" htmlFor="textbook-search">교재 검색</label>
        <input id="textbook-search" type="search" placeholder="검색" value={search} onChange={(event) => onSearchChange(event.target.value)} autoComplete="off" />
        <button className="clear-search" aria-label="검색어 지우기" onClick={() => onSearchChange("")} disabled={!search}><Icon name="close" /></button>
      </div>
      <div className="category-filters" aria-label="교재 종류">
        {categories.map(({ value, label }) => (
          <button key={value} aria-pressed={category === value} onClick={() => onCategoryChange(value)}>{label}</button>
        ))}
      </div>
    </div>
  );
}
