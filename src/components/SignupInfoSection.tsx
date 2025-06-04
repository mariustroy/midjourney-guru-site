'use client';

import { useState } from 'react';
import {
  BrainCog,
  FolderArchive,
  PlaySquare,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

/* ---------------- feature data ---------------- */
const FEATURES = [
  {
	icon: BrainCog,
	title: 'Prompt-Smith AI',
	text: 'Chat like you would with a human mentor and walk away with optimized prompts in seconds.',
  },
  {
	icon: FolderArchive,
	title: '30+ Personal Prompts',
	text: 'Steal my best work: real-world prompts grouped by style, subject & lighting—ready to copy & tweak.',
  },
  {
	icon: PlaySquare,
	title: 'Bite-Sized Video Walkthroughs',
	text: 'Watch me build prompts live and explain every parameter and reference-image trick.',
  },
  {
	icon: BookOpen,
	title: 'Helpful Resources',
	text: 'Hand-picked image libraries, Pinterest boards & colour palettes to jump-start your next idea.',
  },
];

/* ---------------- local accordion ---------------- */
function FAQItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
	<div className="border border-gray-700/60 rounded-lg">
	  <button
		onClick={() => setOpen(!open)}
		className="w-full flex items-center justify-between px-4 py-3 text-left"
	  >
		<span>{q}</span>
		<ChevronDown
		  className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
		/>
	  </button>
	  {open && (
		<div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">
		  {a}
		</div>
	  )}
	</div>
  );
}

/* ---------------- main section ---------------- */
export default function SignupInfoSection() {
  return (
<section
    id="about"
    className="w-full max-w-5xl mx-auto mt-24 space-y-24 px-4 bg-[#131B0E]"
  >
	  {/* ---------- Feature grid ---------- */}
	  <div className="grid gap-10 md:grid-cols-2">
		{FEATURES.map(({ icon: Icon, title, text }) => (
		  <div key={title} className="flex gap-4">
			<Icon className="h-10 w-10 text-brand shrink-0" />
			<div>
			  <h3 className="text-lg font-semibold">{title}</h3>
			  <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
			</div>
		  </div>
		))}
	  </div>

	  {/* ---------- FAQ ---------- */}
	  <div className="space-y-6 max-w-2xl mx-auto">
		<h2 className="text-center text-2xl font-semibold">FAQ</h2>

		<div className="space-y-3">
		  <FAQItem
			q="Do I need a paid Midjourney account?"
			a="Yes. Guru is a companion that helps you craft prompts; you still need a Midjourney subscription to generate images on their platform."
		  />
		  <FAQItem
			q="Does the AI use my private prompts?"
			a="No. Guru only sees what you send in the chat. Your private Midjourney prompts remain private unless you share them."
		  />
		  <FAQItem
			q="Can I cancel any time?"
			a="Absolutely. Manage your subscription in one click from your settings page—no emails, no phone calls."
		  />
		</div>
	  </div>

	  {/* ---------- Secondary CTA ---------- */}
	  <div className="text-center space-y-4 pb-24">
		<h2 className="text-2xl font-semibold">Ready to create otherworldly images?</h2>
		<p className="text-sm text-gray-400">
		  Join hundreds of creatives mastering Midjourney the smart way.
		</p>
		<a
		   href="#email-signup"
		   className="inline-block bg-[var(--brand)] text-[#141A10] px-6 py-3 rounded-full font-medium hover:bg-[#E8E455] transition"
		 >
		  Get Started – $7 / month
		</a>
		<p className="text-xs text-gray-500">Cancel any time.</p>
	  </div>
	</section>
  );
}