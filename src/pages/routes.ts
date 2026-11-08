import type { ComponentType } from 'react';
import { List, PenSquare, type LucideIcon } from 'lucide-react';
import ExampleList from './example-list';
import Blog from './blog';

/** 业务页面统一注册入口。path 使用以 / 开头的绝对路径。 */
export interface BusinessPage {
  path: string;
  label: string;
  icon: LucideIcon;
  Component: ComponentType;
}

export const businessPages: BusinessPage[] = [
  { path: '/blog', label: '博客管理', icon: PenSquare, Component: Blog },
  { path: '/example', label: '列表示例', icon: List, Component: ExampleList },
];
