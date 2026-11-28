"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { announce } from "@/components/chrome/live-region";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";

const DONE_MS = 1600;

interface AddToCartButtonProps {
  lang: Lang;
  productId: string;
  productName: string;
  className?: string;
}

export function AddToCartButton({ lang, productId, productName, className = "btn btn--line btn--sm" }: AddToCartButtonProps) {
  const { add, count } = useCart();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isDone) return;
    const timer = window.setTimeout(() => setIsDone(false), DONE_MS);
    return () => window.clearTimeout(timer);
  }, [isDone]);

  const handleClick = () => {
    add(productId);
    setIsDone(true);
    announce(t(lang, "addedLive", { name: productName, n: count + 1 }));
  };

  return (
    <button className={isDone ? `${className} is-done` : className} type="button" aria-label={`${t(lang, "add")}: ${productName}`} onClick={handleClick}>
      {isDone ? t(lang, "added") : t(lang, "add")}
    </button>
  );
}
