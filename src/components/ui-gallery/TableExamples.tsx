import { useState } from 'react';
import { Pagination } from '../ui/Pagination';
import { DataTable, type TableSort } from '../ui/DataTable';
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
  const [sort, setSort] = useState<TableSort>({ key: 'code', direction: 'asc' });
  const sortedRows = [...DEMO_ROWS].sort((a, b) => {
    const key = sort.key as keyof typeof a;
    const result = a[key].localeCompare(b[key], 'zh-CN', { numeric: true });
    return sort.direction === 'asc' ? result : -result;
  });
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  return <>
        <DemoSection id="table" title="表格" description="点击列标题可排序">
          <SectionCard title="DataTable" hint="点击表头切换升序或降序，示例数据为本地模拟数据">
            <DataTable
              rows={sortedRows}
              rowKey={row => row.code}
              sort={sort}
              onSortChange={setSort}
              columns={[
                { key: 'code', title: '编号', sortable: true, render: row => row.code },
                { key: 'category', title: '分类', sortable: true, render: row => row.category },
                { key: 'status', title: '状态', sortable: true, render: row => <StatusBadge status={row.status} /> },
                { key: 'owner', title: '负责人', sortable: true, render: row => row.owner },
              ]}
            />
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
