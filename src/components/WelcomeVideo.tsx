const id = "1xtbGLxkMbU";
const params =
  "modestbranding=1" +      // tiny logo, no avatar/channel title
  "&rel=0" +                // related videos only from *your* channel
  "&iv_load_policy=3" +     // hide video cards / annotations
  "&playsinline=1" +        // iOS: stay in-page
  "&showinfo=0";            // suppress title bar on load (legacy but still works)

export default function WelcomeVideo() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
        title="Welcome to Midjourney Guru"
        className="w-full aspect-video rounded-xl shadow-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </section>
  );
}