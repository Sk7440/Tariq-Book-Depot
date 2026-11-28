"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef, type ReactNode } from "react";
import type { Lang } from "@/i18n/config";

gsap.registerPlugin(useGSAP, SplitText);

const PLAYED_KEY = "tbd-hero-played";
const FONT_WAIT_MS = 1200;

interface HeroMotionProps {
  lang: Lang;
  children: ReactNode;
}

/**
 * GSAP hero sequence from the HTML's homeMotion(): the ruling draws in, the margin drops,
 * the title rises line by line (LTR; fades in Urdu), then the rate-list rows are written in.
 * Plays once per session and never when the user prefers reduced motion.
 */
export function HeroMotion({ lang, children }: HeroMotionProps) {
  const scope = useRef<HTMLElement>(null);
  const isRtl = lang === "ur";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        if (window.sessionStorage.getItem(PLAYED_KEY)) return;
        window.sessionStorage.setItem(PLAYED_KEY, "1");
        const inner = scope.current?.querySelector(".hero__inner");
        if (!inner) return;
        gsap.set(inner, { autoAlpha: 0 });
        let split: SplitText | null = null;

        // ctx.add runs the function at once and records its tweens for cleanup.
        const play = () => ctx.add(() => {
          gsap.set(inner, { autoAlpha: 1 });
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from(".hero__rules", { scaleX: 0, transformOrigin: isRtl ? "100% 50%" : "0% 50%", duration: 1.1, ease: "power2.inOut" })
            .from(".hero__margin", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.8, ease: "power2.inOut" }, 0.3);
          if (isRtl) {
            tl.from(".hero__title", { opacity: 0, duration: 0.7 }, 0.6);
          } else {
            split = SplitText.create(".hero__title", { type: "lines", mask: "lines" });
            tl.from(split.lines, { yPercent: 105, duration: 0.85, stagger: 0.12, onComplete: () => split?.revert() }, 0.6);
          }
          tl.from([".hero__sub", ".hero__ctas"], { opacity: 0, y: 10, duration: 0.6, stagger: 0.1 }, 1.0)
            .from(".rate__title", { opacity: 0, duration: 0.4 }, 0.95)
            .fromTo(
              ".rate__row",
              { clipPath: isRtl ? "inset(-30% 0% -60% 100%)" : "inset(-30% 100% -60% 0%)" },
              { clipPath: "inset(-30% 0% -60% 0%)", duration: 0.7, ease: "power2.inOut", stagger: 0.09, clearProps: "clipPath" },
              1.05,
            );
        });

        const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => window.setTimeout(r, FONT_WAIT_MS))]);
        void fontsReady.then(() => play());
        return () => split?.revert();
      });
      return () => mm.revert();
    },
    { scope, dependencies: [isRtl] },
  );

  return (
    <section ref={scope} className="hero" aria-labelledby="hero-title">
      {children}
    </section>
  );
}
