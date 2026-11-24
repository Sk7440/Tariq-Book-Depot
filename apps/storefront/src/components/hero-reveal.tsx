"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    const headline = ref.current?.querySelector("h1");
    if (!headline) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.fonts.ready.then(() => {
        const split = SplitText.create(headline, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 100,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "paperSettle",
          onComplete: () => split.revert(),
        });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
