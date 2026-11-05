import { Menu,Moon,Orbit,PanelLeftClose,PanelLeftOpen,Sun,X } from 'lucide-react';
import { Suspense,lazy,useEffect,useState } from 'react';
import { Outlet,useLocation } from 'react-router-dom';
import { ENABLE_FLOATING_ASSISTANT } from '../../config';
import { useTheme } from '../../contexts/theme';
import { NAV_MENUS,expandedIdsForPath } from './menu-config';
import SidebarNode from './SidebarNode';
import TopSearch from './TopSearch';
const FloatingAssistant = lazy(() => import('../floating-assistant')); 

const SIDEBAR_STORAGE_KEY = 'scaffold-sidebar-collapsed';

function defaultExpandedMenus(pathname: string): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  NAV_MENUS.forEach(node => {
    if (!node.hidden && node.children?.length) defaults[node.id] = true;
  });
  return { ...defaults, ...expandedIdsForPath(pathname) };
}

export default function Layout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);
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
          <div className="flex items-center gap-2 justify-start w-full min-w-0">
            <button type="button" className="md:hidden p-2" aria-label="打开导航菜单" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
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
          </div>
        </div>
      </header>
      {mobileOpen && <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="导航菜单">
        <button type="button" className="absolute inset-0 bg-black/40" aria-label="关闭导航菜单" onClick={() => setMobileOpen(false)} />
        <aside className="relative h-full w-64 max-w-[85vw] overflow-y-auto bg-white p-3 shadow-xl">
          <button type="button" className="ml-auto block p-2" aria-label="关闭导航菜单" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          <nav>{NAV_MENUS.filter(node => !node.hidden).map(node => <SidebarNode key={node.id} node={node} depth={0} pathname={pathname} expanded={expanded} onToggle={toggle} onNavigate={() => setMobileOpen(false)} />)}</nav>
        </aside>
      </div>}
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
      {ENABLE_FLOATING_ASSISTANT ? <Suspense fallback={null}><FloatingAssistant /></Suspense> : null}
    </div>
  );
}
