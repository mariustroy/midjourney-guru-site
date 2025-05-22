import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  const session = await stripe.checkout.sessions.create({
  ...,
  discounts: req.body.coupon
    ? [{ coupon: req.body.coupon }]
    : undefined,
});

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // from Stripe dashboard
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancelled`,
    metadata: {
      user_id: user.id,
    },
  });

  return NextResponse.json({ url: session.url });
}