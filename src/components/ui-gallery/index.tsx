import { Sparkles } from 'lucide-react';
import { ENABLE_FLOATING_ASSISTANT } from '../../config';
import { useFloatingAssistant } from '../../contexts/floating-assistant';
import PageContext from '../page-context';
import {
primaryButtonClass
} from '../ui/classes';
import AssistantExample from './AssistantExample';
import AdvancedExamples from './AdvancedExamples';
import BasicExamples from './BasicExamples';
import FormExamples from './FormExamples';
import TableExamples from './TableExamples';

export default function UiGalleryPage() {
  const { openChat } = useFloatingAssistant();

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-8 pb-16">
        <PageContext
          title="组件 Gallery"
          description="控件展厅（业务页请改 src/components/home 或 src/pages）"
          actions={
            ENABLE_FLOATING_ASSISTANT ? (
              <button
                type="button"
                className={primaryButtonClass}
                onClick={() => openChat('帮我总结一下当前页面有哪些组件示例', true)}
              >
                <Sparkles size={14} />
                打开助手
              </button>
            ) : null
          }
        />

        <BasicExamples />
        <FormExamples />
        <TableExamples />
        <AdvancedExamples />
        <AssistantExample />
      </div>
    </div>
  );
}
