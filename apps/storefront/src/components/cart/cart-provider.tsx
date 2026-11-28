"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as z from "zod";
import type { ClientProduct } from "@/lib/catalog";
import { priceOf } from "@/lib/format";

/**
 * Cart state in localStorage. Only ids and quantities are stored; prices are always
 * read from products.json. On load, lines are validated and unknown ids dropped.
 */
export const MAX_QTY = 99;
const STORAGE_KEY = "tbd-cart-v1";

const LineSchema = z.strictObject({ id: z.string().min(1), qty: z.number().int().min(1).max(MAX_QTY) });
const StoredCartSchema = z.array(LineSchema);

export type CartLine = z.infer<typeof LineSchema>;

/** A cart line joined with its product; `total` = price × qty. */
export interface PricedLine extends CartLine {
  product: ClientProduct;
  rate: number;
  total: number;
}

interface CartContextValue {
  lines: readonly PricedLine[];
  /** Total quantity across lines. */
  count: number;
  subtotal: number;
  /** False until the stored cart has been read on the client. */
  isReady: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.trunc(qty)));
}

function readStored(validIds: ReadonlySet<string>): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = StoredCartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.filter((l) => validIds.has(l.id)) : [];
  } catch {
    // Unreadable storage (privacy mode, corrupt JSON): start with an empty cart.
    return [];
  }
}

interface CartProviderProps {
  products: readonly ClientProduct[];
  children: ReactNode;
}

export function CartProvider({ products, children }: CartProviderProps) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const validIds = useMemo(() => new Set(byId.keys()), [byId]);

  useEffect(() => {
    setRaw(readStored(validIds));
    setIsReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setRaw(readStored(validIds));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [validIds]);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      // Storage full or blocked: the cart still works for this page view.
    }
  }, [raw, isReady]);

  const add = useCallback(
    (id: string, qty = 1) => {
      if (!validIds.has(id)) return;
      setRaw((prev) => {
        const existing = prev.find((l) => l.id === id);
        if (!existing) return [...prev, { id, qty: clampQty(qty) }];
        return prev.map((l) => (l.id === id ? { ...l, qty: clampQty(l.qty + qty) } : l));
      });
    },
    [validIds],
  );
  const setQty = useCallback((id: string, qty: number) => {
    setRaw((prev) => prev.map((l) => (l.id === id ? { ...l, qty: clampQty(qty) } : l)));
  }, []);
  const remove = useCallback((id: string) => setRaw((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setRaw([]), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = raw.flatMap((l): PricedLine[] => {
      const product = byId.get(l.id);
      if (!product) return [];
      const rate = priceOf(product);
      return [{ ...l, product, rate, total: rate * l.qty }];
    });
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.total, 0),
      isReady,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      add,
      setQty,
      remove,
      clear,
    };
  }, [raw, byId, isReady, isDrawerOpen, openDrawer, closeDrawer, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
