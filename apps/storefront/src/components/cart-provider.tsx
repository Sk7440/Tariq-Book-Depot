"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { DemoProduct } from "@tariq-book-depot/shared-types";

type CartLine = { product: DemoProduct; quantity: number };
type CartContextValue = { lines: CartLine[]; add: (product: DemoProduct) => void; remove: (id: string) => void; count: number };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const saved = window.localStorage.getItem("tbd-demo-cart");
    if (saved) setLines(JSON.parse(saved) as CartLine[]);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("tbd-demo-cart", JSON.stringify(lines));
  }, [lines]);
  const value = useMemo(() => ({
    lines,
    add: (product: DemoProduct) => setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }];
    }),
    remove: (id: string) => setLines((current) => current.filter((line) => line.product.id !== id)),
    count: lines.reduce((total, line) => total + line.quantity, 0),
  }), [lines]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
