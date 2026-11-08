import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MarkdownPreviewProps {
  value: string;
  className?: string;
}

/** Renders Markdown without enabling raw HTML. */
export function MarkdownPreview({ value, className = '' }: MarkdownPreviewProps) {
  return <div className={`markdown-preview break-words leading-7 ${className}`}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
  </div>;
}
