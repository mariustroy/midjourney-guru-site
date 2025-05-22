import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/* ------- Stripe + Supabase clients ------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY       // service role key
);

/* ------- Webhook handler ------- */
export async function POST(req) {
  /* 0. Verify signature — NEED raw body */
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Bad Stripe signature:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  /* 1. Handle “checkout.session.completed” */
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const userId = session.metadata?.user_id;          // <-- MUST be set in Checkout
    const customerId = session.customer;

    console.log("▶️  Checkout completed for UID:", userId);

    /* ----- 1a. (optional) pull coupon/discount info safely ----- */
    let couponCode = null;
    let discountPercent = null;
    let discountExpires = null;

    try {
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        const stripeDiscount = subscription.discount;
        if (stripeDiscount?.coupon) {
          couponCode = stripeDiscount.coupon.id;
          discountPercent = stripeDiscount.coupon.percent_off ?? null;
          if (stripeDiscount.end) {
            discountExpires = new Date(stripeDiscount.end * 1000);
          }
        }
      }
    } catch (err) {
      console.warn("⚠️  Could not load subscription details:", err.message);
    }

    /* ----- 1b. Update profile in Supabase ----- */
    const { error } = await supabase
      .from("profiles")
      .update({
        plan: "pro",
        stripe_customer_id: customerId,
        beta_expires: null,
        coupon_code: couponCode,
        discount_percent: discountPercent,
        discount_expires: discountExpires,
      })
      .eq("id", userId);

    if (error) {
      console.error("❌ Supabase update failed:", error.message);
    } else {
      console.log("✅ Plan set to PRO for", userId);
    }
  }

  /* 2. Handle cancellation (optional) */
  if (stripeEvent.type === "customer.subscription.deleted") {
    const subscription = stripeEvent.data.object;
    await supabase
      .from("profiles")
      .update({ plan: "free" })
      .eq("stripe_customer_id", subscription.customer);
    console.log("⚠️  Subscription cancelled — downgraded:", subscription.customer);
  }

  return new NextResponse("ok");
}

/* Stripe needs the raw body → disable Next’s body parsing */
export const config = {
  api: {
    bodyParser: false,
  },
};