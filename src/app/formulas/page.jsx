// Very simple starter – replace with real data or fetch from Supabase later
const formulas = [
  {
    prompt:
      "/imagine 70s photograph of rain made of gold running down a tree made of fur … --ar 4:5 --v 6.1",
    refs: [
      "https://s.mj.run/khAQMPWrXoc",
      "https://s.mj.run/KKyn8luLS_A",
    ],
    output: "/images/sample1.jpg",
  },
];

export default function FormulasPage() {
  return (
       <div
      className="
        max-w-2xl mx-auto
        px-4 py-6           /* existing side + vertical padding           */
        pt-16 md:pt-8       /* extra space under the hamburger icon      */
        space-y-6
      "
    >
      <h1 className="text-2xl font-semibold">Prompt Formulas</h1>

      {formulas.map((f, i) => (
        <article key={i} className="space-y-2">
          <img src={f.output} alt="Resulting image" className="rounded-md" />
          <code className="block whitespace-pre-wrap text-sm bg-black/30 p-3 rounded">
            {f.prompt}
          </code>
          <div className="flex gap-2">
            {f.refs.map((r) => (
              <a key={r} href={r} target="_blank">
                <img src={r} className="w-16 h-16 object-cover rounded" />
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}