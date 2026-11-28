"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useModalSheet } from "@/hooks/use-modal-sheet";
import type { Lang } from "@/i18n/config";

interface SheetProps {
  lang: Lang;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  /** "start" = menu (left in LTR), "end" = cart (right in LTR). */
  side: "start" | "end";
  element: "nav" | "aside";
  children: ReactNode;
}

const OPEN = { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] } as const; // ≈ power3.out
const CLOSE = { duration: 0.35, ease: [0.55, 0.055, 0.675, 0.19] } as const; // ≈ power3.in

/** Off-canvas dialog for the menu and cart (the HTML's openSheet/closeSheet), animated with Motion. */
export function Sheet({ lang, id, isOpen, onClose, side, element, children }: SheetProps) {
  const sign = (side === "end" ? 1 : -1) * (lang === "ur" ? -1 : 1);
  const offscreen = `${100 * sign}%`;
  const Panel = element === "nav" ? motion.nav : motion.aside;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="scrim" className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }} />
          <Panel
            key="panel"
            className={side === "end" ? "sheet sheet--end" : "sheet sheet--start"}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            initial={{ x: offscreen }}
            animate={{ x: "0%", transition: OPEN }}
            exit={{ x: offscreen, transition: CLOSE }}
          >
            <SheetFocus onClose={onClose}>{children}</SheetFocus>
          </Panel>
        </>
      )}
    </AnimatePresence>
  );
}

/** Mounted only while open, so the focus trap always has a real element. */
function SheetFocus({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useModalSheet(true, onClose, ref);
  return (
    <div ref={ref} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
