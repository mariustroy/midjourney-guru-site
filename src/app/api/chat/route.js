/**
 * Midjourney Guru – API route (App Router)
 * Path:  src/app/api/chat/route.js
 */

import { readFileSync } from "fs";
import { NextResponse } from "next/server";

/* ---------- 0.  Load your knowledge files once per cold‑start ---------- */
const mjGuide  = readFileSync("knowledge/MT_Guide.txt",  "utf8");
const prompts  = readFileSync("knowledge/MT_Prompts.csv",   "utf8");
const captions = readFileSync("knowledge/MT_Captions.csv",  "utf8");
// Add more files the same way, slice below if large.

/* ---------- 1.  POST handler ---------- */
export async function POST(request) {
  try {
    const { messages } = await request.json();  // user + assistant history

    /* ---------- 2.  Core system prompt ---------- */
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
`;

    /* ---------- 3.  Build payload with knowledge injected ---------- */
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        /* Inject the knowledge files here (truncate to keep request small) */
        { role: "system", content: mjGuide.slice(0, 12000) },
        { role: "system", content: prompts.slice(0, 8000) },
        { role: "system", content: captions.slice(0, 8000) },
        /* finally add the conversation so far */
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