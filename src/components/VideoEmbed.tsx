'use client';

type Props = {
  /** the numeric portion of the Vimeo URL, e.g.  938765432 */
  id: string;
  title?: string;
  /** autoplay on page load (muted, per browser rules) */
  autoplay?: boolean;
};

export default function VimeoEmbed({
  id,
  title = 'Vimeo video',
  autoplay = false,
}: Props) {
  /* Vimeo player query-string
     Docs → https://developer.vimeo.com/player/embedding */
  const params = new URLSearchParams({
    // tidy UI
    title: '0',
    byline: '0',
    portrait: '0',
    badge: '0',

    // privacy
    dnt: '1',          // “Do Not Track”
    pip: '1',          // allow Picture-in-Picture

    // behaviour
    autoplay: autoplay ? '1' : '0',
    muted: autoplay ? '1' : '0',
  }).toString();

  return (
    <iframe
      src={`https://player.vimeo.com/video/${id}?${params}`}
      title={title}
      className="w-full aspect-video rounded-xl shadow-lg"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}