"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Image from "next/image";
import WelcomeVideo from "@/components/WelcomeVideo";
import VideoEmbed   from '@/components/VideoEmbed';

export default function ResourcesPage() {
  return (
    <div
      className="
        max-w-2xl mx-auto
        px-4 py-6
        pt-22 md:pt-8
        space-y-6 lg:ml-64
      "
    >
      {/* headline --------------------------------------------------- */}
      <h1 className="text-[36px] leading-tight font-light">Resources</h1>

      <Tabs defaultValue="tutorials" className="w-full">
        <TabsList>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="images">Image Libraries</TabsTrigger>
        </TabsList>

        {/* ---------- IMAGE LIBRARIES ---------- */}
        <TabsContent value="images" className="mt-4 space-y-6">
          {/* Free-image sites */}
          <section className="space-y-2">
            <h2 className="font-medium">Free high-resolution libraries</h2>

            <ul className="space-y-4 text-sm leading-relaxed">
              <li>
                <ResourceLink href="https://unsplash.com" label="Unsplash" /> —
                free, high-resolution contemporary photography covering lifestyle,
                nature, architecture, textures and more.
              </li>
              <li>
                <ResourceLink href="https://pexels.com" label="Pexels" /> —
                royalty-free photos + videos with an authentic lifestyle vibe and
                solid search filters.
              </li>
              <li>
                <ResourceLink href="https://pixabay.com" label="Pixabay" /> —
                CC0-like library of photos, vectors, illustrations and even music
                sound FX.
              </li>
              <li>
                <ResourceLink href="https://openverse.org" label="Openverse" /> —
                meta-search across 600 M+ Creative-Commons images, audio and video.
              </li>
              <li>
                <ResourceLink href="https://flickr.com/commons" label="Flickr Commons & CC Search" /> —
                museum archives and historic photos marked public-domain or CC-BY.
              </li>
              <li>
                <ResourceLink href="https://commons.wikimedia.org" label="Wikimedia Commons" /> —
                90 M+ encyclopedic images, diagrams and artworks with clear CC / PD licensing.
              </li>
              <li>
                <ResourceLink href="https://loc.gov/free-to-use/" label="Library of Congress — Free to Use & Reuse" /> —
                curated sets of vintage U.S. photos, posters and maps in the public domain.
              </li>
              <li>
                <ResourceLink href="https://www.rawpixel.com/search/public-domain" label="Rawpixel — Public Domain" /> —
                high-resolution art scans, botanical plates and transparent PNG elements.
              </li>
              <li>
                <ResourceLink href="https://images.nasa.gov" label="NASA Image & Video Library" /> —
                public-domain imagery of space missions, astronauts, planets and Earth from orbit.
              </li>
              <li>
                <ResourceLink href="https://www.photolib.noaa.gov" label="NOAA Photo Library" /> —
                weather, oceans, climate and marine-life photography; U.S. public domain.
              </li>
              <li>
                <ResourceLink href="https://earthexplorer.usgs.gov" label="USGS EarthExplorer" /> —
                downloadable satellite and aerial imagery, topo maps and geological datasets.
              </li>
              <li>
                <ResourceLink href="https://nappy.co" label="Nappy.co" /> —
                inclusive, CC0 photos featuring Black and Brown creators, perfect for authentic mock-ups.
              </li>
            </ul>
          </section>

          {/* Pinterest boards */}
          <section className="space-y-2">
            <h2 className="font-medium">Pinterest boards I love</h2>

            <ul className="space-y-1">
              <li>
                <ResourceLink
                  href="https://www.pinterest.com/mariustroy/color-palettes-inspo/"
                  label="Color Palettes Inspiration"
                />
              </li>
              <li>
                <ResourceLink
                  href="https://www.pinterest.com/mariustroy/sci-fi-cityscapes/"
                  label="Sci-Fi Cityscapes"
                />
              </li>
              <li>
                <ResourceLink
                  href="https://www.pinterest.com/mariustroy/vintage-illustration/"
                  label="Vintage Illustration Scans"
                />
              </li>
            </ul>
          </section>
        </TabsContent>

        {/* ---------- GUIDES ---------- */}
<TabsContent value="guides" className="mt-4 space-y-6">
  {/* Official link still first */}

  {/* 𝐄-𝐁𝐎𝐎𝐊 𝐏𝐑𝐎𝐌𝐎 */}
  <section className="flex flex-col md:flex-row gap-6 rounded-xl border p-6 bg-muted/50">
    {/* cover */}
    <Image
      src="/images/cover_2025.jpg"
      alt="Imagine – Midjourney for Creatives cover"
      width={200}
      height={260}
      className="rounded-lg shadow-md self-center md:self-start"
      priority
    />

    {/* copy + CTA */}
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold leading-tight">
        Imagine: <span className="font-light">Midjourney for Creatives</span>
      </h3>

      <p className="text-sm leading-relaxed">
       Unlock Midjourney’s full potential in one sitting. <i>Imagine: Midjourney for Creatives</i> walks you
  through bullet-proof prompt structures, vocabulary, reference-image
  magic, parameter deep dives and the secret to character
  consistency. You’ll skip months of trial-and-error and start steering
  Midjourney like a pro, producing visuals for design, fashion,
  architecture, photography and more.
      </p>

      <a
        href="https://store.mariustroy.com/l/imagine"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-max rounded-lg bg-[#fffd91] px-5 py-2 text-sm font-medium text-[#141A10] shadow transition hover:bg-[#E8E455]"
      >
        Buy the e-book – $44
      </a>
    </div>
  </section>
</TabsContent>
        {/* ---------- TUTORIALS ---------- */}
        <TabsContent value="tutorials" className="mt-4 space-y-6">
          <WelcomeVideo />
          
          {/* NEW video just below */}
  <VideoEmbed
    id="3dNzvSd3Qdw"             // ← replace with the real YouTube ID
    title="Finding your voice in Midjourney"
  />

  {/* any other tutorial blocks… */}
          {/* Add more tutorial links/components here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResourceLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand underline hover:text-brand/80"
    >
      {label}
    </a>
  );
}