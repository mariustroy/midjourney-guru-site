import CalendlyPopup from "@/components/CalendlyPopup";
import CalendlyScriptLoader from "@/components/CalendlyScriptLoader";

export const metadata = {
  title: "1-on-1 Coaching | Midjourney Guru",
  description: "Book a personal coaching session with Marius Troy.",
};

export default function CoachingPage() {
  return (
	<div className="max-w-2xl mx-auto px-4 py-12 text-center">
	  <CalendlyScriptLoader />
	  <h1 className="text-[36px] leading-tight font-light">1-on-1 Coaching</h1>
	  <p className="text-muted-foreground mb-6">
		Book a personal coaching session with Marius Troy. Explore Midjourney techniques, elevate your creative practice, or refine your visual language.
	  </p>
	  <CalendlyPopup />
	</div>
  );
}