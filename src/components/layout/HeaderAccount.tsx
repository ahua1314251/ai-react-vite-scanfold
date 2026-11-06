import { Bell, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Panel = 'notifications' | 'account' | null;

/** 展示占位状态；接入真实认证和消息接口后替换。 */
export default function HeaderAccount() {
  const [panel, setPanel] = useState<Panel>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panel) return undefined;
    const closeOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setPanel(null);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
    };
    document.addEventListener('mousedown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('mousedown', closeOutside);
      document.removeEventListener('keydown', closeEscape);
    };
  }, [panel]);

  return (
    <div ref={rootRef} className="relative flex items-center gap-1 sm:gap-2">
      <button type="button" aria-label="消息" aria-expanded={panel === 'notifications'} aria-controls="header-notifications" onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')} className="header-icon grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
        <Bell size={17} />
      </button>
      <button type="button" aria-label="账户" aria-expanded={panel === 'account'} aria-controls="header-account" onClick={() => setPanel(panel === 'account' ? null : 'account')} className="header-avatar grid h-9 w-9 place-items-center rounded-full border border-black/[0.09] bg-slate-100 text-slate-600 transition-colors hover:border-blue-300" >
        <UserRound size={17} />
      </button>
      {panel && (
        <div id={panel === 'account' ? 'header-account' : 'header-notifications'} className="header-popover absolute right-0 top-12 z-50 w-64 max-w-[calc(100vw-24px)] rounded-xl border border-black/[0.09] bg-white p-4 shadow-xl">
          {panel === 'notifications' ? (
            <>
              <div className="flex items-center justify-between gap-2"><h2 className="text-sm font-semibold text-slate-900">消息</h2><span className="text-xs text-slate-400">演示状态</span></div>
              <div className="py-6 text-center"><Bell size={20} className="mx-auto text-slate-400" /><p className="mt-2 text-sm text-slate-600">暂无消息</p><p className="mt-1 text-xs text-slate-400">消息服务尚未接入</p></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3"><span className="header-avatar grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600"><UserRound size={19} /></span><div><h2 className="text-sm font-semibold text-slate-900">访客</h2><p className="mt-0.5 text-xs text-slate-400">演示状态</p></div></div>
              <p className="mt-4 border-t border-black/[0.09] pt-3 text-xs leading-5 text-slate-500">登录功能尚未接入</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
