/* ------------------------------------------------------------------ */
/*  Root layout – combines fonts, metadata, sidebar & globals         */
/* ------------------------------------------------------------------ */
import "./globals.css";
import TopMenu   from "@/components/TopMenu";
import { Geist, Geist_Mono } from "next/font/google";
import { elanor } from "./fonts";           // ← your local web-font

/* ---------- Google fonts ---------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ---------- Metadata (Open Graph, Twitter, etc.) ---------- */
export const metadata = {
  title:       "Midjourney Guru by Marius Troy",
  description: "Your personal Midjourney co-pilot — craft perfect prompts in seconds.",
  icons: {
    icon:     "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://guru.mariustroy.com",
    title:       "Midjourney Guru by Marius Troy",
    description: "Your personal Midjourney co-pilot — craft perfect prompts in seconds.",
    images: [
      {
        url:    "/images/og-image.png",
        width:  1200,
        height: 630,
        alt:    "Midjourney Guru by Marius Troy",
      },
    ],
    siteName: "Midjourney Guru",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Midjourney Guru by Marius Troy",
    description: "Your personal Midjourney co-pilot — craft perfect prompts in seconds.",
    images:      ["/images/og-image.png"],
    creator:     "@mariustroy",
  },
};

/* ---------- Root component ---------- */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${elanor.variable}`}
    >
      <head>
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        ></script>
      </head>
     <body className="min-h-screen bg-[#131B0E] text-gray-100 antialiased">
        <TopMenu />
        <main className="overflow-hidden">{children}</main>
      </body>
    </html>
  );
}