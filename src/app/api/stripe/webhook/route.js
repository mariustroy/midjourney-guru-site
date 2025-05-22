import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // Handle checkout success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    // Default values
    let couponCode = null;
    let discountPercent = null;
    let discountExpires = null;

    // Try to load full subscription object
    const subscriptionId = session.subscription;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const discount = subscription.discount;

      if (discount?.coupon) {
        couponCode = discount.coupon.id;
        discountPercent = discount.coupon.percent_off || null;

        if (discount.end) {
          discountExpires = new Date(discount.end * 1000); // Unix → Date
        }
      }
    }

    await supabase.from("profiles").update({
      plan: "pro",
      coupon_code: couponCode,
      discount_percent: discountPercent,
      discount_expires: discountExpires
    }).eq("id", userId);
  }

  return new NextResponse("ok");
}