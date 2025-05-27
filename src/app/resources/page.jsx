"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Image from "next/image";
import WelcomeVideo from "@/components/WelcomeVideo";

export default function ResourcesPage() {
  return (
    <div
      className="
        max-w-2xl mx-auto
        px-4 py-6
        pt-22 md:pt-8
        space-y-6
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
       /* ---------- GUIDES ---------- */
<TabsContent value="guides" className="mt-4 space-y-6">
  {/* Official link still first */}
  <ResourceLink
    href="https://midjourney.com/guide"
    label="Official Midjourney Guide"
  />

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
        Turn ideas into gallery-worthy images in minutes. <i>Imagine</i> gives you
        <strong> 120 battle-tested prompt formulas</strong>, step-by-step workflows,
        printable cheat-sheets and lifetime updates—everything a designer,
        marketer or maker needs to master Midjourney <em>fast</em>.
      </p>

      <a
        href="https://store.mariustroy.com/l/imagine"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-max rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white shadow hover:bg-brand/90 transition"
      >
        Buy the e-book – $19
      </a>
    </div>
  </section>
</TabsContent>
        {/* ---------- TUTORIALS ---------- */}
        <TabsContent value="tutorials" className="mt-4 space-y-6">
          <WelcomeVideo />
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