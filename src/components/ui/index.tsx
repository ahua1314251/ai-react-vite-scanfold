import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, LucideIcon, X } from 'lucide-react';

export const inputClass =
  'bg-white/90 border border-black/[0.09] rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-[0_1px_1px_rgba(15,23,42,0.02)] transition-all focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]';

export const secondaryButtonClass =
  'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-slate-600 bg-white border border-black/[0.09] hover:border-blue-300 hover:text-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export const primaryButtonClass =
  'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed';

export const dangerButtonClass =
  'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export interface FieldProps {
  label: string;
  error?: React.ReactNode;
  children: React.ReactNode;
  controlId?: string;
  required?: boolean;
  className?: string;
}

export function Field({ label, error, children, controlId, required, className }: FieldProps) {
  const labelTextClass = `text-xs text-slate-500${required ? " after:ml-0.5 after:text-red-500 after:content-['*']" : ''}`;
  const rootClass = `flex flex-col gap-1.5 ${className ?? 'min-w-[160px] flex-1'}`;
  if (controlId) {
    return (
      <div className={rootClass}>
        <label htmlFor={controlId} className={labelTextClass}>
          {label}
        </label>
        {children}
        {error}
      </div>
    );
  }
  return (
    <div className={rootClass}>
      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{label}</span>
        {children}
      </label>
      {error}
    </div>
  );
}

const STATUS_META: Record<string, { label: string; textClass: string; dotClass: string }> = {
  ACTIVE: { label: '已生效', textClass: 'text-emerald-600', dotClass: 'bg-emerald-500' },
  REVIEWING: { label: '审批中', textClass: 'text-blue-600', dotClass: 'bg-blue-500' },
  DRAFT: { label: '草稿', textClass: 'text-slate-500', dotClass: 'bg-slate-400' },
  DEPRECATED: { label: '已废弃', textClass: 'text-slate-400', dotClass: 'bg-slate-300' },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.textClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface EnumSelectProps {
  id?: string;
  ariaLabel?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  compact?: boolean;
}

export function EnumSelect({
  id,
  ariaLabel,
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled,
  clearable = false,
  compact = false,
}: EnumSelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId.replace(/:/g, '')}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedIndex = options.findIndex(option => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const triggerBase = compact
    ? 'flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-black/[0.09] bg-white/90 px-2.5 text-left text-xs text-slate-700 shadow-[0_1px_1px_rgba(15,23,42,0.02)] transition-all focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]'
    : `${inputClass} flex w-full items-center justify-between gap-2 text-left`;

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const openPanel = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(selectedIndex);
    buttonRef.current?.focus();
  };

  const commitValue = (next: string) => {
    onChange(next);
    closePanel();
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node) || root.contains(event.target)) return;
      closePanel();
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openPanel();
        return;
      }
      if (options.length === 0) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(prev =>
        prev < 0 ? (delta > 0 ? 0 : options.length - 1) : (prev + delta + options.length) % options.length,
      );
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (!open) return;
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < options.length) commitValue(options[activeIndex].value);
      return;
    }
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      closePanel();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        className={`${triggerBase} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={handleKeyDown}
      >
        <span className={`truncate ${selected ? '' : 'text-slate-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && !disabled && value !== '' && (
            <span
              role="button"
              tabIndex={0}
              aria-label="清除已选"
              className="flex h-4 w-4 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
              onClick={event => {
                event.stopPropagation();
                onChange('');
              }}
              onKeyDown={event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.stopPropagation();
                onChange('');
              }}
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 max-h-56 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-black/[0.09] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm ${
                index === activeIndex ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-blue-50'
              }`}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commitValue(option.value)}
            >
              <span className="whitespace-nowrap">{option.label}</span>
              {option.value === value ? <Check size={14} className="shrink-0 text-blue-600" /> : null}
            </li>
          ))}
          {options.length === 0 && <li className="px-3 py-1.5 text-sm text-slate-400">无可选项</li>}
        </ul>
      )}
    </div>
  );
}

export interface ComboboxProps {
  id?: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  autoUppercase?: boolean;
  error?: string;
  onBlur?: () => void;
  className?: string;
}

export function Combobox({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  placeholder,
  readOnly,
  disabled,
  autoUppercase = true,
  error,
  onBlur,
  className,
}: ComboboxProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId.replace(/:/g, '');
  const listboxId = `${baseId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const locked = readOnly === true || disabled === true;
  const normalized = autoUppercase ? value.toUpperCase() : value;

  const filtered = useMemo(() => {
    if (keyword === null) return options;
    const needle = keyword.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(option => option.toLowerCase().includes(needle));
  }, [options, keyword]);

  const itemCount = filtered.length;

  const closePanel = () => {
    setOpen(false);
    setKeyword(null);
    setActiveIndex(-1);
  };

  const openPanel = () => {
    if (locked) return;
    setOpen(true);
    setKeyword(null);
    setActiveIndex(options.findIndex(option => option === normalized));
  };

  const commitValue = (next: string) => {
    onChange(autoUppercase ? next.trim().toUpperCase() : next.trim());
    closePanel();
    onBlur?.();
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node) || root.contains(event.target)) return;
      closePanel();
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [open]);

  useEffect(() => {
    setActiveIndex(prev => (prev >= itemCount ? -1 : prev));
  }, [itemCount]);

  const showPanel = open && !locked;

  return (
    <div ref={rootRef} className={`relative ${className ?? ''}`}>
      <input
        id={id}
        type="text"
        role="combobox"
        className={`${inputClass} w-full font-mono ${
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/[0.08]' : ''
        } ${locked ? 'cursor-not-allowed opacity-60' : ''}`}
        value={normalized}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        autoComplete="off"
        aria-label={ariaLabel}
        aria-expanded={showPanel}
        aria-controls={listboxId}
        onChange={event => {
          const next = event.target.value;
          onChange(autoUppercase ? next.toUpperCase() : next);
          setKeyword(next);
          if (!open) setOpen(true);
        }}
        onKeyDown={event => {
          if (locked) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
              openPanel();
              return;
            }
            if (itemCount === 0) return;
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex(prev =>
              prev < 0 ? (delta > 0 ? 0 : itemCount - 1) : (prev + delta + itemCount) % itemCount,
            );
            return;
          }
          if (event.key === 'Enter') {
            if (!open || activeIndex < 0 || activeIndex >= itemCount) return;
            event.preventDefault();
            commitValue(filtered[activeIndex]);
            return;
          }
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            closePanel();
          }
        }}
        onBlur={() => onBlur?.()}
        onClick={() => {
          if (!showPanel) openPanel();
        }}
        onFocus={() => {
          if (!showPanel) openPanel();
        }}
      />
      {showPanel && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-black/[0.09] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
        >
          {filtered.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-3 py-1.5 font-mono text-sm ${
                index === activeIndex ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-blue-50'
              }`}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commitValue(option)}
            >
              {option}
            </li>
          ))}
          {itemCount === 0 && (
            <li className="px-3 py-1.5 text-sm text-slate-400">无匹配建议，可直接输入新值</li>
          )}
        </ul>
      )}
    </div>
  );
}

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

export function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative focus-within:z-10 bg-white/80 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mb-3 flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function EntryCard({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2 p-3.5 bg-white border border-black/[0.07] rounded-xl text-left hover:border-blue-300 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
          <Icon size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800">{label}</div>
          {description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>}
        </div>
        <ArrowRight
          size={14}
          className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1"
        />
      </div>
    </button>
  );
}
