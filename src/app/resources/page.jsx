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
        px-4 py-6           /* existing side + vertical padding           */
        pt-16 md:pt-8       /* extra space under the hamburger icon      */
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

        <TabsContent value="images" className="mt-4 space-y-2">
          <ResourceLink href="https://unsplash.com" label="Unsplash" />
          <ResourceLink href="https://pexels.com" label="Pexels" />
          {/* …add more */}
        </TabsContent>

        <TabsContent value="guides" className="mt-4 space-y-2">
          <ResourceLink
            href="https://midjourney.com/guide"
            label="Official MJ Guide"
          />
        </TabsContent>

        <TabsContent value="tutorials" className="mt-4 space-y-2">
          <ResourceLink
            href="https://www.youtube.com/@mariustroy"
            label="Marius Troy YouTube"
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
      className="text-cyan-400 underline"
    >
      {label}
    </a>
  );
}