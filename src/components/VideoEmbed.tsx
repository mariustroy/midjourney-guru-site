'use client';

type Props = {
  id: string;          // YouTube video ID
  title: string;
};

export default function VideoEmbed({ id, title }: Props) {
  const params =
    'modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&showinfo=0';

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
      title={title}
      className="w-full aspect-video rounded-xl shadow-lg"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}