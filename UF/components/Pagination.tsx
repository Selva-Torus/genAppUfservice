"use client";

import React from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
export interface PaginationProps {
  /**
   * Current page number (1-based)
   */
  page: number;
  /**
   * Number of items per page
   */
  pageSize: number;
  /**
   * Available page size options
   */
  pageSizeOptions?: number[];
  /**
   * Total number of items
   */
  total: number;
  /**
   * Callback when pagination state changes
   */
  onUpdate: (data: { page: number; pageSize: number }) => void;
  /**
   * Size variant of the component
   */
  size?: 's' | 'm' | 'l';
  /**
   * Alignment of pagination controls
   */
  alignment?: 'start' | 'middle' | 'end';
  /**
   * Custom className
   */
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50, 100],
  total,
  onUpdate,
  size = 'm',
  alignment = 'end',
  className = "",
}) => {
  // Calculate total pages
  const pageCount = Math.ceil(total / pageSize);
  // Calculate visible page numbers
  const getVisiblePages = (): (number | "ellipsis")[] => {
    const siblingCount = 1;

    // Show all pages if 5 or fewer
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, pageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < pageCount - 1;

    // Pattern: 1, 2, 3, ..., last
    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [1, 2, 3, "ellipsis", pageCount - 1, pageCount];
    }

    // Pattern: 1, ..., secondLast, last
    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [1, 2, "ellipsis", pageCount - 2, pageCount - 1, pageCount];
    }

    // Pattern: 1, 2, ..., current, ..., last
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 2, "ellipsis", ...middleRange, "ellipsis", pageCount - 1, pageCount];
    }

    return [];
  };

  const visiblePages = getVisiblePages();

  // Calculate page info
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  // Size variants
  const sizeClasses = {
    s: {
      Button: 'min-w-[28px] h-7 px-1.5 text-xs',
      text: 'text-xs',
      select: 'px-1.5 py-0.5 text-xs'
    },
    m: {
      Button: 'min-w-[32px] h-8 px-2 text-sm',
      text: 'text-sm',
      select: 'px-2 py-1 text-sm'
    },
    l: {
      Button: 'min-w-[36px] h-9 px-3 text-base',
      text: 'text-base',
      select: 'px-3 py-1.5 text-base'
    }
  };

  const currentSize:any = sizeClasses[size];

  const buttonBaseClass = `
    inline-flex items-center justify-center
    ${currentSize?.Button} mx-0.5
    font-medium
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800
    text-gray-700 dark:text-gray-300
    hover:bg-gray-50 dark:hover:bg-gray-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-150
    rounded-md
  `;

  const activeButtonClass = `
    inline-flex items-center justify-center
    ${currentSize?.Button} mx-0.5
    font-medium
    bg-blue-600 dark:bg-blue-700
    text-white border border-blue-600 dark:border-blue-700
    hover:bg-blue-700 dark:hover:bg-blue-800
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-150
    rounded-md
  `;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      onUpdate({ page: newPage, pageSize });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onUpdate({ page: 1, pageSize: newPageSize }); // Reset to page 1 when changing page size
  };

  // Alignment classes
  const alignmentClasses = {
    start: 'justify-start',
    middle: 'justify-center',
    end: 'justify-end'
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center ${alignmentClasses[alignment]} gap-4 ${className}`}>
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2 mr-4">
          <span className={`text-gray-600 dark:text-gray-400 ${currentSize?.text}`}>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className={`
              ${currentSize?.select}
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-300
              rounded
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* First Page */}
        {/* {pageCount > 5 && (
          <Button
            className={buttonBaseClass}
            onClick={() => handlePageChange(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            <Icon data="FaFastBackward" size={16} />
          </Button>
        )} */}

        {/* Previous Page */}
        <Button
          // className={buttonBaseClass}
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          view='outlined-success'
          pin='brick-brick'
          aria-label="Previous page"
        >
          <Icon data="FaStepBackward" size={16} />
        </Button>

        {/* Page Numbers */}
        {visiblePages.map((pageNum, index) => {
          if (pageNum === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={pageNum}
              view='outlined-success'
              pin='brick-brick'
              // className={pageNum === page ? activeButtonClass : buttonBaseClass}
              onClick={() => handlePageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === page ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}

        {/* Next Page */}
        <Button
          // className={buttonBaseClass}
          view='outlined-success'
          pin='brick-brick'
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <Icon data="FaStepForward" size={16} />
        </Button>

        {/* Last Page */}
        {/* {pageCount > 5 && (
          <Button
            className={buttonBaseClass}
            onClick={() => handlePageChange(pageCount)}
            disabled={page >= pageCount}
            aria-label="Last page"
          >
            <Icon data="FaFastForward" size={16} />
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default Pagination;


