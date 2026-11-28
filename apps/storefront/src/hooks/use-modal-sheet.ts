"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Behaviour shared by the menu sheet and cart drawer (from the HTML's openSheet/closeSheet/trapFocus):
 * locks page scroll, moves focus to the close button, traps Tab, closes on Escape,
 * and returns focus to the element that opened it.
 */
export function useModalSheet(isOpen: boolean, onClose: () => void, sheetRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    if (!isOpen) return;
    const sheet = sheetRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("is-locked");
    const focusTimer = window.setTimeout(() => sheet?.querySelector<HTMLElement>("[data-sheet-close]")?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !sheet) return;
      const items = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [isOpen, onClose, sheetRef]);
}
