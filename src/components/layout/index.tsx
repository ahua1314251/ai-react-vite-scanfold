import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Moon,
  Orbit,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Sun,
  X,
} from 'lucide-react';
import {
  MenuNode,
  MenuMatch,
  NAV_MENUS,
  activateMenuNode,
  expandedIdsForPath,
  firstActionableLeaf,
  searchMenus,
} from './menu-config';
import { useTheme } from '../../contexts/theme';
import FloatingAssistant from '../floating-assistant';

const SIDEBAR_STORAGE_KEY = 'scaffold-sidebar-collapsed';

function defaultExpandedMenus(pathname: string): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  NAV_MENUS.forEach(node => {
    if (!node.hidden && node.children?.length) defaults[node.id] = true;
  });
  return { ...defaults, ...expandedIdsForPath(pathname) };
}

function TopSearch() {
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
                  key={`menu-${match.path}`}
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

function containsPath(node: MenuNode, pathname: string): boolean {
  if (node.path === pathname) return true;
  return (node.children ?? []).some(child => containsPath(child, pathname));
}

function SidebarNode({
  node,
  depth,
  pathname,
  expanded,
  onToggle,
  collapsed = false,
}: {
  node: MenuNode;
  depth: number;
  pathname: string;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  collapsed?: boolean;
}) {
  const navigate = useNavigate();
  const Icon = node.icon;
  const visibleChildren = (node.children ?? []).filter(child => !child.hidden);
  const hasChildren = visibleChildren.length > 0;
  const isOpen = Boolean(expanded[node.id]);
  const isActive = Boolean(node.path) && node.path === pathname && !hasChildren;
  const subtreeActive = hasChildren && containsPath(node, pathname);
  const visuallyActive = isActive || (collapsed && subtreeActive);

  const indent = collapsed ? 'px-0 justify-center' : ['px-3', 'pl-8 pr-3', 'pl-11 pr-3'][Math.min(depth, 2)];
  const textSize = depth === 0 ? 'text-sm font-medium' : 'text-sm';

  return (
    <div>
      <button
        type="button"
        title={collapsed ? node.label : undefined}
        aria-label={collapsed ? node.label : undefined}
        onClick={() => {
          if (hasChildren) {
            if (collapsed) {
              if (node.path) activateMenuNode(node, navigate);
              else {
                const target = firstActionableLeaf(node);
                if (target) activateMenuNode(target, navigate);
              }
              return;
            }
            onToggle(node.id);
            if (!subtreeActive && node.path) activateMenuNode(node, navigate);
            return;
          }
          activateMenuNode(node, navigate);
        }}
        className={`relative w-full flex items-center gap-2.5 ${indent} py-2 text-left rounded-lg ${textSize} transition-all ${
          visuallyActive
            ? 'text-slate-950 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
            : subtreeActive
              ? 'text-slate-800 hover:bg-white/70'
              : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
        }`}
      >
        {visuallyActive && <span className="absolute left-0 w-0.5 h-4 rounded-full bg-blue-500" />}
        <Icon size={depth === 0 ? 16 : 14} className={`flex-shrink-0 ${visuallyActive ? 'text-blue-500' : ''}`} />
        {!collapsed && <span className="truncate flex-1">{node.label}</span>}
        {!collapsed && hasChildren && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </button>
      {!collapsed &&
        hasChildren &&
        isOpen &&
        visibleChildren.map(child => (
          <SidebarNode
            key={child.path ?? child.id}
            node={child}
            depth={depth + 1}
            pathname={pathname}
            expanded={expanded}
            onToggle={onToggle}
            collapsed={false}
          />
        ))}
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => defaultExpandedMenus(pathname));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setExpanded(prev => ({ ...prev, ...expandedIdsForPath(pathname) }));
  }, [pathname]);

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSidebar = () => {
    setSidebarCollapsed(current => {
      const next = !current;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f7] text-slate-800">
      <header className="flex-shrink-0 z-20">
        <div
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center h-16 bg-white border-b border-black/[0.06] px-3 sm:px-4 gap-3 lg:gap-5 transition-[grid-template-columns] duration-200 ${
            sidebarCollapsed
              ? 'lg:grid-cols-[68px_minmax(280px,672px)_1fr]'
              : 'lg:grid-cols-[240px_minmax(280px,672px)_1fr]'
          }`}
        >
          <div className="hidden lg:flex items-center min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 shadow-sm">
                <Orbit size={18} className="text-blue-600" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="block text-[13px] leading-4 font-semibold tracking-tight text-slate-900 whitespace-nowrap">
                    App Scaffold
                  </span>
                  <span className="block text-[10px] leading-4 text-slate-400">Layout · Menu · Components</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-start w-full min-w-0">
            <TopSearch />
          </div>
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              aria-pressed={theme === 'dark'}
              className="group grid h-9 w-9 place-items-center rounded-xl border border-black/[0.06] bg-white/70 text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button type="button" className="hidden sm:block relative p-2 rounded-xl hover:bg-black/[0.04] transition-colors">
              <Bell size={16} className="text-slate-500" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button type="button" className="hidden sm:block p-2 rounded-xl hover:bg-black/[0.04] transition-colors">
              <Settings2 size={16} className="text-slate-500" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-black/[0.08] shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=scaffold"
                alt="用户头像"
                className="w-full h-full object-cover bg-slate-100"
              />
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside
          className={`hidden md:flex flex-shrink-0 bg-[#f8f8fa] border-r border-black/[0.06] flex-col transition-[width] duration-200 ${
            sidebarCollapsed ? 'w-[68px]' : 'w-60'
          }`}
        >
          <div
            className={`flex h-11 flex-shrink-0 items-center border-b border-black/[0.05] ${
              sidebarCollapsed ? 'justify-center' : 'justify-end px-2.5'
            }`}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
              aria-label={sidebarCollapsed ? '展开菜单' : '收起菜单'}
              aria-expanded={!sidebarCollapsed}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
            {NAV_MENUS.filter(node => !node.hidden).map(node => (
              <SidebarNode
                key={node.id}
                node={node}
                depth={0}
                pathname={pathname}
                expanded={expanded}
                onToggle={toggle}
                collapsed={sidebarCollapsed}
              />
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0 min-h-0 overflow-hidden bg-[#f5f5f7]">
          <Outlet />
        </main>
      </div>
      <FloatingAssistant />
    </div>
  );
}
