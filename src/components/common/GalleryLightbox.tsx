'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { ImageSlot } from '@/components/common/ImageSlot';

interface GalleryLightboxProps {
  images: string[];
  alt: string;
}

export default function GalleryLightbox({ images, alt }: GalleryLightboxProps) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <ImageSlot
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
            />

            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images.map((src) => ({ src }))}
        className="gallery-lightbox"
      />
    </>
  );
}
