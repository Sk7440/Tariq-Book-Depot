import type { Lang } from "./config";
import { en, ur, type DictKey, type Dictionary } from "./dictionaries";

const DICTS: Record<Lang, Dictionary> = { en, ur };

export type Vars = Record<string, string | number>;

/** Looks up a UI string and fills {placeholders}. */
export function t(lang: Lang, key: DictKey, vars: Vars = {}): string {
  return DICTS[lang][key].replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ""));
}

/** Returns a translator bound to one language. */
export function translator(lang: Lang): (key: DictKey, vars?: Vars) => string {
  return (key, vars) => t(lang, key, vars);
}

/** Picks the Urdu or English value of a bilingual name; falls back to English when Urdu is missing. */
export function pick(lang: Lang, name: { en: string; ur: string | null }): string {
  return lang === "ur" ? name.ur ?? name.en : name.en;
}
