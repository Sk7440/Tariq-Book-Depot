"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPkr } from "@/lib/catalog";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const { lines, count, update, remove } = useCart();
  const subtotal = lines.reduce((sum, line) => sum + line.product.pricePkr * line.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;
      const controls = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  return <>
    <button className="icon-button cart-trigger" type="button" aria-label={`Open cart with ${count} items`} onClick={() => setOpen(true)}>
      <ShoppingBag size={20} aria-hidden="true" />
      {count > 0 && <span className="cart-count">{count}</span>}
    </button>
    {open && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <aside ref={panelRef} className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-header"><div><span className="section-kicker">Your selection</span><h2 id="cart-title">Cart</h2></div><button className="icon-button" type="button" aria-label="Close cart" onClick={() => setOpen(false)}><X size={20} /></button></div>
        <div className="drawer-lines">
          {lines.length === 0 ? <div className="empty-cart"><ShoppingBag size={28} /><p>Your cart is empty.</p><Link className="button secondary" href="/books" onClick={() => setOpen(false)}>Browse books</Link></div> : lines.map((line) => (
            <article className="drawer-line" key={line.product.id}>
              <div className="line-thumb" style={{ background: line.product.accent }}><span>{line.product.title}</span></div>
              <div className="line-content"><h3>{line.product.title}</h3><p>{line.product.authorOrBrand}</p><strong className="tabular">{formatPkr(line.product.pricePkr)}</strong><div className="quantity"><button type="button" aria-label={`Remove one ${line.product.title}`} onClick={() => update(line.product.id, line.quantity - 1)}><Minus size={14} /></button><span>{line.quantity}</span><button type="button" aria-label={`Add one ${line.product.title}`} onClick={() => update(line.product.id, line.quantity + 1)}><Plus size={14} /></button><button className="remove-line" type="button" onClick={() => remove(line.product.id)}>Remove</button></div></div>
            </article>
          ))}
        </div>
        {lines.length > 0 && <div className="drawer-footer"><div className="subtotal"><span>Subtotal</span><strong className="tabular">{formatPkr(subtotal)}</strong></div><p>Shipping and final totals are confirmed by the checkout service.</p><Link className="button drawer-checkout" href="/checkout" onClick={() => setOpen(false)}>Proceed to checkout</Link></div>}
      </aside>
    </div>}
  </>;
}
