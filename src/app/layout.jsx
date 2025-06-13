/* ------------------------------------------------------------------ */
/*  Root layout – combines fonts, metadata, sidebar & globals         */
/* ------------------------------------------------------------------ */
import "./globals.css";
import { elanor } from '../fonts';
import SideDrawer from "@/components/SideDrawer";
import { Geist, Geist_Mono } from "next/font/google";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={elanor.variable}>
      <body className="font-elanor bg-[#131B0E] antialiased">
        {children}
      </body>
    </html>
  );
}

/* ---------- Root component ---------- */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
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
      <body className="flex min-h-screen bg-[#131B0E] text-gray-100 antialiased">
        {/* sidebar (desktop + mobile) */}
        <SideDrawer />

        {/* main content */}
       <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}