// src/app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [pw, setPw] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    if (pw === process.env.NEXT_PUBLIC_GURU_PW) {
      document.cookie = "guruAuth=1; path=/";
      router.push("/");
    } else {
      alert("Wrong password 🙅‍♂️");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xs mx-auto mt-40 flex flex-col gap-3">
      <h1 className="text-xl text-center">Beta access</h1>
      <input
        type="password"
        className="border p-2 rounded"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <button className="bg-cyan-600 text-white py-2 rounded" type="submit">
        Enter
      </button>
    </form>
  );
}