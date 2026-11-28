"use client";

import { Icon } from "@/components/icons";
import { MAX_QTY } from "@/components/cart/cart-provider";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";

interface QtyStepperProps {
  lang: Lang;
  value: number;
  onChange: (qty: number) => void;
  isSmall?: boolean;
  /** Accessible name for the number field (defaults to "Quantity"). */
  label?: string;
}

export function QtyStepper({ lang, value, onChange, isSmall = false, label }: QtyStepperProps) {
  const set = (n: number) => onChange(Math.max(1, Math.min(MAX_QTY, Number.isFinite(n) ? Math.trunc(n) : 1)));
  return (
    <div className={isSmall ? "qty qty--sm" : "qty"}>
      <button type="button" aria-label={t(lang, "dec")} disabled={value <= 1} onClick={() => set(value - 1)}>
        <Icon name="minus" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={value}
        aria-label={label ?? t(lang, "quantity")}
        onChange={(e) => set(Number(e.target.value))}
      />
      <button type="button" aria-label={t(lang, "inc")} disabled={value >= MAX_QTY} onClick={() => set(value + 1)}>
        <Icon name="plus" />
      </button>
    </div>
  );
}
