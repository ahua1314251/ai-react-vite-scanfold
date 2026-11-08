import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

/** 业务页面统一注册入口。path 使用以 / 开头的绝对路径。 */
export interface BusinessPage {
  path: string;
  label: string;
  icon: LucideIcon;
  Component: ComponentType;
}

export const businessPages: BusinessPage[] = [];
