import React, { useEffect, useState } from 'react';
import { fetchWikipediaSummary } from '../services/liveWikiApi';

interface AuthorPortraitProps {
  name: string;
  portraitUrl?: string;
  wikiTitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10 text-base',
  md: 'w-14 h-14 text-xl',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-28 h-28 md:w-32 md:h-32 text-3xl',
};

export const AuthorPortrait: React.FC<AuthorPortraitProps> = ({
  name,
  portraitUrl,
  wikiTitle,
  size = 'md',
  className = '',
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>(portraitUrl || '');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (portraitUrl) {
      setResolvedUrl(portraitUrl);
      return;
    }
    if (!wikiTitle) return;

    let cancelled = false;
    fetchWikipediaSummary(wikiTitle).then((sum) => {
      if (!cancelled && sum.thumbnailUrl) {
        setResolvedUrl(sum.thumbnailUrl);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [portraitUrl, wikiTitle]);

  const initials = name
    .split(' ')
    .filter((p) => p.length > 0 && p[0] === p[0].toUpperCase())
    .slice(0, 2)
    .map((p) => p[0])
    .join('');

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-inset)] shrink-0 flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      {resolvedUrl && !imgError ? (
        <img
          src={resolvedUrl}
          alt={`Ritratto di ${name}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover sepia-[0.12] contrast-[1.03]"
        />
      ) : (
        <span className="font-serif-editorial italic text-[var(--text-main)]">
          {initials || name.slice(0, 2)}
        </span>
      )}
    </div>
  );
};
