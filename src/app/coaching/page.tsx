// app/coaching/page.tsx
export default function CoachingPage() "use client";

import { useEffect } from "react";

// Extend the window object to include Calendly
declare global {
  interface Window {
	Calendly: {
	  initPopupWidget: (options: { url: string }) => void;
	  closePopupWidget: () => void;
	};
  }
}

export default function CoachingPage() {
  useEffect(() => {
	if (!document.querySelector("#calendly-script")) {
	  const script = document.createElement("script");
	  script.id = "calendly-script";
	  script.src = "https://assets.calendly.com/assets/external/widget.js";
	  script.async = true;
	  document.body.appendChild(script);
	}
  }, []);

  const openCalendly = () => {
	window.Calendly.initPopupWidget({
	  url: "https://calendly.com/mariustroy/60min",
	});
  };

  return (
	<div className="max-w-2xl mx-auto px-4 py-12 text-center">
	  <h1 className="text-3xl font-bold mb-4">1-on-1 Coaching</h1>
	  <p className="text-muted-foreground mb-6">
		Book a personal coaching session with Marius Troy. Explore Midjourney techniques, elevate your creative practice, or refine your visual language.
	  </p>

	  <button
		onClick={openCalendly}
		className="px-6 py-3 rounded-xl text-black font-medium transition"
		style={{
		  backgroundColor: "#FFFD91",
		  transition: "background-color 0.2s ease",
		}}
		onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f7f178")}
		onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFFD91")}
	  >
		Book Your Session
	  </button>
	</div>
  );
}