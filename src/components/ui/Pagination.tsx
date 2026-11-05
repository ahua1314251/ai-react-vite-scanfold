import React from 'react';
import { EnumSelect } from './EnumSelect';

export interface PaginationProps {
  pageNo: number;
  pageSize: number;
  total: number;
  onChange: (pageNo: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export function Pagination({
  pageNo,
  pageSize,
  total,
  onChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  if (total <= 0) return null;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showSizeSwitcher =
    Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 && typeof onPageSizeChange === 'function';

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
      <span>共 {total} 条</span>
      <div className="flex items-center gap-2">
        {showSizeSwitcher ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs">每页</span>
            <div className="w-20">
              <EnumSelect
                compact
                ariaLabel="每页条数"
                options={pageSizeOptions!.map(size => ({ value: String(size), label: `${size} 条` }))}
                value={String(pageSize)}
                onChange={next => onPageSizeChange!(Number(next))}
              />
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="h-8 px-3 rounded-lg border border-black/[0.09] bg-white/90 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={pageNo <= 1}
          onClick={() => onChange(pageNo - 1)}
        >
          上一页
        </button>
        <span className="text-xs">
          第 {pageNo} / {totalPages} 页
        </span>
        <button
          type="button"
          className="h-8 px-3 rounded-lg border border-black/[0.09] bg-white/90 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={pageNo >= totalPages}
          onClick={() => onChange(pageNo + 1)}
        >
          下一页
        </button>
      </div>
    </div>
  );
}

