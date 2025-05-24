import { create } from "zustand";
import { persist } from "zustand/middleware";

/* Persisted chat state — survives route changes + refresh */
export const useChatStore = create(
  persist(
    (set) => ({
      messages: [],

      /* Replace the whole array or update it functionally */
      setMessages: (update) =>
        set((state) => ({
          messages:
            typeof update === "function" ? update(state.messages) : update,
        })),

      /* Convenience helpers (unchanged) */
      addMessage: (m) =>
        set((state) => ({ messages: [...state.messages, m] })),

      resetChat: () => set({ messages: [] }),
    }),
    { name: "guru-chat" }
  )
);