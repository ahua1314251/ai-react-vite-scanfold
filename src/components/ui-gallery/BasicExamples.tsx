import { Download,FileText,Plus,Save } from 'lucide-react';
import { EntryCard } from '../ui/EntryCard';
import { SectionCard } from '../ui/SectionCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
dangerButtonClass,
primaryButtonClass,
secondaryButtonClass
} from '../ui/classes';

import DemoSection from './DemoSection';

export default function BasicExamples() {

  return <>
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


  </>;
}
