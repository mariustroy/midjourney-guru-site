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
      <header className="w-full py-4 flex justify-center">
  <a href="/" className="flex items-center gap-2">
    <img
      src="/images/logo.svg"
      alt="Midjourney Guru logo"
      className="h-8 w-auto"
    />
  </a>
</header>

      {/* Chat window */}
      <div
        style={{
          border: "0px solid #eee",
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
  className={`chat-bubble ${
    m.id === 0 ? "from-user" : "from-bot"
  }`}
>
  {m.id === 0 ? "" : ""} {m.text}
</p>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <form id="inputmessage" onSubmit={sendMessage} style={{ display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about Midjourney…"
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #242724", background: "#0D170C",borderRadius: 12
          }}
        />
      </form>
    </main>
  );
}