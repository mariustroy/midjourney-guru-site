"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
	Calendly: {
	  initPopupWidget: (options: { url: string }) => void;
	  closePopupWidget: () => void;
	};
  }
}

export default function CalendlyPopup() {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  useEffect(() => {
	const existingScript = document.querySelector("#calendly-script");

	if (!existingScript) {
	  const script = document.createElement("script");
	  script.id = "calendly-script";
	  script.src = "https://assets.calendly.com/assets/external/widget.js";
	  script.async = true;
	  script.onload = () => setCalendlyLoaded(true);
	  document.body.appendChild(script);
	} else {
	  setCalendlyLoaded(true);
	}
  }, []);

  const openCalendly = () => {
	if (window.Calendly) {
	  window.Calendly.initPopupWidget({
		url: "https://calendly.com/mariustroy/60min",
	  });
	} else {
	  console.error("Calendly script not loaded yet.");
	}
  };

  return (
	<button
	  onClick={openCalendly}
	  disabled={!calendlyLoaded}
	  className="px-6 py-3 rounded-xl text-black font-medium transition"
	  style={{
		backgroundColor: "#FFFD91",
		transition: "background-color 0.2s ease",
		opacity: calendlyLoaded ? 1 : 0.6,
		cursor: calendlyLoaded ? "pointer" : "not-allowed",
	  }}
	  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f7f178")}
	  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFFD91")}
	>
	  {calendlyLoaded ? "Book Your Session" : "Loading…"}
	</button>
  );
}