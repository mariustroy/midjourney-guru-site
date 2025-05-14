import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supa   = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (evt.type === "checkout.session.completed") {
    const session = evt.data.object;
    await supa.from("profiles")
      .update({
        plan: "pro",
        stripe_customer_id: session.customer,
        beta_expires: null          // remove trial limit
      })
      .eq("id", session.metadata.supabase_uid);
  }

  if (evt.type === "customer.subscription.deleted") {
    const sub = evt.data.object;
    await supa.from("profiles")
      .update({ plan: "free" })
      .eq("stripe_customer_id", sub.customer);
  }

  return new NextResponse("ok");
}