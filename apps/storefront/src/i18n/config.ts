export const LANGS = ["en", "ur"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function dirOf(lang: Lang): "ltr" | "rtl" {
  return lang === "ur" ? "rtl" : "ltr";
}

/** Prefixes an app path with the language segment, e.g. ("ur", "/shop") → "/ur/shop". */
export function href(lang: Lang, path = "/"): string {
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Swaps the language segment of a pathname, keeping the rest of the path. */
export function switchLangPath(pathname: string, to: Lang): string {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLang(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}
