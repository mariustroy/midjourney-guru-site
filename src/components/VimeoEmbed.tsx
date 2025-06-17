'use client';

type Props = {
  id: string;          // 123456789
  hash?: string;       // "abcdef" – leave blank for public videos
  title?: string;
};

export default function VimeoEmbed({ id, hash, title = 'Vimeo video' }: Props) {
  const params = new URLSearchParams({
    title: '0',
    byline: '0',
    portrait: '0',
    dnt: '0',
  }).toString();

  const src = `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}&${params}` : `?${params}`}`;

  return (
    <iframe
      src={src}
      title={title}
      className="w-full aspect-video rounded-xl shadow-lg"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}