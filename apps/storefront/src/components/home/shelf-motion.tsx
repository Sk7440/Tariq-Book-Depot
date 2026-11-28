"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Book-shelf scroll moment (HTML homeMotion): the empty spines stand up once when the shelf scrolls into view. */
export function ShelfMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".shelf__art .spine", {
          scaleY: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="shelf">
      {children}
    </div>
  );
}
