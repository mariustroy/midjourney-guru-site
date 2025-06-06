"use client";

declare global {
  interface Window {
	Calendly: {
	  initPopupWidget: (options: { url: string }) => void;
	  closePopupWidget: () => void;
	};
  }
}

export default function CalendlyPopup() {
  const openCalendly = () => {
	if (typeof window.Calendly !== "undefined") {
	  window.Calendly.initPopupWidget({
		url: "https://calendly.com/mariustroy/60min",
	  });
	} else {
	  alert("Calendly is still loading. Please try again in a moment.");
	}
  };

  return (
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
  );
}