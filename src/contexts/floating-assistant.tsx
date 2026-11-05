import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface FloatingAssistantContextValue {
  chatOpen: boolean;
  pendingPrompt: string;
  pendingAutoSend: boolean;
  openChat: (prompt?: string, autoSend?: boolean) => void;
  closeChat: () => void;
  clearPendingPrompt: () => void;
}

const FloatingAssistantContext = createContext<FloatingAssistantContextValue | null>(null);

const noopAssistant: FloatingAssistantContextValue = {
  chatOpen: false,
  pendingPrompt: '',
  pendingAutoSend: false,
  openChat: () => {},
  closeChat: () => {},
  clearPendingPrompt: () => {},
};

export function FloatingAssistantProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState('');
  const [pendingAutoSend, setPendingAutoSend] = useState(false);

  const openChat = useCallback((prompt?: string, autoSend = false) => {
    if (prompt) setPendingPrompt(prompt);
    setPendingAutoSend(Boolean(prompt && autoSend));
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt('');
    setPendingAutoSend(false);
  }, []);

  const value = useMemo(
    () => ({ chatOpen, pendingPrompt, pendingAutoSend, openChat, closeChat, clearPendingPrompt }),
    [chatOpen, pendingPrompt, pendingAutoSend, openChat, closeChat, clearPendingPrompt],
  );

  return (
    <FloatingAssistantContext.Provider value={value}>{children}</FloatingAssistantContext.Provider>
  );
}

/** Safe when provider is omitted (assistant disabled via config). */
export function useFloatingAssistant(): FloatingAssistantContextValue {
  return useContext(FloatingAssistantContext) ?? noopAssistant;
}
