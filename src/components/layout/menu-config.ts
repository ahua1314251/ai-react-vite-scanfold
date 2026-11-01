import {
  Activity,
  Boxes,
  FormInput,
  Home,
  LayoutDashboard,
  LucideIcon,
  MousePointerClick,
  Sparkles,
  Table2,
} from 'lucide-react';

export interface MenuNode {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  hidden?: boolean;
  url?: string;
  path?: string;
  /** 首页内 Demo 区块 id，点击后平滑滚动 */
  section?: string;
  children?: MenuNode[];
}

/** 菜单叶子通过 section 滚动到首页 Demo 区块 */
export const NAV_MENUS: MenuNode[] = [
  { id: 'home', label: '首页', icon: Home, description: '组件 Demo 总览', path: '/' },
  {
    id: 'basics',
    label: '基础控件',
    icon: MousePointerClick,
    description: '按钮、徽标、卡片等',
    section: 'buttons',
    children: [
      { id: 'buttons', label: '按钮', icon: MousePointerClick, description: '主/次/危险按钮', section: 'buttons' },
      { id: 'badges', label: '状态徽标', icon: Activity, description: 'StatusBadge 示例', section: 'badges' },
      { id: 'cards', label: '卡片', icon: Boxes, description: 'SectionCard / 入口卡片', section: 'cards' },
    ],
  },
  {
    id: 'forms',
    label: '表单组件',
    icon: FormInput,
    description: '输入框、下拉、Combobox',
    section: 'forms',
    children: [
      { id: 'fields', label: 'Field / Input', icon: FormInput, description: '表单字段容器', section: 'forms' },
      { id: 'selects', label: 'EnumSelect', icon: LayoutDashboard, description: '枚举下拉', section: 'selects' },
      { id: 'combobox', label: 'Combobox', icon: FormInput, description: '可搜索组合框', section: 'combobox' },
    ],
  },
  {
    id: 'data',
    label: '数据展示',
    icon: Table2,
    description: '表格与分页',
    section: 'table',
    children: [
      { id: 'table', label: '表格', icon: Table2, description: '列表示例', section: 'table' },
      { id: 'pagination', label: '分页', icon: LayoutDashboard, description: 'Pagination', section: 'pagination' },
    ],
  },
  {
    id: 'assistant',
    label: '助手',
    icon: Sparkles,
    description: '右下角悬浮助手',
    section: 'assistant',
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
