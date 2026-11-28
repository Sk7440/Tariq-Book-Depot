import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { DEPARTMENT_LIST } from "@/lib/departments";

export interface NavItem {
  key: string;
  href: string;
  label: string;
}

/** Main navigation, as in the HTML's NAV(). */
export function navItems(lang: Lang): NavItem[] {
  return [
    { key: "home", href: href(lang, "/"), label: t(lang, "home") },
    { key: "all", href: href(lang, "/shop"), label: t(lang, "all") },
    ...DEPARTMENT_LIST.map((d) => ({ key: d.id, href: href(lang, `/shop/${d.id}`), label: pick(lang, d.name) })),
    { key: "about", href: href(lang, "/about"), label: t(lang, "about") },
    { key: "contact", href: href(lang, "/contact"), label: t(lang, "contact") },
  ];
}

/** Which nav item a pathname belongs to (the HTML's markNav()); "" for none. */
export function activeNavKey(pathname: string): string {
  const rest = pathname.split("/").slice(2);
  const [a, b] = rest;
  if (!a) return "home";
  if (a === "shop") return b ?? "all";
  if (a === "about" || a === "contact") return a;
  return "";
}
