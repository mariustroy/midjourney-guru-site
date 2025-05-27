export default function WelcomeVideo() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <iframe
        src="https://www.youtube-nocookie.com/embed/1xtbGLxkMbU"
        title="Welcome to Midjourney Guru"
        className="w-full aspect-video rounded-xl shadow-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </section>
  );
}