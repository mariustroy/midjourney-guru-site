/**
 * Midjourney Guru backend endpoint
 * Path:  src/app/api/chat/route.js
 */

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    /* ---------- 1. Read user messages ---------- */
    const { messages } = await request.json();   // array of {role, content}

    /* ---------- 2. System prompt ---------- */
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
   • Use one vivid adjective (“shimmering”, “velvet‑dark”) not three.
   • Maximum one emoji per answer; never at the start.
   • No hashtags.

— If user asks a general Midjourney question, answer first;
  then offer a “Quick prompt tweak” if relevant.
`;

    /* ---------- 3. Build the OpenAI payload ---------- */
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
      // stream is OFF for now (simpler)
    };

    /* ---------- 4. Call OpenAI Chat Completions ---------- */
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
      const errText = await openaiRes.text();
      return new NextResponse(errText, { status: 500 });
    }

    /* ---------- 5. Return JSON back to the client ---------- */
    const data = await openaiRes.json();
    return NextResponse.json(data);

  } catch (err) {
    /* Catch any unexpected error */
    return new NextResponse(String(err), { status: 500 });
  }
}