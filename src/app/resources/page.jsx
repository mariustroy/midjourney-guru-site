"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

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
      <h1 className="text-2xl font-semibold mb-4">Resources</h1>

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
    <ResourceLink href="https://unsplash.com" label="Unsplash" /> — free, high-resolution
    contemporary photography covering lifestyle, nature, architecture, textures and more.
  </li>
  <li>
    <ResourceLink href="https://pexels.com" label="Pexels" /> — royalty-free photos + videos with an
    authentic lifestyle vibe and solid search filters.
  </li>
  <li>
    <ResourceLink href="https://pixabay.com" label="Pixabay" /> — CC0-like library of photos,
    vectors, illustrations and even music sound FX.
  </li>
  <li>
    <ResourceLink href="https://openverse.org" label="Openverse" /> — meta-search across 600 M+
    Creative-Commons images, audio and video from many sources.
  </li>
  <li>
    <ResourceLink href="https://flickr.com/commons" label="Flickr Commons & CC Search" /> — museum
    archives and historic photos marked public-domain or CC-BY.
  </li>
  <li>
    <ResourceLink href="https://commons.wikimedia.org" label="Wikimedia Commons" /> — 90 M+ encyclopedic
    images, diagrams and artworks with clear CC / PD licensing.
  </li>
  <li>
    <ResourceLink href="https://loc.gov/free-to-use/" label="Library of Congress — Free to Use & Reuse" /> —
    curated sets of vintage U.S. photos, posters, maps in the public domain.
  </li>
  <li>
    <ResourceLink href="https://www.rawpixel.com/search/public-domain" label="Rawpixel — Public Domain" /> —
    high-resolution art scans, botanical plates and transparent PNG elements.
  </li>
  <li>
    <ResourceLink href="https://images.nasa.gov" label="NASA Image & Video Library" /> — public-domain
    imagery of space missions, astronauts, planets and Earth from orbit.
  </li>
  <li>
    <ResourceLink href="https://www.photolib.noaa.gov" label="NOAA Photo Library" /> — weather,
    oceans, climate and marine-life photography; U.S. public domain.
  </li>
  <li>
    <ResourceLink href="https://earthexplorer.usgs.gov" label="USGS EarthExplorer" /> — downloadable
    satellite and aerial imagery, topo maps, and geological datasets.
  </li>
  <li>
    <ResourceLink href="https://nappy.co" label="Nappy.co" /> — inclusive, CC0 photos featuring
    Black and Brown creators, perfect for authentic mock-ups.
  </li>
</ul>
          </section>

          {/* Pinterest boards */}
          <section className="space-y-2">
            <h2 className="font-medium">Pinterest boards I love</h2>

            <ul className="space-y-1">
              {/* replace with your own board URLs */}
              <li><ResourceLink href="https://www.pinterest.com/mariustroy/color-palettes-inspo/" label="Color Palettes Inspiration" /></li>
              <li><ResourceLink href="https://www.pinterest.com/mariustroy/sci-fi-cityscapes/" label="Sci-Fi Cityscapes" /></li>
              <li><ResourceLink href="https://www.pinterest.com/mariustroy/vintage-illustration/" label="Vintage Illustration Scans" /></li>
            </ul>
          </section>
        </TabsContent>

        {/* ---------- GUIDES ---------- */}
        <TabsContent value="guides" className="mt-4 space-y-2">
          <ResourceLink
            href="https://midjourney.com/guide"
            label="Official Midjourney Guide"
          />
        </TabsContent>

        {/* ---------- TUTORIALS ---------- */}
        <TabsContent value="tutorials" className="mt-4 space-y-2">
          <ResourceLink
            href="https://www.youtube.com/@mariustroy"
            label="Marius Troy — YouTube"
          />
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