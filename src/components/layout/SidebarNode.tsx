import { ChevronDown,ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type MenuNode,activateMenuNode,firstActionableLeaf } from './menu-config';

function containsPath(node: MenuNode, pathname: string): boolean {
  if (node.path === pathname) return true;
  return (node.children ?? []).some(child => containsPath(child, pathname));
}

export default function SidebarNode({
  node,
  depth,
  pathname,
  expanded,
  onToggle,
  collapsed = false,
  onNavigate,
}: {
  node: MenuNode;
  depth: number;
  pathname: string;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  collapsed?: boolean;
  onNavigate?: () => void;
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
              if (node.path) { activateMenuNode(node, navigate); onNavigate?.(); }
              else {
                const target = firstActionableLeaf(node);
                if (target) { activateMenuNode(target, navigate); onNavigate?.(); }
              }
              return;
            }
            onToggle(node.id);
            if (!subtreeActive && node.path) { activateMenuNode(node, navigate); onNavigate?.(); }
            return;
          }
          activateMenuNode(node, navigate);
          onNavigate?.();
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
            key={child.id}
            node={child}
            depth={depth + 1}
            pathname={pathname}
            expanded={expanded}
            onToggle={onToggle}
            collapsed={false}
            onNavigate={onNavigate}
          />
        ))}
    </div>
  );
}

