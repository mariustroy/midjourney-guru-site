"use client";
import { useEffect } from "react";

export default function SettingsPage() {
  useEffect(() => {
    async function loadPortal() {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    }
    loadPortal();
  }, []);

  return (
    <div className="p-6 text-center">
      <p>Loading your subscription portal…</p>
    </div>
  );
}