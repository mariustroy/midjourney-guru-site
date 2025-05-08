"use client";                       // ⭐️  tells Next.js this is a Client Component

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);   // {id:0|1, text:""}
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  /* auto‑scroll to newest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    /* 1. show user message immediately */
    const newMsgs = [...messages, { id: 0, text }];
    setMessages(newMsgs);
    setInput("");

    /* 2. call backend (non‑stream for simplicity) */
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMsgs.map(m =>
          m.id === 0
            ? { role: "user", content: m.text }
            : { role: "assistant", content: m.text })
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

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Midjourney Guru</h1>

      {/* Chat window */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 10,
          height: 500,
          overflowY: "auto",
          marginBottom: 20
        }}
      >
        {messages.map((m, i) => (
          <p
            key={i}
            style={{
              background: m.id === 0 ? "#e0f7fa" : "#fce4ec",
              padding: 8,
              borderRadius: 6,
              whiteSpace: "pre-wrap",
              margin: "6px 0"
            }}
          >
            {m.id === 0 ? "🧑 " : "🤖 "} {m.text}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <form onSubmit={sendMessage} style={{ display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about Midjourney…"
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 10,
            padding: "0 24px",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </form>
    </main>
  );
}