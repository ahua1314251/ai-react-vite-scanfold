import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { inputClass } from './classes';

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
        onBlur={() => {
          closePanel();
          onBlur?.();
        }}
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

