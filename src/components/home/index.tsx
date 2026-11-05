import React from 'react';
import { Link } from 'react-router-dom';
import PageContext from '../page-context';
import { SectionCard } from '../ui/SectionCard';
import { primaryButtonClass, secondaryButtonClass } from '../ui/classes';

/**
 * Business home placeholder — replace this file for product work.
 * Component demos live at /gallery (src/components/ui-gallery).
 */
export default function HomePage() {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 pb-16 sm:px-6 lg:px-8">
        <PageContext
          title="业务首页"
          description="占位页：用业务页面覆盖本文件，或在 src/pages/ 新增路由"
        />
        <SectionCard title="下一步" hint="面向 AI / 业务开发">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>
              业务页放在 <code className="text-xs">src/pages/</code>，在 <code className="text-xs">src/pages/routes.ts</code> 注册页面
            </li>
            <li>
              业务路由和菜单从同一份页面配置生成
            </li>
            <li>
              需要控件示例时打开{' '}
              <Link className="text-blue-600 hover:underline" to="/gallery">
                /gallery
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/gallery" className={primaryButtonClass}>
              打开组件 Gallery
            </Link>
            <a
              className={secondaryButtonClass}
              href="https://github.com/ahua1314251/ai-react-vite-scanfold"
              target="_blank"
              rel="noreferrer"
            >
              仓库说明
            </a>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
