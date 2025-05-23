/**
 * Data model for a Midjourney “formula” card
 * ------------------------------------------------
 * id        – unique key for React lists / routing
 * title     – short human-readable name
 * prompt    – the full prompt text we’ll copy to clipboard
 * category  – array of category slugs for filtering
 * images    – example outputs (first one is shown larger)
 * refs      – optional reference images / links
 */

export type Formula = {
  id: string;
  title: string;
  prompt: string;
  category: string[];
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  refs: {
    id: string;
    src: string;
    href?: string;
    label?: string;
  }[];
};

/* ---------- data ---------- */

const formulas: Formula[] = [
  {
    id: "golden-spiral",
    title: "Golden Spiral Landscape",
    prompt:
      "majestic mountain valley at sunrise, composed with the golden spiral, warm rim light, shot on 50 mm lens —ar 3:2",
    category: ["landscape", "composition"],
    images: [
      {
        id: "gs-hero",
        src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        alt: "Landscape framed with golden-spiral composition",
      },
      {
        id: "gs-alt-1",
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        alt: "Alternate golden-spiral render",
      },
      {
        id: "gs-alt-2",
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        alt: "Second alternate render",
      },
    ],
    refs: [
      {
        id: "spiral-diagram",
        src: "/refs/golden-spiral.svg",
        href: "https://en.wikipedia.org/wiki/Golden_ratio",
        label: "Golden-spiral reference",
      },
    ],
  },

  {
    id: "neon-noir",
    title: "Neon-Noir Cityscape",
    prompt:
      "futuristic neon-noir street at night, wet asphalt reflections, volumetric fog, shot on anamorphic lens —ar 21:9",
    category: ["surreal", "architecture"],
    images: [
      {
        id: "nn-hero",
        src: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
        alt: "Wide neon city street scene",
      },
      {
        id: "nn-alt-1",
        src: "https://images.unsplash.com/photo-1473959383410-a7ec1fad3492",
        alt: "Alternate neon-noir angle",
      },
      {
        id: "nn-alt-2",
        src: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae",
        alt: "Second alternate render",
      },
    ],
    refs: [],
  },
];

/* ---------- exports ---------- */

export { formulas };   // named export (optional but handy)
export default formulas; // default export for `import formulas from…`