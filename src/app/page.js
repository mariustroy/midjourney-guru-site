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

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    /* 1. show user message immediately */
    const newMsgs = [...messages, { id: 0, text }];
    setMessages(newMsgs);
    setInput("");
    resizeTextarea();

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
      return;
    }

    /* 3. extract assistant reply */
    const data = await res.json();
    const botText = data.choices[0].message.content;

    /* 4. add assistant message */
    setMessages([...newMsgs, { id: 1, text: botText }]);
  }

  async function rate(index, score) {
    // …your existing rate() implementation…
  }

  return (
    <main
  style={{
    maxWidth: 640,
    margin: "0 auto",
    fontFamily: "sans-serif",

    // ADD THESE THREE LINES ↓
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    paddingBottom: "2rem", 
  }}
>
      <header className="w-full py-4 flex justify-center" style={{ flexShrink: 0 }}>
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

    // REPLACE height with flex:1
    flex: 1,
    overflowY: "auto",
    marginBottom: 20,
  }}
>
        {messages.map((m, i) => {
          const isPrompt = m.id === 1 && m.text.startsWith("/imagine");
          return (
            <div key={i}>
              <div className={`chat-bubble ${m.id === 0 ? "from-user" : "from-bot"}`}>
                {isPrompt ? (
                  // Simple prompt + gray-parameters formatter
                  (() => {
                    // Split base vs. all "--" params
                    const [base, ...params] = m.text.split(/--/);
                    return (
                      <div>
                        {base.trim()}{" "}
                        {params.map((p, idx) => (
                          <span key={idx} className="text-gray-400 mx-1 break">
                            --{p.trim()}
                          </span>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  /* Render everything else as Markdown to preserve line breaks */
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                )}
              </div>

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

        <div ref={bottomRef} />
      </div>

      {/* Input form (auto-resizing textarea) */}
      <form
  id="inputmessage"
  onSubmit={sendMessage}
  style={{
    display: "flex",
    flexShrink: 0,
    width: "100%",

    // — stick this form to the bottom of the viewport
    position: "sticky",
    bottom: 0,
    zIndex: 10,

    // — match your textarea background so it looks seamless
   

    // — add a little vertical padding and safe-area inset for mobile keyboards
    paddingTop: "0.5rem",
    paddingBottom: "env(safe-area-inset-bottom, 1rem)",
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
    </main>
  );
}