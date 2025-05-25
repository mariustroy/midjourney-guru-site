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

      <Tabs defaultValue="images" className="w-full">
        <TabsList>
          <TabsTrigger value="images">Image Libraries</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>

        {/* ---------- IMAGE LIBRARIES ---------- */}
        <TabsContent value="images" className="mt-4 space-y-6">

          {/* Free-image sites */}
          <section className="space-y-2">
            <h2 className="font-medium">Free high-resolution libraries</h2>

            <ul className="space-y-1">
              <li><ResourceLink href="https://unsplash.com" label="Unsplash" /></li>
              <li><ResourceLink href="https://pexels.com" label="Pexels" /></li>
              <li><ResourceLink href="https://pixabay.com" label="Pixabay" /></li>
              <li><ResourceLink href="https://openverse.org" label="Openverse" /></li>
              <li><ResourceLink href="https://flickr.com/commons" label="Flickr Commons & CC Search" /></li>
              <li><ResourceLink href="https://commons.wikimedia.org" label="Wikimedia Commons" /></li>
              <li><ResourceLink href="https://loc.gov/free-to-use/" label="Library of Congress — Free to Use & Reuse" /></li>
              <li><ResourceLink href="https://www.rawpixel.com/search/public-domain" label="Rawpixel — Public Domain" /></li>
              <li><ResourceLink href="https://images.nasa.gov" label="NASA Image & Video Library" /></li>
              <li><ResourceLink href="https://www.photolib.noaa.gov" label="NOAA Photo Library" /></li>
              <li><ResourceLink href="https://earthexplorer.usgs.gov" label="USGS EarthExplorer" /></li>
              <li><ResourceLink href="https://nappy.co" label="Nappy.co" /></li>
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