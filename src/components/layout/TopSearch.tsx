import { Search,X } from 'lucide-react';
import React,{ useEffect,useMemo,useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type MenuMatch,activateMenuNode,searchMenus } from './menu-config';

export default function TopSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<MenuMatch[]>(() => {
    const key = keyword.trim();
    if (!key) return [];
    return searchMenus(key, 8);
  }, [keyword]);

  useEffect(() => {
    setHighlight(0);
  }, [keyword]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activate = (match: MenuMatch) => {
    activateMenuNode(match.node, navigate);
    setKeyword('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(results[highlight]);
    }
  };

  const showPanel = open && Boolean(keyword.trim());

  return (
    <div className="relative w-full max-w-2xl" ref={rootRef}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        ref={inputRef}
        value={keyword}
        onChange={e => {
          setKeyword(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-label="搜索菜单"
        placeholder="搜索菜单或组件"
        className="w-full h-9 pl-9 pr-14 rounded-xl bg-black/[0.035] border border-black/[0.04] text-[13px] text-slate-700 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]"
      />
      {keyword ? (
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600"
        >
          <X size={13} />
        </button>
      ) : (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-300 rounded px-1 py-px pointer-events-none">
          ⌘K
        </span>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 top-11 z-50 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_20px_55px_rgba(15,23,42,0.14)] overflow-hidden max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-slate-400">未匹配到菜单</div>
          ) : (
            results.map((match, index) => {
              const Icon = match.node.icon;
              return (
                <button
                  key={match.node.id}
                  type="button"
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => activate(match)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    index === highlight ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0 text-slate-400" />
                  <span className="text-sm text-slate-700 truncate">{match.node.label}</span>
                  {match.trail.length > 0 && (
                    <span className="ml-auto text-xs text-slate-400 truncate">{match.trail.join(' / ')}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

