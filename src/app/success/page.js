"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000); // redirect after 3 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 You are in!</h1>
      <p className="text-gray-300 mb-4">
        Welcome to Midjourney Guru. You now have full access to all of my deep Midjourney knowledge.
      </p>
      <p className="text-gray-500 text-sm">
        Redirecting you to Guru...
      </p>
    </div>
  );
}