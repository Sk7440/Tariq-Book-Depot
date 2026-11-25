"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import type { ProductImage } from "@tariq-book-depot/shared-types";
import { gsap, registerGsap } from "@/lib/gsap";

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const galleryRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeImage = images[activeIndex];

  useGSAP(() => {
    registerGsap();
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ".gallery-main img",
        { opacity: 0.75, scale: 0.99 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "paperSettle", overwrite: "auto" },
      );
    });
    return () => media.revert();
  }, { scope: galleryRef, dependencies: [activeIndex], revertOnUpdate: true });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxOpen && !dialog.open) dialog.showModal();
    if (!lightboxOpen && dialog.open) dialog.close();
  }, [lightboxOpen]);

  const moveImage = (direction: number) => {
    setActiveIndex((index) => (index + direction + images.length) % images.length);
  };

  return (
    <section ref={galleryRef} className="product-gallery" aria-label={`${title} photos`}>
      <button
        className="gallery-main"
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Enlarge photo of ${title}`}
      >
        <Image src={activeImage.url} alt={activeImage.alt} fill priority sizes="(max-width: 800px) 100vw, 58vw" />
      </button>
      {images.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Choose a product photo">
          {images.map((image, index) => (
            <button
              className={`gallery-thumbnail${index === activeIndex ? " active" : ""}`}
              type="button"
              key={image.url}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product photo ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <Image src={image.url} alt="" fill sizes="76px" />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-label={`${title} photo viewer`}
        onClose={() => setLightboxOpen(false)}
        onCancel={() => setLightboxOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setLightboxOpen(false);
          }
          if (event.key === "ArrowRight") moveImage(1);
          if (event.key === "ArrowLeft") moveImage(-1);
        }}
      >
        <div className="lightbox-toolbar">
          <span>{activeImage.alt}</span>
          <button className="icon-button" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close photo viewer">×</button>
        </div>
        <div className="lightbox-image">
          <Image src={activeImage.url} alt={activeImage.alt} fill sizes="90vw" />
        </div>
        {images.length > 1 && (
          <div className="lightbox-controls">
            <button className="button secondary" type="button" onClick={() => moveImage(-1)}>Previous photo</button>
            <button className="button secondary" type="button" onClick={() => moveImage(1)}>Next photo</button>
          </div>
        )}
      </dialog>
    </section>
  );
}
