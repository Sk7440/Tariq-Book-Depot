"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import type { SyntheticEvent } from "react";
import { Icon } from "@/components/icons";

interface FaqItemProps {
  question: string;
  answer: string;
}

/**
 * Native <details> disclosure (keyboard and screen-reader support built in).
 * When it opens, Motion reveals the answer so it's clear what changed (the HTML's FAQ toggle).
 */
export function FaqItem({ question, answer }: FaqItemProps) {
  const [scope, animate] = useAnimate<HTMLParagraphElement>();
  const isReduced = useReducedMotion();

  const handleToggle = (e: SyntheticEvent<HTMLDetailsElement>) => {
    const el = scope.current;
    if (!e.currentTarget.open || isReduced || !el) return;
    const height = el.scrollHeight;
    void animate(el, { height: [0, height], opacity: [0, 1] }, { duration: 0.35, ease: "easeOut" }).then(() => {
      el.style.height = "";
      el.style.opacity = "";
    });
  };

  return (
    <details onToggle={handleToggle}>
      <summary>{question}<Icon name="plus" /></summary>
      <p ref={scope} className="faq__a" style={{ overflow: "hidden" }}>{answer}</p>
    </details>
  );
}
