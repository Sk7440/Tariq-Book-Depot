"use client";

const LIVE_ID = "live";

/** Polite screen-reader announcements (the HTML's #live region). */
export function LiveRegion() {
  return <div className="sr-only" aria-live="polite" id={LIVE_ID} />;
}

/** Announces a message; clears first so repeated messages are read again. */
export function announce(message: string): void {
  const el = document.getElementById(LIVE_ID);
  if (!el) return;
  el.textContent = "";
  window.setTimeout(() => {
    el.textContent = message;
  }, 40);
}
