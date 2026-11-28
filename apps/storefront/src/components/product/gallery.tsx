"use client";

import Image from "next/image";
import { useState } from "react";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";

interface GalleryProps {
  lang: Lang;
  name: string;
  images: readonly string[];
}

export function Gallery({ lang, name, images }: GalleryProps) {
  const [index, setIndex] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery__main">
        <Image key={images[index]} className="is-cut" src={images[index]} alt={`${name}, photo ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 600px" priority={index === 0} />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button key={src} className="thumb" type="button" aria-current={i === index} aria-label={t(lang, "photoN", { i: i + 1, n: images.length })} onClick={() => setIndex(i)}>
              <Image className="is-cut" src={src} alt="" width={72} height={72} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
