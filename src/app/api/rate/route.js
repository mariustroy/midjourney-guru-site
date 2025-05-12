import { createClient } from "@supabase/supabase-js";
const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  const { message, score } = await request.json();
  await supa.from("feedback").insert({ text: message, score });
  return new Response("ok");
}