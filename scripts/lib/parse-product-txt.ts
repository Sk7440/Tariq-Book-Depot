/**
 * Parses one product .txt from Products/ into product fields.
 * Pure function: no file system access, so it can be unit-tested.
 * Rules are documented in CLAUDE.md ("Sync script rules").
 */

export interface ParsedSpec {
  label: string;
  value: string;
}

export interface ParsedTxt {
  title: string;
  name: string;
  brand: string | null;
  price: number;
  priceNote: string | null;
  description: string[];
  specs: ParsedSpec[];
  features: string[];
  /** Human-readable notes about fallbacks applied, for the sync report. */
  notes: string[];
}

export type ParseResult = { ok: true; value: ParsedTxt } | { ok: false; reason: string };

const PRICE_LINE = /^rs\.?\s*([\d,]+)\s*(.*)$/i;
const BULLET = /^\*\s+(.+)$/;
const KEY_VALUE = /^([^:]{1,40}):\s+(.+)$/;
const NAME_SEPARATORS = [" – ", " | "];
/** "Dux 12-Inch Scale is a high-quality …" → "Dux 12-Inch Scale". */
const SENTENCE_SUBJECT = /^(.{3,60}?) is an? /;

function hasSeparator(line: string): boolean {
  return NAME_SEPARATORS.some((sep) => line.includes(sep));
}

function isSentence(line: string): boolean {
  return !hasSeparator(line) && line.endsWith(".");
}

export function nameFromTitle(title: string): string {
  const cuts = NAME_SEPARATORS.map((sep) => title.indexOf(sep)).filter((i) => i > 0);
  return cuts.length ? title.slice(0, Math.min(...cuts)).trim() : title.trim();
}

interface TitleChoice {
  title: string;
  /** Whether line 1 was consumed as the title (and must not become description). */
  consumedLine1: boolean;
  note: string | null;
}

function chooseTitle(line1: string, folderName: string): TitleChoice {
  if (line1 === "" || BULLET.test(line1)) {
    return { title: folderName, consumedLine1: false, note: `no title line; used folder name "${folderName}"` };
  }
  if (isSentence(line1)) {
    const subject = SENTENCE_SUBJECT.exec(line1)?.[1];
    if (subject) {
      return { title: subject, consumedLine1: false, note: `line 1 is a sentence; used its subject "${subject}"` };
    }
    return { title: folderName, consumedLine1: false, note: `line 1 is a sentence; used folder name "${folderName}"` };
  }
  return { title: line1, consumedLine1: true, note: null };
}

function findPriceLine(lines: readonly string[]): number {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (PRICE_LINE.test(lines[i])) return i;
  }
  return -1;
}

interface Body {
  description: string[];
  specs: ParsedSpec[];
  features: string[];
  brand: string | null;
}

function nextNonBlank(lines: readonly string[], from: number): string | undefined {
  return lines.slice(from).find((l) => l !== "");
}

function parseBody(lines: readonly string[]): Body {
  const description: string[] = [];
  const specs: ParsedSpec[] = [];
  const features: string[] = [];
  let brand: string | null = null;
  let paragraph: string[] = [];

  const flush = (): void => {
    if (paragraph.length) description.push(paragraph.join(" "));
    paragraph = [];
  };

  lines.forEach((line, i) => {
    const bullet = BULLET.exec(line)?.[1]?.trim();
    if (line === "") return flush();
    if (bullet !== undefined) {
      flush();
      const kv = KEY_VALUE.exec(bullet);
      if (!kv) return void features.push(bullet);
      const label = kv[1].trim();
      const value = kv[2].trim();
      if (label.toLowerCase() === "brand") brand = value;
      else specs.push({ label, value });
      return;
    }
    const next = nextNonBlank(lines, i + 1);
    if (line.endsWith(":") && next !== undefined && BULLET.test(next)) return flush();
    paragraph.push(line);
  });
  flush();
  return { description, specs, features, brand };
}

export function parseProductTxt(raw: string, folderName: string): ParseResult {
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/).map((l) => l.trim());
  const priceIndex = findPriceLine(lines);
  if (priceIndex < 0) return { ok: false, reason: "no price line (expected e.g. \"RS 450\")" };

  const match = PRICE_LINE.exec(lines[priceIndex]);
  const price = match ? Number.parseInt(match[1].replace(/,/g, ""), 10) : Number.NaN;
  if (!Number.isInteger(price) || price <= 0) return { ok: false, reason: `invalid price "${lines[priceIndex]}"` };
  const priceNote = match?.[2]?.trim() || null;

  const notes: string[] = [];
  const choice = chooseTitle(lines[0] ?? "", folderName);
  if (choice.note) notes.push(choice.note);

  const bodyLines = lines.slice(choice.consumedLine1 ? 1 : 0, priceIndex);
  const after = lines.slice(priceIndex + 1).filter((l) => l !== "");
  if (after.length) notes.push(`text after the price line kept as description: ${after.map((l) => `"${l}"`).join(", ")}`);

  const body = parseBody(bodyLines);
  if (!body.brand) notes.push("no Brand: bullet; brand = null");

  return {
    ok: true,
    value: {
      title: choice.title,
      name: nameFromTitle(choice.title),
      brand: body.brand,
      price,
      priceNote,
      description: [...body.description, ...after],
      specs: body.specs,
      features: body.features,
      notes,
    },
  };
}

export function toKebab(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toTitleCase(input: string): string {
  return input.replace(/\b([a-z])([a-z]*)/gi, (_, first: string, rest: string) => first.toUpperCase() + rest.toLowerCase());
}
