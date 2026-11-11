import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
  noun?: string;
  onOffsetChange: (offset: number) => void;
}

type PageItem = number | "gap-start" | "gap-end";

function buildPages(current: number, count: number): PageItem[] {
  const candidates = new Set([0, count - 1, current - 1, current, current + 1]);
  const pages = [...candidates].filter((p) => p >= 0 && p < count).sort((a, b) => a - b);
  const items: PageItem[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous > 1) items.push(index === 1 ? "gap-start" : "gap-end");
    items.push(page);
  });
  return items;
}

export function Pagination({ offset, limit, total, noun = "items", onOffsetChange }: PaginationProps) {
  if (total <= limit) return null;

  const pageCount = Math.ceil(total / limit);
  const current = Math.min(Math.floor(offset / limit), pageCount - 1);
  const from = current * limit + 1;
  const to = Math.min(from + limit - 1, total);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <span className={styles.summary}>
        Showing {from.toLocaleString()}–{to.toLocaleString()} of {total.toLocaleString()} {noun}
      </span>
      <div className={styles.pages}>
        <button
          type="button"
          className={styles.page}
          disabled={current === 0}
          onClick={() => onOffsetChange((current - 1) * limit)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>
        {buildPages(current, pageCount).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              className={item === current ? styles.pageActive : styles.page}
              aria-current={item === current ? "page" : undefined}
              onClick={() => onOffsetChange(item * limit)}
            >
              {item + 1}
            </button>
          ) : (
            <span key={item} className={styles.gap}>
              …
            </span>
          ),
        )}
        <button
          type="button"
          className={styles.page}
          disabled={current >= pageCount - 1}
          onClick={() => onOffsetChange((current + 1) * limit)}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
      </div>
    </nav>
  );
}
