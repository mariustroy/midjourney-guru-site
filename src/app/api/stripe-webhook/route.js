import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supa = createClient(
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
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (evt.type === "checkout.session.completed") {
	  console.log("▶️ Webhook triggered: checkout.session.completed");
console.log("User ID:", session.metadata?.user_id);
console.log("Customer ID:", session.customer);
console.log("Subscription ID:", session.subscription);
    const session = evt.data.object;
    const userId = session.metadata?.user_id;
    const customerId = session.customer;

    let coupon = null;
    let discount = null;
    let discountExpires = null;

    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const stripeDiscount = subscription.discount;

      if (stripeDiscount?.coupon) {
        coupon = stripeDiscount.coupon.id;
        discount = stripeDiscount.coupon.percent_off ?? null;

        if (stripeDiscount.end) {
          discountExpires = new Date(stripeDiscount.end * 1000);
        }
      }
    } catch (err) {
      console.warn("⚠️ Could not retrieve subscription or discount info:", err.message);
    }
console.log("Updating profile with:");
console.log({
  plan: "pro",
  stripe_customer_id: session.customer,
  beta_expires: null,
  coupon_code: coupon,
  discount_percent: discount,
  discount_expires: discountExpires
});
    const { error } = await supa.from("profiles")
      .update({
        plan: "pro",
        stripe_customer_id: customerId,
        beta_expires: null,
        coupon_code: coupon,
        discount_percent: discount,
        discount_expires: discountExpires
      })
      .eq("id", userId);

   if (error) {
  console.error("❌ Supabase update failed:", error.message);
} else {
  console.log("✅ Supabase update succeeded for:", userId);
}
  }

  if (evt.type === "customer.subscription.deleted") {
    const sub = evt.data.object;
    await supa.from("profiles")
      .update({ plan: "free" })
      .eq("stripe_customer_id", sub.customer);
  }

  return new NextResponse("ok");
}

export const config = {
  api: {
    bodyParser: false,
  },
};