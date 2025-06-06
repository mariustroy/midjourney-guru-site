// app/coaching/page.tsx
export default function CoachingPage() {
  return (
	<div className="max-w-2xl mx-auto px-4 py-12 pt-22">
	  <h1 className="text-3xl font-bold mb-4">1-on-1 Coaching</h1>
	  <p className="text-muted-foreground mb-6">
		Book a personal coaching session with Marius Troy. Explore Midjourney techniques, elevate your creative practice, or refine your visual language. 60 minutes. Individuals only.
	  </p>
	  <div className="w-full overflow-hidden rounded-2xl shadow-sm">
		<button
		  onClick={() =>
			window.Calendly.initPopupWidget({
			  url: "https://calendly.com/mariustroy/60min",
			})
		  }
		  className="px-6 py-3 rounded-xl bg-black text-black hover:bg-neutral-800 transition"
		  style={{ backgroundColor: "#FFFD91" }}
		>
		  Book Your Session
		</button>
	  </div>
	</div>
  );
}