import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  const { name, email, why } = await request.json();

  if (!email) return new Response("email required", { status: 400 });

  const { error } = await supa.from("waitlist").insert({ name, email, why });
  if (error) return new Response(String(error), { status: 500 });

  return new Response("ok");
}