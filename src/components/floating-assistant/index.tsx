import { AnimatePresence,motion } from 'framer-motion';
import {
GripVertical,
Sparkles
} from 'lucide-react';
import React,{ useEffect,useRef,useState } from 'react';
import { useFloatingAssistant } from '../../contexts/floating-assistant';

import ChatPanel from './ChatPanel';

const FAB_SIZE = 50;
const EDGE_MARGIN = 12;
const STORAGE_KEY = 'scaffold-assistant-float-y';
const DRAG_THRESHOLD = 5;

function clampFloatY(value: number): number {
  return Math.max(EDGE_MARGIN, Math.min(value, window.innerHeight - FAB_SIZE - EDGE_MARGIN));
}

function loadFloatY(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? Number(raw) : Number.NaN;
    if (Number.isFinite(stored)) return clampFloatY(stored);
  } catch {
    // localStorage 不可用时使用默认位置。
  }
  return clampFloatY(window.innerHeight * 0.56);
}

function saveFloatY(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // 不影响助手使用。
  }
}

export default function FloatingAssistant() {
  const { chatOpen, pendingPrompt, pendingAutoSend, openChat, closeChat, clearPendingPrompt } = useFloatingAssistant();
  const [floatY, setFloatY] = useState(loadFloatY);
  const [dragY, setDragY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  /** 首次打开后保持 ChatPanel 挂载，关闭只隐藏 UI，会话与 conversationId 不丢 */
  const [sessionMounted, setSessionMounted] = useState(false);
  const dragRef = useRef<{ startY: number; originY: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (chatOpen) setSessionMounted(true);
  }, [chatOpen]);

  useEffect(() => {
    const handleResize = () => {
      setFloatY(previous => {
        const next = clampFloatY(previous);
        saveFloatY(next);
        return next;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, originY: floatY, moved: false };
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = event.clientY - dragRef.current.startY;
    if (Math.abs(delta) > DRAG_THRESHOLD) dragRef.current.moved = true;
    setDragY(clampFloatY(dragRef.current.originY + delta));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { moved, startY, originY } = dragRef.current;
    dragRef.current = null;
    setIsDragging(false);
    if (moved) {
      const next = clampFloatY(originY + event.clientY - startY);
      setFloatY(next);
      setDragY(null);
      saveFloatY(next);
    } else {
      setDragY(null);
      openChat();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: isHovered || isDragging ? 0 : 15, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed right-3 z-[9999] touch-none select-none"
            style={{ top: dragY ?? floatY }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="group relative grid h-[50px] w-[50px] cursor-grab place-items-center rounded-2xl border border-blue-100 bg-white/95 text-blue-700 shadow-[0_10px_28px_rgba(37,99,235,0.16),inset_0_1px_0_white] backdrop-blur-xl active:cursor-grabbing"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="打开助手"
            >
              {isDragging ? <GripVertical size={19} className="text-blue-600" /> : <Sparkles size={20} />}
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              <span className={`pointer-events-none absolute right-[58px] whitespace-nowrap rounded-xl border border-black/[0.07] bg-white/95 px-3 py-2 text-xs font-medium text-slate-800 shadow-lg backdrop-blur-xl transition-all ${isHovered && !isDragging ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
                助手
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {sessionMounted && (
        <ChatPanel
          open={chatOpen}
          onClose={closeChat}
          initialPrompt={pendingPrompt}
          autoSend={pendingAutoSend}
          onPromptConsumed={clearPendingPrompt}
        />
      )}
    </>
  );
}
