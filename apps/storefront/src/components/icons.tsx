import type { ReactNode } from "react";

/** Inline SVG icons from the approved design (references/tariq-book-depot.html, const ICON). */
export type IconName = "search" | "bag" | "menu" | "close" | "plus" | "minus" | "cash" | "book";

const PATHS: Record<IconName, { strokeWidth: number; body: ReactNode }> = {
  search: { strokeWidth: 1.7, body: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></> },
  bag: { strokeWidth: 1.6, body: <><path d="M5.2 8.5h13.6l-1 11.5H6.2z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" /></> },
  menu: { strokeWidth: 1.7, body: <path d="M4 7h16M4 12h16M4 17h11" /> },
  close: { strokeWidth: 1.7, body: <path d="m6 6 12 12M18 6 6 18" /> },
  plus: { strokeWidth: 1.8, body: <path d="M6 12h12M12 6v12" /> },
  minus: { strokeWidth: 1.8, body: <path d="M6 12h12" /> },
  cash: { strokeWidth: 1.6, body: <><rect x="2.5" y="6.5" width="19" height="11" rx="1.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6 10v4M18 10v4" /></> },
  book: { strokeWidth: 1.4, body: <><path d="M12 6.8C10 5.3 7 4.8 3.5 5.3v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5v-13C17 4.8 14 5.3 12 6.8Z" /><path d="M12 6.8v13" /></> },
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const { strokeWidth, body } = PATHS[name];
  return (
    <svg className={className ? `icon ${className}` : "icon"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      {body}
    </svg>
  );
}
