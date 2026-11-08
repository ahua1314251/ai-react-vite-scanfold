import type { ReactNode } from 'react';
import { EmptyState, LoadingState } from './Feedback';
import { Pagination, type PaginationProps } from './Pagination';
import { SearchInput } from './SearchInput';
export interface DataTableColumn<T> { key: string; title: ReactNode; render: (row: T) => ReactNode; sortable?: boolean; }
export interface TableSort { key: string; direction: 'asc' | 'desc'; }
export interface DataTableProps<T> { columns: DataTableColumn<T>[]; rows: T[]; rowKey: (row: T) => string; loading?: boolean; emptyMessage?: string; sort?: TableSort; onSortChange?: (sort: TableSort) => void; filter?: { value: string; onChange: (value: string) => void; label: string }; pagination?: PaginationProps; }
/** Sorting, filtering and pagination are controlled by the caller, including for server-side data. */
export function DataTable<T>({ columns, rows, rowKey, loading = false, emptyMessage, sort, onSortChange, filter, pagination }: DataTableProps<T>) {
  return <div className="space-y-3">{filter && <SearchInput {...filter} />}{loading ? <LoadingState /> : !rows.length ? <EmptyState title={emptyMessage} /> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200">{columns.map(column => <th scope="col" className="px-3 py-3 font-medium" key={column.key} aria-sort={sort?.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : column.sortable ? 'none' : undefined}>{column.sortable && onSortChange ? <button type="button" onClick={() => onSortChange({ key: column.key, direction: sort?.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc' })}>{column.title} {sort?.key === column.key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</button> : column.title}</th>)}</tr></thead><tbody>{rows.map(row => <tr className="border-b border-slate-100 transition-colors hover:bg-slate-100" key={rowKey(row)}>{columns.map(column => <td className="px-3 py-3" key={column.key}>{column.render(row)}</td>)}</tr>)}</tbody></table></div>}{pagination && <Pagination {...pagination} />}</div>;
}
