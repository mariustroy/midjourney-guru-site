import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// src/app/layout.js
export const metadata = {
  title:       "Midjourney Guru by Marius Troy",
  description: "Your personal Midjourney co-pilot —craft perfect prompts in seconds.",
  icons: {
    icon:       "/favicon.ico",           // next will emit <link rel="icon" href=…>
    shortcut:   "/favicon.ico",           // optional
    // you can also specify `other: [{ rel, url }, …]`
  },
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://guru.mariustroy.com",
    title:       "Midjourney Guru by Marius Troy",
    description: "Your personal Midjourney co-pilot —craft perfect prompts in seconds.",
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
    description: "Your personal Midjourney co-pilot —craft perfect prompts in seconds.",
    images:      ["/images/og-image.png"],
    creator:     "@mariustroy",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={"dark"}
      >
        {children}
      </body>
    </html>
  );
}
