import { useState } from 'react';

export default function Poster({ src, title, eager = false, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div
        className={`aspect-2/3 w-full bg-mist object-cover flex flex-col justify-center gap-3 p-5 text-center ${className}`}
        role="img"
        aria-label={`${title}: poster unavailable`}
      >
        <strong>{title}</strong>
        <span className="text-sm">Poster unavailable</span>
      </div>
    );
  }
  return (
    <img
      className={`aspect-2/3 w-full bg-mist object-cover ${className}`}
      src={src}
      alt={`${title} poster`}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
