import React, { useState } from 'react';
import PageContext from '../../components/page-context';
import { SectionCard } from '../../components/ui/SectionCard';
import { Pagination } from '../../components/ui/Pagination';
import { inputClass } from '../../components/ui/classes';
import { exampleItems } from './data';

/** 本地数据示例。接入 API 时应增加加载、失败和重试状态。 */
export default function ExampleList() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = exampleItems.filter(item => item.name.includes(query.trim()));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return <div className="h-full overflow-auto"><div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 lg:px-8">
    <PageContext title="列表示例" description="本地模拟数据，开发业务时请替换" />
    <SectionCard title="项目列表">
      <label className="block text-sm">搜索项目<input className={`${inputClass} ml-2`} value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} /></label>
      {visible.length ? <ul className="my-4 divide-y divide-slate-100">{visible.map(item => <li className="py-3" key={item.id}>{item.name}</li>)}</ul> : <p className="py-6 text-sm text-slate-500">暂无匹配数据</p>}
      <Pagination pageNo={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
    </SectionCard>
  </div></div>;
}
