import type { Unit } from "@/lib/catalog-schema";

/** Price-unit labels from the approved design (const UNIT). Shown only when set in overrides.json. */
export const UNIT_LABELS: Record<Unit, { en: string; ur: string }> = {
  box: { en: "per box", ur: "فی ڈبہ" },
  pack: { en: "per pack", ur: "فی پیک" },
  jar: { en: "per jar", ur: "فی جار" },
  piece: { en: "per piece", ur: "فی عدد" },
  ream: { en: "per ream", ur: "فی رِم" },
};
