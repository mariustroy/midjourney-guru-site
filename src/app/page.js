"use client";                       // ⭐️ Client Component

import Link from "next/link"; 
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [messages, setMessages] = useState([]);   // {id:0|1, text:""}
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const STARTERS = [
  "I need help enhancing my prompt",
  "Which version of Midjourney should I use?",
  "I need a creative prompt idea",
];
const [showStarters, setShowStarters] = useState(true);
  
  /* ---------- static help markdown ---------- */
const HELP_RESPONSE = `
**Midjourney Guru – Quick Guide**  

1. **Ask anything** → _“sun‑drenched brutalist tower”_  
2. **Shift + Enter** → newline in the box  
3. **👍 / 👎** under replies → trains the bot  
4. **Reference tips**  
   • Warm prompt → add a cold photo for tension  
   • Use \`--iw\` 0.25 – 0.5 so the ref doesn’t overpower  
5. **Shortcuts**  
   \`/imagine\` auto‑added – just type the idea  
   \`--v7\` is default if you omit version  
6. **Need more?** Ping me on IG @ mariustroy 👋
`;
 
/* ---------- onboarding popup ---------- */
const [showIntro, setShowIntro] = useState(true);   // always start visible

// ⬇️  comment‑out this block while you’re designing
// useEffect(() => {
//   const seen = localStorage.getItem("guruIntroSeen");
//   if (seen) setShowIntro(false);
// }, []);

useEffect(() => {
  // Auto-insert a friendly welcome message from the bot
  setMessages([{ id: 1, text: "Hi there! I'm Midjourney Guru. How can I help you today?" }]);
}, []);

function closeIntro() {
  setShowIntro(false);
  // leave the line below commented for now
  // localStorage.setItem("guruIntroSeen", "1");
}
  
  useEffect(() => {
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  window.addEventListener('resize', setVh);
  setVh();
  return () => window.removeEventListener('resize', setVh);
}, []);

  /* auto-scroll to newest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* auto-resize the textarea */
  function resizeTextarea() {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }

async function sendMessage(e, textOverride) {
  if (e?.preventDefault) e.preventDefault();      // keep form behaviour
  const text = (textOverride ?? input).trim();    // ← use override if given
  if (!text) return;

    /* 1. show user message immediately */
    const newMsgs = [...messages, { id: 0, text }];
    setMessages(newMsgs);
    setInput("");
    resizeTextarea();
         // ② intercept the help command locally
if (text.toLowerCase() === "help" || text.toLowerCase() === "/help") {
   setMessages([...newMsgs, { id: 1, text: HELP_RESPONSE }]);
   return;                        // skip backend
 }
    setIsTyping(true);          // ← show indicator
    


    /* 2. call backend */
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMsgs.map(m =>
          m.id === 0
            ? { role: "user", content: m.text }
            : { role: "assistant", content: m.text }
        )
      })
    });

    if (!res.ok) {
      setMessages([...newMsgs, { id: 1, text: "⚠️ Error from server." }]);
      setIsTyping(false);
      return;
    }

    /* 3. extract assistant reply */
    const data = await res.json();
    const botText = data.choices[0].message.content;

    /* 4. add assistant message */
    setMessages([...newMsgs, { id: 1, text: botText }]);
    setIsTyping(false);         // ← hide indicator
  }

async function rate(index, score) {
  setFeedbackStatus((prev) => ({ ...prev, [index]: "loading" }));

  try {
    await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages[index].text,
        score,
      }),
    });
    setFeedbackStatus((prev) => ({ ...prev, [index]: "submitted" }));
  } catch (e) {
    console.error("Rate error:", e);
    setFeedbackStatus((prev) => ({ ...prev, [index]: "idle" }));
  }
}
  
async function sendStarter(text) {
  setShowStarters(false);          // hide chips
  await sendMessage(null, text);   // call with override text
}


  return (
<main
  className="w-full max-w-3xl mx-auto px-3 py-4 md:px-6 md:pl-64"          /* pushes content right of 16-rem sidebar */
  style={{
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
  }}
>
      <header
  className="w-full py-4 flex justify-center"
  style={{
    position: "sticky",
    top: 0,
    zIndex: 10,
    flexShrink: 0,
  }}
>
  <Link href="/" className="flex items-center gap-2">
    <Image
      src="/images/logo.svg"
      alt="Midjourney Guru logo"
      width={32}
      height={32}
      className="h-8 w-auto"
    />
  </Link>
</header>

   {/* Chat window */}
<div
  style={{
    border: "0px solid #eee",
    borderRadius: 8,
    padding: 10,

    flex: 1,               // fill available vertical space
    overflowY: "auto",
    marginBottom: 0,       // footer will overlap by sticky

    // bottom padding so messages don’t hide under the input
    paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0))",
  }}
>
        {messages.map((m, i) => {
          const isPrompt = m.id === 1 && m.text.startsWith("/imagine");
          return (
            <div key={i}>
              <div className={`chat-bubble ${m.id === 0 ? "from-user" : "from-bot"}`}>
               {isPrompt ? (
  // ----- Prompt parser: base • flags • suggested ref‑image -----
  (() => {
    // 1. Split the bot message by line‑breaks
    const lines = m.text.split("\n").map((l) => l.trim()).filter(Boolean);

    // 2. First line is always the base prompt (without flags)
    const base = lines.shift();

    // 3. Separate flag lines vs. the “Suggested ref‑image …” line
    const flagLines = [];
    let suggested = "";
    lines.forEach((l) => {
      if (l.startsWith("--")) flagLines.push(l);
      else suggested = l;                 // assumes only one suggestion line
    });

    return (
      <div>
        {/* base prompt */}
        {base}{" "}

        {/* all flags inline */}
        {flagLines.map((flag, idx) => (
          <span key={idx} className="text-gray-400 mx-1">
            {flag}
          </span>
        ))}

        {/* line‑break then suggestion */}
        {suggested && (
          <div className="text-gray-400 mt-1">{suggested}</div>
        )}
      </div>
    );
  })()
) : (
  <ReactMarkdown className="prose prose-invert leading-relaxed space-y-2">{m.text}</ReactMarkdown>
)}              </div>

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
            padding: 10,
            border: "1px solid #242724",
            background: "#0D170C",
            borderRadius: 12,
            resize: "none",
            overflow: "hidden",
            width: "100%",  
          }}
        />
      </form>
      <a
  href="https://docs.google.com/forms/d/e/1FAIpQLScpfr6zzb0JBkTRkeEgzeU4eV6_b7SsX27q-nPLNMIiBQ1tDA/viewform?usp=header"    /* change to your form URL */
  target="_blank"
  rel="noreferrer"
  className="fixed top-4 right-4 bg-black/70 text-white text-sm
             py-2 px-3 rounded-full backdrop-blur z-40"
>
  💬 Feedback
</a>
      {showIntro && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div className="guruintro rounded-lg max-w-md p-6 shadow-xl text-center">
      <h2 className="text-xl font-semibold mb-3">Welcome to Midjourney Guru! 🎨</h2>
      <p className="text-sm leading-relaxed mb-4">
      I am here to help you get the most out of Midjourney. <br />
        Ask me for a prompt idea, paste your own prompt for feedback,
        or type <code>help</code> to see tips.<br />
        I am comfortably multilingual - so speak to me in your language if you wish. <br />
        Shift+Enter = newline • 👍 / 👎 trains the bot.
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