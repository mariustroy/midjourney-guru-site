/**
 * Midjourney Guru – API route (App Router)
 * Path:  src/app/api/chat/route.js
 */

import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

/* ---------- Helper: absolute path under /public ---------- */
const root = process.cwd();
const read = (file) =>
  readFileSync(join(root, "public", "knowledge", file), "utf8");

/* ---------- Load knowledge files (trim to stay small) ---------- */
const mjGuide  = read("MT_Guide.txt").slice(0, 12000);
const prompts  = read("MT_Prompts.csv").slice(0, 8000);
const captions = read("MT_Captions.csv").slice(0, 8000);

export async function POST(request) {
  try {
    const { messages } = await request.json();

    /* ---------- SYSTEM PROMPT ---------- */
    const systemPrompt = `
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
`.trim();

    /* ---------- Build OpenAI payload ---------- */
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: mjGuide },
        { role: "system", content: prompts },
        { role: "system", content: captions },
        ...messages,
      ],
    };

    /* ---------- Call OpenAI ---------- */
    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return new NextResponse(err, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (e) {
    return new NextResponse(String(e), { status: 500 });
  }
}
