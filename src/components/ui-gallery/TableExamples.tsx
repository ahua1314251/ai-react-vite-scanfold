import { useState } from 'react';
import { Pagination } from '../ui/Pagination';
import { SectionCard } from '../ui/SectionCard';
import { StatusBadge } from '../ui/StatusBadge';

import DemoSection from './DemoSection';

const DEMO_ROWS = [
  { code: 'TASK-1001', category: '设计', status: 'ACTIVE', owner: '张三' },
  { code: 'TASK-1002', category: '开发', status: 'REVIEWING', owner: '李四' },
  { code: 'TASK-1003', category: '测试', status: 'DRAFT', owner: '王五' },
  { code: 'TASK-1004', category: '文档', status: 'DEPRECATED', owner: '赵六' },
  { code: 'TASK-1005', category: '发布', status: 'ACTIVE', owner: '钱七' },
];

export default function TableExamples() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  return <>
        <DemoSection id="table" title="表格" description="列表容器与行样式">
          <SectionCard title="Table" hint="圆角边框 + 表头分割线">
            <div className="overflow-x-auto rounded-xl border border-black/[0.07]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">编号</th>
                    <th className="px-4 py-2.5 font-medium">分类</th>
                    <th className="px-4 py-2.5 font-medium">状态</th>
                    <th className="px-4 py-2.5 font-medium">负责人</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ROWS.slice(0, pageSize).map(row => (
                    <tr key={row.code} className="border-t border-black/[0.05] hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 font-mono text-slate-800">{row.code}</td>
                      <td className="px-4 py-2.5 text-slate-600">{row.category}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{row.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="pagination" title="分页" description="Pagination 含每页条数切换">
          <SectionCard title="Pagination">
            <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={48}
              onChange={setPageNo}
              pageSizeOptions={[5, 10, 20]}
              onPageSizeChange={size => {
                setPageSize(size);
                setPageNo(1);
              }}
            />
          </SectionCard>
        </DemoSection>

        <DemoSection id="alerts" title="提示条" description="信息 / 警告 / 错误反馈">
          <div className="space-y-2.5">
            <div className="alert-info rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-700">
              信息提示：这是一条普通操作反馈。
            </div>
            <div className="alert-warning rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              警告提示：请确认后再继续操作。
            </div>
            <div className="alert-error rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              错误提示：提交失败，请稍后重试。
            </div>
          </div>
        </DemoSection>


  </>;
}
