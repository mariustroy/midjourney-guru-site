"use client";

import { useEffect } from "react";

export default function CalendlyScriptLoader() {
  useEffect(() => {
	if (!document.querySelector("#calendly-script")) {
	  const script = document.createElement("script");
	  script.id = "calendly-script";
	  script.src = "https://assets.calendly.com/assets/external/widget.js";
	  script.async = true;
	  document.body.appendChild(script);
	}
  }, []);

  return null;
}