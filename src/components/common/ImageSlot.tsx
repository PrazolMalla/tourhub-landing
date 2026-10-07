'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

/** Backend asset host. Images served from here are already optimized (WEBP +
 *  responsive variants) by the backend pipeline, so we skip next/image's
 *  optimizer — which also sidesteps Next 16's block on optimizing localhost. */
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'http://localhost:3000';

interface ImageSlotProps {
  src?: string;
  /** Placeholder label + alt text. */
  alt?: string;
  className?: string;
  /** Passed to next/image for responsive optimisation. */
  sizes?: string;
  priority?: boolean;
}

/**
 * Replacement for the legacy `<image-slot>` web component: a cover-filling,
 * optimised image over a gradient placeholder shown when the image fails to load.
 */
export function ImageSlot({
  src,
  alt = 'Nepal Yatra',
  className,
  sizes = '100vw',
  priority = false,
}: ImageSlotProps) {
  const [failed, setFailed] = useState(!src);

  // Backend-hosted images are pre-optimized — serve them directly.
  const unoptimized = !!src && src.startsWith(ASSET_BASE);

  return (
    <div className={cn('image-slot', className)}>
      {!failed && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className="image-slot-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="img-ph">
          <span>{alt}</span>
        </span>
      )}
    </div>
  );
}
