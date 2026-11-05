import { Sparkles } from 'lucide-react';
import { ENABLE_FLOATING_ASSISTANT } from '../../config';
import { useFloatingAssistant } from '../../contexts/floating-assistant';
import { SectionCard } from '../ui/SectionCard';
import {
primaryButtonClass,
secondaryButtonClass
} from '../ui/classes';

import DemoSection from './DemoSection';

export default function AssistantExample() {
  const { openChat } = useFloatingAssistant();

  return <>
        <DemoSection id="assistant" title="助手" description="默认关闭；在 src/config.ts 设 ENABLE_FLOATING_ASSISTANT=true">
          <SectionCard title="FloatingAssistant" hint="对话走本地 mock；默认不挂载以降低 AI 干扰面">
            {ENABLE_FLOATING_ASSISTANT ? (
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
            ) : (
              <p className="text-sm text-slate-500">
                助手已关闭。需要时改 <code className="text-xs">src/config.ts</code> 中{' '}
                <code className="text-xs">ENABLE_FLOATING_ASSISTANT = true</code>。
              </p>
            )}
          </SectionCard>
        </DemoSection>
  </>;
}
