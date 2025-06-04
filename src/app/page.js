"use client"; // ⭐️ Client Component

/* ---------- chat store (persisted to localStorage) ---------- */
import { useChatStore } from "@/store/chatStore";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

/* ---------- component ---------- */
export default function Home() {
  /* ----- state ----- */
  const messages = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [showStarters, setShowStarters] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  const STARTERS = [
    "I need help enhancing my prompt",
    "Which version of Midjourney should I use?",
    "I need a creative prompt idea",
  ];

  /* ----- static help markdown ----- */
  const HELP_RESPONSE = `
**Midjourney Guru – Quick Guide**  

1. **Ask anything** → _“sun-drenched brutalist tower”_  
2. **Shift + Enter** → newline in the box  
3. **👍 / 👎** under replies → trains the bot  
4. **Reference tips**  
   • Warm prompt → add a cold photo for tension  
   • Use \`--iw\` 0.25 – 0.5 so the ref doesn’t overpower  
5. **Shortcuts**  
   \`/imagine\` auto-added – just type the idea  
   \`--v7\` is default if you omit version  
6. **Need more?** Ping me on IG @ mariustroy 👋
`;

  /* ----- helpers ----- */
  function resizeTextarea() {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() =>
      alert("Could not copy. Please copy manually.")
    );
  }

  function extractPrompt(fullText) {
    const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);
    const base = lines
      .shift()
      .replace(/^\/imagine\s+prompt:\s*/i, "")
      .trim();
    const flags = lines.filter((l) => l.startsWith("--")).join(" ");
    return `${base} ${flags}`.trim();
  }

  /* ----- auto-scroll ----- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* (omitting unchanged onboarding, sendMessage, rate, etc. for brevity) */

  /* ----- render ----- */
  return (
    <main
      className="w-full max-w-6xl mx-auto px-3 py-4 md:px-6 lg:pl-64"
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
      }}
    >
      {/* header omitted for brevity */}

      {/* Chat window */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          borderRadius: 8,
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0))",
        }}
      >
        {messages.map((m, i) => {
          const isPrompt = m.id === 1 && m.text.startsWith("/imagine");
          const bubbleClass = `chat-bubble ${
            m.id === 0 ? "from-user" : "from-bot"
          } relative ${isPrompt ? "pr-12" : ""}`;

          return (
            <div key={i}>
              <div className={bubbleClass}>
                {/* ----- Prompt or Markdown ----- */}
                {isPrompt ? (
                  (() => {
                    const lines = m.text
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean);
                    const base = lines.shift();
                    const flagLines = [];
                    let suggested = "";
                    lines.forEach((l) => {
                      if (l.startsWith("--")) flagLines.push(l);
                      else suggested = l;
                    });
                    return (
                      <div>
                        {base}{" "}
                        {flagLines.map((flag, idx) => (
                          <span key={idx} className="text-gray-400 mx-1">
                            {flag}
                          </span>
                        ))}
                        {suggested && (
                          <div className="text-gray-400 mt-1">{suggested}</div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <ReactMarkdown className="prose prose-invert leading-relaxed space-y-2">
                    {m.text}
                  </ReactMarkdown>
                )}

                {/* ----- Copy button ----- */}
                {isPrompt && (
                  <button
                    onClick={() => {
                      copyToClipboard(extractPrompt(m.text));
                      setCopiedIdx(i);
                      setTimeout(() => setCopiedIdx(null), 2000);
                    }}
                    aria-label="Copy prompt"
                    className="absolute top-2 right-2 rounded-full p-2 bg-white/10 hover:bg-white/20 backdrop-blur"
                  >
                    <Copy className="h-4 w-4 text-[var(--brand)]" />
                  </button>
                )}

                {copiedIdx === i && (
                  <span className="absolute bottom-2 right-3 text-[10px] text-green-400">
                    Copied!
                  </span>
                )}
              </div>

              {/* 👍 / 👎 feedback block (unchanged) */}
              {/* ... */}
            </div>
          );
        })}

        {/* typing indicator + bottomRef */}
        {/* ... */}
      </div>

      {/* textarea, starters, intro modal (unchanged) */}
      {/* ... */}
    </main>
  );
}