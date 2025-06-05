"use client"; // ⭐️ Client Component

/* ---------- chat store (persisted to localStorage) ---------- */
import { useChatStore } from "@/store/chatStore";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Home component                                                     */
/* ------------------------------------------------------------------ */
export default function Home() {
  /* ---------- persisted messages ---------- */
  const messages    = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);

  /* ---------- UI state ---------- */
  const [input, setInput]            = useState("");
  const [isTyping, setIsTyping]      = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [showStarters, setShowStarters]     = useState(true);
  const [copiedIdx, setCopiedIdx]           = useState(null);   // NEW

  const textareaRef = useRef(null);
  const bottomRef   = useRef(null);

  /* ---------- starters ---------- */
  const STARTERS = [
    "I need help enhancing my prompt",
    "Which version of Midjourney should I use?",
    "I need a creative prompt idea",
  ];

  /* ---------- static help markdown ---------- */
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

  /* ---------- onboarding popup ---------- */
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem("guruIntroSeen") === "1";
    if (!seen) {
      setShowIntro(true);
      sessionStorage.setItem("guruIntroSeen", "1");
    }
  }, []);
  function closeIntro() { setShowIntro(false); }

  /* ---------- helpers ---------- */
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

  /* Strip “/imagine prompt:” and suggestion, keep flags */
function extractPrompt(fullText) {
  fullText = fullText.replace(/\bmj_version\b/gi, "--v");   // normalize
  const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);
    const base  = lines.shift().replace(/^\/imagine\s+prompt:\s*/i, "").trim();
    const flags = lines.filter((l) => l.startsWith("--")).join(" ");
    return `${base} ${flags}`.trim();
  }

  /* ---------- viewport height fix ---------- */
  useEffect(() => {
    const setVh = () =>
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    window.addEventListener("resize", setVh);
    setVh();
    return () => window.removeEventListener("resize", setVh);
  }, []);

  /* ---------- auto-scroll ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- initialise chat ---------- */
  useEffect(() => {
    if (messages.length === 0)
      setMessages(() => [
        { id: 1, text: "Hi there! I'm Midjourney Guru. How can I help you today?" },
      ]);
  }, [messages.length, setMessages]);

  /* ---------- sendMessage ---------- */
  async function sendMessage(e, textOverride) {
    if (e?.preventDefault) e.preventDefault();
    const text = (textOverride ?? input).trim();
    if (!text) return;

    const newMsgs = [...messages, { id: 0, text }];
    setMessages(newMsgs);
    setInput("");
    resizeTextarea();

    if (["help", "/help"].includes(text.toLowerCase())) {
      setMessages([...newMsgs, { id: 1, text: HELP_RESPONSE }]);
      return;
    }

    setIsTyping(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMsgs.map((m) =>
          m.id === 0 ? { role: "user", content: m.text } : { role: "assistant", content: m.text }
        ),
      }),
    });
    if (!res.ok) {
      setMessages([...newMsgs, { id: 1, text: "⚠️ Error from server." }]);
      setIsTyping(false);
      return;
    }
    const data = await res.json();
    const botText = data.choices[0].message.content;
    setMessages([...newMsgs, { id: 1, text: botText }]);
    setIsTyping(false);
  }

  /* ---------- rate ---------- */
  async function rate(index, score) {
    setFeedbackStatus((p) => ({ ...p, [index]: "loading" }));
    try {
      await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messages[index].text, score }),
      });
      setFeedbackStatus((p) => ({ ...p, [index]: "submitted" }));
    } catch {
      setFeedbackStatus((p) => ({ ...p, [index]: "idle" }));
    }
  }

  /* ---------- sendStarter ---------- */
  async function sendStarter(text) {
    setShowStarters(false);
    await sendMessage(null, text);
  }

  /* ---------- JSX ---------- */
  return (
    <main
      className="w-full max-w-6xl mx-auto px-3 py-4 md:px-6 lg:pl-64"
      style={{ fontFamily: "sans-serif", display: "flex", flexDirection: "column", height: "100dvh" }}
    >
      {/* ---------- Header ---------- */}
      <header
        className="w-full py-4 flex justify-center"
        style={{ position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.svg" alt="Midjourney Guru" width={32} height={32} className="h-8 w-auto" />
        </Link>
      </header>

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
          const isPrompt  = m.id === 1 && m.text.startsWith("/imagine");
          const bubbleCls = `chat-bubble ${m.id === 0 ? "from-user" : "from-bot"} ${isPrompt ? "relative  pr-16 pt-4" : ""}`;

          return (
            <div key={i}>
              {/* ---------- Bubble ---------- */}
              <div className={bubbleCls}>
                {/* ----- Prompt vs Markdown ----- */}
                {isPrompt ? (
                  (() => {
                    const clean = m.text.replace(/\bmj_version\b/gi, "--v");
                    const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
                    const base = lines.shift();
                    const flags = []; let suggested = "";
                    lines.forEach((l) => l.startsWith("--") ? flags.push(l) : (suggested = l));
                    return (
                      <div>
                          <span className="prompt-accent">
                            {base}{" "}
                            {flagLines.map((flag, idx) => (
                              <span key={idx} className="mx-1">
                                {flag}
                              </span>
                            ))}
                          </span>
                      
                        {suggested && <div className="text-gray-400 mt-1">{suggested}</div>}
                      </div>
                    );
                  })()
                ) : (
                  <ReactMarkdown className="prose prose-invert leading-relaxed space-y-2">
                    {m.text}
                  </ReactMarkdown>
                )}

                {/* ----- Copy button (prompt only) ----- */}
                {isPrompt && (
                  <button
                    onClick={() => {
                      copyToClipboard(extractPrompt(m.text));
                      setCopiedIdx(i);
                      setTimeout(() => setCopiedIdx(null), 2000);
                    }}
                    aria-label="Copy prompt"
                    className="absolute top-4 right-3 rounded-full p-2 bg-white/10 hover:bg-white/20 backdrop-blur"
                  >
                    <Copy className="h-4 w-4 text-[var(--brand)]" />
                  </button>
                )}

                {/* ----- Copied toast ----- */}
                {copiedIdx === i && (
                  <span className="absolute bottom-2 right-3 text-[10px] text-green-400">
                    Copied!
                  </span>
                )}
              </div>

              {/* ---------- Feedback ---------- */}
              {m.id === 1 && (
                feedbackStatus[i] === "submitted" ? (
                  <p className="text-gray-400 text-sm my-1 feedbacktext">Thank you! This will help us make Guru even better.</p>
                ) : feedbackStatus[i] === "loading" ? (
                  <p className="text-gray-500 text-sm my-1 feedbacktext">Submitting…</p>
                ) : (
                  <div className="mt-1 flex gap-2 text-gray-400 text-sm feedbacktext">
                    <button onClick={() => rate(i, 1)}  disabled={feedbackStatus[i] === "loading"}>👍</button>
                    <button onClick={() => rate(i, -1)} disabled={feedbackStatus[i] === "loading"} style={{ marginLeft: 8 }}>👎</button>
                  </div>
                )
              )}
            </div>
          );
        })}

        {/* ---------- Typing indicator ---------- */}
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

      {/* ---------- Conversation starters ---------- */}
      {showStarters && messages.filter((m) => m.id === 0).length === 0 && (
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

      {/* ---------- Input form ---------- */}
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
          marginBottom: 30,
          padding: "2rem 0 env(safe-area-inset-bottom, 1rem) 0",
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

      {/* ---------- Intro modal ---------- */}
      {showIntro && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="guruintro rounded-lg max-w-md p-6 shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-3">Welcome to Midjourney Guru!</h2>
            <p className="text-sm leading-relaxed mb-4">
              I am trained on hundreds of Marius Troy’s prompts, his Midjourney guides and all of his experience, and I am here to help you get the most out of Midjourney.<br /><br />
              Ask me for a prompt idea, paste your own prompt for feedback, or type <code>help</code> to see tips.<br /><br />
              I am comfortably multilingual – so speak to me in your own language if you wish.<br /><br />
              Shift+Enter = newline • 👍 / 👎 trains me.
            </p>
            <button onClick={closeIntro} className="bg-white text-black py-2 px-4 rounded">
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}