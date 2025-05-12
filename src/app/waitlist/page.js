"use client";

import { useState } from "react";
import Link from "next/link";

export default function Waitlist() {
  const [form, setForm] = useState({ name: "", email: "", why: "" });
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSent(true);
  }

  if (sent)
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h1 className="text-2xl font-semibold">🎉 You’re on the list!</h1>
        <p className="mt-2">First beta wave lands Friday.</p>
        <Link href="/" className="text-cyan-500 mt-4 inline-block">
          Back to Guru&nbsp;→
        </Link>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto mt-16 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold text-center">
        Midjourney&nbsp;Guru&nbsp;— Waitlist
      </h1>

      <input
        required
        placeholder="Name"
        className="border p-2 rounded"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        required
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <textarea
        placeholder="Why do you want Guru?"
        rows={3}
        className="border p-2 rounded"
        value={form.why}
        onChange={(e) => setForm({ ...form, why: e.target.value })}
      />

      <button
        type="submit"
        className="bg-cyan-600 text-white py-2 rounded disabled:opacity-50"
        disabled={!form.email}
      >
        Join Waitlist
      </button>
    </form>
  );
}