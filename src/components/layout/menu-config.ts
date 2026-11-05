import { Home, LayoutDashboard, LucideIcon, Sparkles } from 'lucide-react';
import { businessPages } from '../../pages/routes';

export interface MenuNode {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  hidden?: boolean;
  url?: string;
  path?: string;
  /** Gallery demo section id — scroll target on /gallery */
  section?: string;
  children?: MenuNode[];
}

/** Keep short. Business pages: add a leaf with `path`. Gallery uses `section`. */
export const NAV_MENUS: MenuNode[] = [
  { id: 'home', label: '首页', icon: Home, description: '业务首页占位', path: '/' },
  ...businessPages.map(({ path, label, icon }) => ({ id: path, path, label, icon })),
  {
    id: 'gallery',
    label: '组件 Gallery',
    icon: LayoutDashboard,
    description: '控件展厅（可选）',
    path: '/gallery',
    children: [
      { id: 'g-buttons', label: '按钮', icon: Sparkles, description: 'Button classes', path: '/gallery', section: 'buttons' },
      { id: 'g-forms', label: '表单', icon: Sparkles, description: 'Field / Select', path: '/gallery', section: 'forms' },
      { id: 'g-table', label: '表格', icon: Sparkles, description: 'Table / Pagination', path: '/gallery', section: 'table' },
    ],
  },
];

export interface MenuMatch {
  node: MenuNode;
  trail: string[];
  path: string;
}

function firstLeafPath(node: MenuNode): string | undefined {
  if (node.path) return node.path;
  if (node.section) return `/#${node.section}`;
  for (const child of node.children ?? []) {
    const found = firstLeafPath(child);
    if (found) return found;
  }
  return undefined;
}

export function firstActionableLeaf(node: MenuNode): MenuNode | undefined {
  if (node.path || node.url || node.section) return node;
  for (const child of node.children ?? []) {
    const found = firstActionableLeaf(child);
    if (found) return found;
  }
  return undefined;
}

export function activateMenuNode(node: MenuNode, navigate: (path: string) => void): void {
  if (node.url) {
    window.open(node.url, '_blank', 'noopener,noreferrer');
    return;
  }
  navigate(node.path || '/');
  if (node.section) {
    window.requestAnimationFrame(() => {
      document.getElementById(node.section!)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else if (node.path === '/') {
    window.requestAnimationFrame(() => {
      document.querySelector('main .overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

export function searchMenus(keyword: string, limit = 8): MenuMatch[] {
  const key = keyword.trim().toLowerCase();
  if (!key) return [];

  const matches: MenuMatch[] = [];
  const walk = (nodes: MenuNode[], trail: string[]) => {
    for (const node of nodes) {
      if (node.hidden) continue;
      const path = firstLeafPath(node);
      if (path && node.label.toLowerCase().includes(key)) {
        matches.push({ node, trail, path });
      }
      if (node.children) walk(node.children, [...trail, node.label]);
    }
  };
  walk(NAV_MENUS, []);

  return matches.slice(0, limit);
}

export function expandedIdsForPath(pathname: string): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const walk = (nodes: MenuNode[], trail: string[]): boolean => {
    let hit = false;
    for (const node of nodes) {
      const selfHit = Boolean(node.path && node.path === pathname);
      const childHit = node.children ? walk(node.children, [...trail, node.id]) : false;
      if (selfHit || childHit) {
        trail.forEach(id => {
          result[id] = true;
        });
        if (childHit) result[node.id] = true;
        hit = true;
      }
    }
    return hit;
  };
  walk(NAV_MENUS, []);
  return result;
}
