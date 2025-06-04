'use client';

import {
  BrainCog,
  FolderArchive,
  PlaySquare,
  BookOpen,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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

export default function SignupInfoSection() {
  return (
	<section id="about" className="w-full max-w-5xl mx-auto mt-24 space-y-24 px-4">
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

		<Accordion type="single" collapsible className="space-y-2">
		  <AccordionItem value="q1">
			<AccordionTrigger>Do I need a paid Midjourney account?</AccordionTrigger>
			<AccordionContent>
			  Yes. Guru is a companion that helps you craft prompts; you still need a Midjourney
			  subscription to generate images on their platform.
			</AccordionContent>
		  </AccordionItem>

		  <AccordionItem value="q2">
			<AccordionTrigger>Does the AI use my private prompts?</AccordionTrigger>
			<AccordionContent>
			  No. Guru only sees what you send in the chat. Your private Midjourney prompts remain
			  private unless you share them.
			</AccordionContent>
		  </AccordionItem>

		  <AccordionItem value="q3">
			<AccordionTrigger>Can I cancel any time?</AccordionTrigger>
			<AccordionContent>
			  Absolutely. Manage your subscription in one click from your settings page—no emails,
			  no phone calls.
			</AccordionContent>
		  </AccordionItem>
		</Accordion>
	  </div>

	  {/* ---------- Secondary CTA ---------- */}
	  <div className="text-center space-y-4">
		<h2 className="text-2xl font-semibold">Ready to create otherworldly images?</h2>
		<p className="text-sm text-gray-400">
		  Join hundreds of creatives mastering Midjourney the smart way.
		</p>
		<a
		  href="#signup"
		  className="inline-block bg-brand text-[#141A10] px-6 py-3 rounded-full font-medium hover:bg-[#E8E455] transition"
		>
		  Get Started – $7 / month
		</a>
		<p className="text-xs text-gray-500">Cancel any time.</p>
	  </div>
	</section>
  );
}