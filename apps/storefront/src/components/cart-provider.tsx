"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { StoreProduct } from "@tariq-book-depot/shared-types";

type CartLine = { product: StoreProduct; quantity: number };
type CartContextValue = { lines: CartLine[]; add: (product: StoreProduct, quantity?: number) => void; update: (id: string, quantity: number) => void; remove: (id: string) => void; count: number };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const saved = window.localStorage.getItem("tbd-cart");
    if (saved) {
      try {
        setLines(JSON.parse(saved) as CartLine[]);
      } catch {
        window.localStorage.removeItem("tbd-cart");
      }
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("tbd-cart", JSON.stringify(lines));
  }, [lines]);
  const value = useMemo(() => ({
    lines,
    add: (product: StoreProduct, quantity = 1) => setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { product, quantity }];
    }),
    update: (id: string, quantity: number) => setLines((current) => quantity <= 0
      ? current.filter((line) => line.product.id !== id)
      : current.map((line) => line.product.id === id ? { ...line, quantity } : line)),
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
