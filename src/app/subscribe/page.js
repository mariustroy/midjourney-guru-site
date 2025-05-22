"use client";
import { useEffect } from "react";

export default function SubscribePage() {
  useEffect(() => {
    async function goToStripe() {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    }
    goToStripe();
  }, []);

  return (
    <div className="p-6 text-center">
      <p>Redirecting to Stripe checkout...</p>
    </div>
  );
}