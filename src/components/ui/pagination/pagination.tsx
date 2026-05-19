'use client';

import { Icon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import {
  getPaginationRange,
  type PaginationItem,
} from './get-pagination-range';
import styles from './pagination.module.css';

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
}: PaginationProps) {
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
              aria-label="First page"
            >
              {/* Two chevrons stacked via .tight margin render the "<<" affordance
                  without adding a chevrons-left-double icon to the registry. */}
              <Icon name="chevron-left" size={14} />
              <Icon name="chevron-left" size={14} className={styles.tight} />
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => go(currentPage - 1)}
            disabled={disabled || isFirst}
            aria-label="Previous page"
          >
            <Icon name="chevron-left" size={16} />
          </button>
        </li>
        {pages.map((item, idx) => (
          <PageItem
            key={`${item}-${idx}`}
            item={item}
            currentPage={currentPage}
            disabled={disabled}
            onClick={go}
          />
        ))}
        <li>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => go(currentPage + 1)}
            disabled={disabled || isLast}
            aria-label="Next page"
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </li>
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => go(totalPages)}
              disabled={disabled || isLast}
              aria-label="Last page"
            >
              {/* Mirror of the "<<" pattern above — see First page comment. */}
              <Icon name="chevron-right" size={14} />
              <Icon name="chevron-right" size={14} className={styles.tight} />
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
}: {
  item: PaginationItem;
  currentPage: number;
  disabled: boolean;
  onClick: (page: number) => void;
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
        aria-label={`Page ${item}`}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {item}
      </button>
    </li>
  );
}
