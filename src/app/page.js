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
  const [copiedIdx, setCopiedIdx] = useState(null); // NEW

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  const STARTERS = [
    "I need help enhancing my prompt",
    "Which version of Midjourney should I use?",
    "I need a creative prompt idea",
  ];

  /* ----- helper: extract prompt text ----- */
  function extractPrompt(fullText) {
    const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);
    const base = lines
      .shift()
      .replace(/^\/imagine\s+prompt:\s*/i, "")
      .trim();
    const flags = lines.filter((l) => l.startsWith("--")).join(" ");
    return `${base} ${flags}`.trim();
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() =>
      alert("Could not copy. Please copy manually.")
    );
  }

  /* ---------- render ---------- */
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
      {/* ---------- Chat window ---------- */}
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
          } ${isPrompt ? "relative pr-12" : ""}`; // extra padding for icon

          return (
            <div key={i}>
              {/* ---------- bubble ---------- */}
              <div className={bubbleClass}>
                {/* prompt vs markdown ------------------------------- */}
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

                {/* copy button -------------------------------------- */}
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

                {/* copied toast ------------------------------------- */}
                {copiedIdx === i && (
                  <span className="absolute bottom-2 right-3 text-[10px] text-green-400">
                    Copied!
                  </span>
                )}
              </div>

              {/* ---------- feedback block (unchanged) ---------- */}
              {m.id === 1 && (
                feedbackStatus[i] === "submitted" ? (
                  <p className="text-gray-400 text-sm my-1 feedbacktext">
                    Thank you! This will help us make Guru even better.
                  </p>
                ) : feedbackStatus[i] === "loading" ? (
                  <p className="text-gray-500 text-sm my-1 feedbacktext">
                    Submitting…
                  </p>
                ) : (
                  <div className="mt-1 flex gap-2 text-gray-400 text-sm feedbacktext">
                    <button
                      onClick={() => rate(i, 1)}
                      disabled={feedbackStatus[i] === "loading"}
                    >
                      👍
                    </button>
                    <button
                      style={{ marginLeft: "8px" }}
                      onClick={() => rate(i, -1)}
                      disabled={feedbackStatus[i] === "loading"}
                    >
                      👎
                    </button>
                  </div>
                )
              )}
            </div>
          );
        })}

        {/* typing indicator & anchor */}
        {isTyping && (
          <div className="chat-bubble from-bot flex items-center gap-2">
            <span className="typing-dot" style={{ animationDelay: "0s" }} />
            <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
            <span className="text-sm text-gray-400">Guru is thinking…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

{/* Conversation starters */}
{showStarters && messages.filter(m => m.id === 0).length === 0 && (
  <div className="mt-4 flex flex-wrap gap-2 starterpadding">
    {STARTERS.map((s) => (
      <button
        key={s}
        onClick={() => sendStarter(s)}
        className="starterbutton px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-100"
      >
        {s}
      </button>
    ))}
  </div>
)}


      {/* Input form (auto-resizing textarea) */}
      

      <form
  id="inputmessage"
  onSubmit={sendMessage}
  style={{
    display: "flex",
    flexShrink: 0,
    width: "100%",

    position: "sticky",
    bottom: 0,
    zIndex: 10,
    marginBottom: "30px",
    padding: "2rem 0  env(safe-area-inset-bottom, 1rem) 0",
  }}
>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
          rows={1}
          placeholder="Ask me anything about Midjourney…"
          style={{
            flex: 1,
            padding: 16,
            border: "1px solid #242724",
            background: "#0D170C",
            borderRadius: 40,
            resize: "none",
            overflow: "hidden",
            width: "100%",  
          }}
        />
      </form>
      {showIntro && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div className="guruintro rounded-lg max-w-md p-6 shadow-xl text-center">
      <h2 className="text-xl font-semibold mb-3">Welcome to Midjourney Guru!</h2>
      <p className="text-sm leading-relaxed mb-4">
      I am trained on hundreds of Marius Troy&#39;s prompts, his Midjourney guides and all of his experience, and I am here to help you get the most out of Midjourney. <br /><br />
        Ask me for a prompt idea, paste your own prompt for feedback,
        or type <code>help</code> to see tips.<br /><br />
        I am comfortably multilingual - so speak to me in your own language if you wish. <br /><br />
        Shift+Enter = newline • 👍 / 👎 trains me.
      </p>
      <button
        onClick={closeIntro}
        className="bg-white text-black py-2 px-4 rounded"
      >
        Got it
      </button>
    </div>
  </div>
)}
    </main>
  );
}