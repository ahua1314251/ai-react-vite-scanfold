import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { inputClass } from './classes';

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
    ? 'flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-black/[0.09] bg-white/90 px-2.5 text-left text-xs text-slate-700 shadow-[0_1px_1px_rgba(15,23,42,0.02)] transition-[background-color,border-color,box-shadow,color] focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]'
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
        className={`${triggerBase} ${clearable && !disabled && value !== '' ? 'pr-12' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={handleKeyDown}
      >
        <span className={`truncate ${selected ? '' : 'text-slate-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {clearable && !disabled && value !== '' && (
        <button
          type="button"
          aria-label="清除已选"
          className="absolute right-7 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => {
            onChange('');
            closePanel();
            buttonRef.current?.focus();
          }}
        >
          <X size={12} />
        </button>
      )}
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

