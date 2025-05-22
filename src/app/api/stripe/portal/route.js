import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const sessions = await stripe.checkout.sessions.list({
    customer_details: { email: user.email },
    limit: 1,
  });

  const session = sessions.data[0];

  const portal = await stripe.billingPortal.sessions.create({
    customer: session.customer,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/settings`,
  });

  return NextResponse.json({ url: portal.url });
}