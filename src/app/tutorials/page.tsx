// app/tutorials/page.tsx
"use client";

import VimeoEmbed from "@/components/VimeoEmbed";

export default function TutorialsPage() {
  return (
	<div
	  className="
		max-w-2xl mx-auto
		px-4 py-6
		pt-22 md:pt-8
		space-y-6 lg:ml-64
	  "
	>
	  <h1 className="text-[36px] leading-tight font-light">Tutorials</h1>

	  <VimeoEmbed
		id="1090238372"
		hash="8a0a5e4942"
		title="Welcome to Midjourney Guru"
	  />

	  <VimeoEmbed
		id="1090244026"
		hash="b5bfc608f4"
		title="Finding your voice in Midjourney"
	  />

	  <VimeoEmbed
		id="1090389617"
		hash="8eca7130d9"
		title="Thoughts on Midjourney v7"
	  />

	  <VimeoEmbed
		id="1094011237"
		hash="83f8411687"
		title="Midjourney Session 1: Colorful Public Space"
	  />

	  {/* Add more tutorial links/components here */}
	</div>
  );
}