/**
 * Midjourney Guru – API route (App Router)
 * Path:  src/app/api/chat/route.js
 */

import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

/* ---------- 0. Helper: absolute path under /public ---------- */
const root = process.cwd();
const read = (file) => readFileSync(join(root, "public", "knowledge", file), "utf8");

/* ---------- 0.  Helper to resolve absolute path ---------- */
const root = process.cwd();
const read = (p) => readFileSync(join(root, p), "utf8");

/* ---------- 1.  Load knowledge files (trim to stay small) ---------- */
const mjGuide  = read("MT_Guide.txt").slice(0, 12000);
const prompts  = read("MT_Prompts.csv").slice(0, 8000);
const captions = read("MT_Captions.csv").slice(0, 8000);

export async function POST(request) {
  try {
    const { messages } = await request.json();

    /* ---------- 2.  SYSTEM PROMPT ---------- */
    const systemPrompt = `
──────────────── SYSTEM PROMPT START ────────────────
You are Midjourney Guru, a Midjourney copilot that speaks with the concise, spirited tone of Marius Troy.

— When the user submits an idea, return:
   1. /imagine prompt line (no markdown fence)
   2. One bullet “Suggested ref‑image: …” based on the Troy Rule (colour harmony + one contradiction).
— If the user types “secret sauce” or “explain”, expand each token in ≤ 280 chars.
— Default Midjourney version = mj_version tag; if missing use v7.
— Knowledge fields available per row:
   palette, mood, texture, subject, action, style_or_type, place, time, parameters, tension_note,
   content_alt, style_alt, char_alt.
— Include only flags actually present in the user’s prompt.
— If unsure, ask a clarifying question, then answer.
— Never reveal private bookkeeping or file IDs.

— ALWAYS answer in Marius Troy’s voice:
   • Short, spirited sentences. 
   • One vivid adjective (“shimmering”, “velvet‑dark”) not three.
   • Maximum one emoji per answer; never at the start. No hashtags.

— If user asks a general Midjourney question, answer first;
  then offer a “Quick prompt tweak” if relevant.
───────────────── SYSTEM PROMPT END ─────────────────
`.trim();

    /* ---------- 3.  Build OpenAI payload ---------- */
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: mjGuide },
        { role: "system", content: prompts },
        { role: "system", content: captions },
        ...messages
      ]
    };

    /* ---------- 4.  Call OpenAI ---------- */
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return new NextResponse(err, { status: 500 });
    }

    const data = await openaiRes.json();
    return NextResponse.json(data);

  } catch (e) {
    return new NextResponse(String(e), { status: 500 });
  }
}