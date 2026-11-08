# 通用组件

组件和类型由 `src/components/ui/index.ts` 导出，交互示例见 `#/gallery`。具体 props 和默认值以组件源码为准。组件不包含业务接口或持久化逻辑。

## 内容编辑

- `MarkdownEditor`：受控输入，通过 `value`、`onChange` 管理文本，支持切换预览、标签、占位文字、行数和禁用状态。当前没有格式工具栏、快捷键或图片上传。
- `MarkdownPreview`：独立渲染 Markdown 和 GFM（如表格、任务列表）；不启用原始 HTML。Markdown 样式位于 `src/styles/index.css`。

```tsx
import { useState } from 'react';
import { MarkdownEditor, MarkdownPreview } from './components/ui';

function Example() {
  const [content, setContent] = useState('# 标题');
  return <>
    <MarkdownEditor value={content} onChange={setContent} label="正文" />
    <MarkdownPreview value={content} />
  </>;
}
```

示例导入路径以业务文件所在目录为准。

## 反馈、数据和导航

- `Modal`、`ConfirmDialog`：通过 `open` 和 `onClose` 控制，确认操作由调用方实现。
- `Alert`、`Toast`：展示提示；Toast 由调用方控制打开状态，`duration={0}` 时不会自动关闭。
- `EmptyState`、`LoadingState`、`ErrorState`、`Skeleton`：展示数据和加载状态；重试逻辑由调用方提供。
- `DataTable`：通过 `columns`、`rows`、`rowKey` 定义列和数据，提供加载及空状态。分页可组合现有的 `Pagination`；排序和服务端请求由调用方实现。
- `Tabs`：受控选项卡，支持左右方向键、Home 和 End。
- `DropdownMenu`：操作项通过回调执行，支持键盘打开和 Escape 关闭。

## 表单和文件

- `Field`、`EnumSelect`、`Combobox`：表单字段和选择输入。
- `TagInput`：受控字符串数组，输入后按 Enter、逗号或移出输入框添加标签。
- `DatePicker`：浏览器原生日期或本地日期时间输入，值采用原生输入格式。
- `ImageUpload`：选择图片后通过 `onChange` 返回文件或 `null`；预览地址由调用方通过 `value` 提供。
- `FileUpload`：通过 `onChange` 返回文件数组；上传进度和错误信息由调用方传入。
- `validateFields`：执行同步字段校验并返回错误对象；展示错误、异步校验和提交由调用方处理。

文件选择组件不会自行上传、保存文件或生成预览地址。使用对象 URL 时，调用方应在不再使用时释放它。
