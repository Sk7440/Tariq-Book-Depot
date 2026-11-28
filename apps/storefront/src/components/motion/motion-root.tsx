"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Motion respects the OS "reduce motion" setting everywhere: transforms and layout animations are skipped. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
