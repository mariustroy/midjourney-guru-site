// app/coaching/page.tsx
export default function CoachingPage() {
  return (
	<div className="max-w-2xl mx-auto px-4 py-12">
	  <h1 className="text-3xl font-bold mb-4">1-on-1 Coaching</h1>
	  <p className="text-muted-foreground mb-6">
		Book a personal coaching session with Marius Troy. Explore Midjourney techniques, elevate your creative practice, or refine your visual language. 60 minutes. Individuals only.
	  </p>
	  <div className="w-full overflow-hidden rounded-2xl shadow-sm">
		<iframe
		  src="https://calendly.com/mariustroy/60min"
		  width="100%"
		  height="1000"
		  className="w-full border-none min-h-[1000px] max-h-[1000px]"
		  frameBorder="0"
		  allow="camera; microphone; fullscreen; speaker; display-capture"
		  scrolling="yes"
		></iframe>
	  </div>
	</div>
  );
}