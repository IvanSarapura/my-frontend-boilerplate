'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import {
  getPaginationRange,
  type PaginationItem,
} from './get-pagination-range';
import styles from './pagination.module.css';

/** Localizable accessible names. Pass localized strings; English is the default. */
type PaginationLabels = {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
  page?: (page: number) => string;
};

const DEFAULT_LABELS: Required<PaginationLabels> = {
  first: 'First page',
  previous: 'Previous page',
  next: 'Next page',
  last: 'Last page',
  page: (page: number) => `Page ${page}`,
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number | undefined;
  boundaryCount?: number | undefined;
  showFirstLast?: boolean | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  'aria-label'?: string | undefined;
  labels?: PaginationLabels | undefined;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Pagination',
  labels,
}: PaginationProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const pages = getPaginationRange({
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount,
  });

  if (pages.length === 0) return null;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const go = (page: number) => {
    if (disabled) return;
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav
      role="navigation"
      aria-label={ariaLabel}
      className={cx(styles.pagination, className)}
    >
      <ul className={styles.list}>
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => go(1)}
              disabled={disabled || isFirst}
              aria-label={l.first}
            >
              {/* Two chevrons stacked via .tight margin render the "<<" affordance
                  without adding a chevrons-left-double icon to the registry. */}
              <ChevronLeftIcon size={14} />
              <ChevronLeftIcon size={14} className={styles.tight} />
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => go(currentPage - 1)}
            disabled={disabled || isFirst}
            aria-label={l.previous}
          >
            <ChevronLeftIcon size={16} />
          </button>
        </li>
        {pages.map((item, idx) => (
          <PageItem
            key={`${item}-${idx}`}
            item={item}
            currentPage={currentPage}
            disabled={disabled}
            onClick={go}
            pageLabel={l.page}
          />
        ))}
        <li>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => go(currentPage + 1)}
            disabled={disabled || isLast}
            aria-label={l.next}
          >
            <ChevronRightIcon size={16} />
          </button>
        </li>
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => go(totalPages)}
              disabled={disabled || isLast}
              aria-label={l.last}
            >
              {/* Mirror of the "<<" pattern above — see First page comment. */}
              <ChevronRightIcon size={14} />
              <ChevronRightIcon size={14} className={styles.tight} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

function PageItem({
  item,
  currentPage,
  disabled,
  onClick,
  pageLabel,
}: {
  item: PaginationItem;
  currentPage: number;
  disabled: boolean;
  onClick: (page: number) => void;
  pageLabel: (page: number) => string;
}) {
  if (item === 'ellipsis') {
    return (
      <li>
        <span className={styles.ellipsis} aria-hidden="true">
          …
        </span>
      </li>
    );
  }

  const isCurrent = item === currentPage;
  return (
    <li>
      <button
        type="button"
        className={cx(styles.pageButton, isCurrent && styles.current)}
        onClick={() => onClick(item)}
        disabled={disabled}
        aria-label={pageLabel(item)}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {item}
      </button>
    </li>
  );
}
