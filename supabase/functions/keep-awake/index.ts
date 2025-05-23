// supabase/functions/keep-awake/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async () => {
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  await client.rpc("pg_sleep", { seconds: 0 }); // any trivial call
  return new Response("ok");
});