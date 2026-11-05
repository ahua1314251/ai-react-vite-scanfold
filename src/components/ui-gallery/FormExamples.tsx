import { useState } from 'react';
import { Combobox } from '../ui/Combobox';
import { EnumSelect } from '../ui/EnumSelect';
import { Field } from '../ui/Field';
import { SectionCard } from '../ui/SectionCard';
import {
inputClass
} from '../ui/classes';

import DemoSection from './DemoSection';

export default function FormExamples() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('east');
  const [category, setCategory] = useState('设计');

  return <>
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


  </>;
}
