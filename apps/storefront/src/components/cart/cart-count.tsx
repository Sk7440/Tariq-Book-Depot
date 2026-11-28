"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Header cart badge; bumps when the count goes up (add-to-cart feedback, as in the HTML's updateBadge). */
export function CartCount({ count }: { count: number }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const previous = useRef<number | null>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    const before = previous.current;
    previous.current = count;
    if (before === null || count <= before || isReduced || !scope.current) return;
    void animate(scope.current, { scale: [1.45, 1] }, { type: "spring", stiffness: 520, damping: 14 });
  }, [count, isReduced, animate, scope]);

  return (
    <span ref={scope} className="cartbtn__count" aria-hidden="true" data-empty={count === 0 ? "" : undefined}>
      {count}
    </span>
  );
}
