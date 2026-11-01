import React, { useState } from 'react';
import { Download, FileText, Plus, Save, Sparkles } from 'lucide-react';
import PageContext from '../page-context';
import { useFloatingAssistant } from '../../contexts/floating-assistant';
import {
  Combobox,
  EntryCard,
  EnumSelect,
  Field,
  Pagination,
  SectionCard,
  StatusBadge,
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../ui';

const DEMO_ROWS = [
  { code: 'TASK-1001', category: '设计', status: 'ACTIVE', owner: '张三' },
  { code: 'TASK-1002', category: '开发', status: 'REVIEWING', owner: '李四' },
  { code: 'TASK-1003', category: '测试', status: 'DRAFT', owner: '王五' },
  { code: 'TASK-1004', category: '文档', status: 'DEPRECATED', owner: '赵六' },
  { code: 'TASK-1005', category: '发布', status: 'ACTIVE', owner: '钱七' },
];

function DemoSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { openChat } = useFloatingAssistant();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('east');
  const [category, setCategory] = useState('设计');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-8 pb-16">
        <PageContext
          title="组件 Demo"
          description="布局、菜单与可复用控件样式示例"
          actions={
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => openChat('帮我总结一下当前页面有哪些组件示例', true)}
            >
              <Sparkles size={14} />
              打开助手
            </button>
          }
        />

        <DemoSection id="buttons" title="按钮" description="主按钮 / 次按钮 / 危险按钮">
          <SectionCard title="Button" hint="primaryButtonClass / secondaryButtonClass / dangerButtonClass">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={primaryButtonClass}>
                <Save size={14} />
                保存
              </button>
              <button type="button" className={secondaryButtonClass}>
                <Download size={14} />
                导出
              </button>
              <button type="button" className={dangerButtonClass}>
                删除
              </button>
              <button type="button" className={primaryButtonClass} disabled>
                禁用主按钮
              </button>
              <button type="button" className={secondaryButtonClass} disabled>
                禁用次按钮
              </button>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="badges" title="状态徽标" description="StatusBadge 生命周期状态">
          <SectionCard title="StatusBadge">
            <div className="flex flex-wrap items-center gap-5">
              {(['ACTIVE', 'REVIEWING', 'DRAFT', 'DEPRECATED'] as const).map(status => (
                <StatusBadge key={status} status={status} />
              ))}
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="cards" title="卡片" description="SectionCard 与入口卡片 EntryCard">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
            <EntryCard icon={FileText} label="文档中心" description="查看项目说明与使用指南" />
            <EntryCard icon={Plus} label="新建条目" description="演示入口卡片的 hover 与箭头动效" />
            <EntryCard icon={Download} label="导出报告" description="白底圆角边框的可点击入口样式" />
          </div>
        </DemoSection>

        <DemoSection id="forms" title="表单字段" description="Field + 标准 inputClass">
          <SectionCard title="Field / Input" hint="校验错误通过 Field.error 插槽展示">
            <div className="flex flex-wrap gap-3">
              <Field label="名称" required>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="请输入名称"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Field>
              <Field
                label="备注"
                error={<span className="text-xs text-red-500">示例校验错误文案</span>}
              >
                <input className={`${inputClass} w-full border-red-300`} placeholder="带错误态" defaultValue="" />
              </Field>
              <Field label="只读">
                <input className={`${inputClass} w-full opacity-60`} readOnly value="只读示例" />
              </Field>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="selects" title="枚举下拉" description="EnumSelect 手写 listbox">
          <SectionCard title="EnumSelect" hint="支持 clearable / compact">
            <div className="flex flex-wrap gap-3 max-w-xl">
              <Field label="区域" controlId="demo-region" className="w-56 flex-none">
                <EnumSelect
                  id="demo-region"
                  ariaLabel="区域"
                  clearable
                  options={[
                    { value: 'east', label: '华东' },
                    { value: 'north', label: '华北' },
                    { value: 'south', label: '华南' },
                  ]}
                  value={region}
                  onChange={setRegion}
                />
              </Field>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="combobox" title="组合框" description="Combobox 可搜索 + 自由输入">
          <SectionCard title="Combobox" hint="默认自动转大写可按需关闭">
            <div className="max-w-sm">
              <Field label="分类" controlId="demo-category" required>
                <Combobox
                  id="demo-category"
                  ariaLabel="分类"
                  value={category}
                  onChange={setCategory}
                  options={['设计', '开发', '测试', '文档', '发布']}
                  placeholder="输入或选择分类"
                  autoUppercase={false}
                />
              </Field>
            </div>
          </SectionCard>
        </DemoSection>

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
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-700">
              信息提示：这是一条普通操作反馈。
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              警告提示：请确认后再继续操作。
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              错误提示：提交失败，请稍后重试。
            </div>
          </div>
        </DemoSection>

        <DemoSection id="assistant" title="助手" description="右下角可拖拽悬浮球，点击打开对话面板">
          <SectionCard title="FloatingAssistant" hint="对话走本地 mock 流式接口，历史存 localStorage">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={primaryButtonClass} onClick={() => openChat()}>
                <Sparkles size={14} />
                打开空白会话
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => openChat('请用三句话介绍这个前端手脚架', true)}
              >
                带提示词并自动发送
              </button>
              <p className="text-xs text-slate-400">也可直接点页面右下角悬浮球</p>
            </div>
          </SectionCard>
        </DemoSection>
      </div>
    </div>
  );
}
