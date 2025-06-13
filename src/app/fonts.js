// src/app/fonts.js
import localFont from "next/font/local";

export const elanor = localFont({
  src: [
	/* ExtraLight – weight 300 (adjust if your design uses 200) */
	{
	  path: "../../public/fonts/Elanor/Elanor-ExtraLight.woff2",
	  weight: "300",
	  style: "normal",
	},
	{
	  path: "../../public/fonts/Elanor/Elanor-ExtraLight.woff",
	  weight: "300",
	  style: "normal",
	},

	/* Regular – weight 400 */
	{
	  path: "../../public/fonts/Elanor/Elanor-Regular.woff2",
	  weight: "400",
	  style: "normal",
	},
	{
	  path: "../../public/fonts/Elanor/Elanor-Regular.woff",
	  weight: "400",
	  style: "normal",
	},
  ],
  display: "swap",          // avoids flash of invisible text
  variable: "--font-elanor" // makes Tailwind utility `font-elanor` work
});