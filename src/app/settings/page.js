"use client";
import { useEffect } from "react";

export default function SettingsPage() {
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;        // ⬅️ go to Stripe portal
      } else {
        alert("Could not load billing portal");
        window.location.href = "/";
      }
    })();
  }, []);

  return (
    <div className="p-8 text-center text-gray-400">
      Loading your subscription portal…
    </div>
  );
}