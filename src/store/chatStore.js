import { create } from "zustand";
import { persist } from "zustand/middleware";

/*  The store keeps chat messages + any other flags you need.
    `persist` writes to localStorage under the key "guru-chat". */
export const useChatStore = create(
  persist(
    (set) => ({
      messages: [],                              // [{ role, content }, ...]
      addMessage: (m) =>
        set((s) => ({ messages: [...s.messages, m] })),
      resetChat: () => set({ messages: [] }),
    }),
    { name: "guru-chat" }
  )
);