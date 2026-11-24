"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPkr } from "@/lib/catalog";

export default function CartPage() {
  const { lines, update, remove } = useCart();
  const subtotal = lines.reduce((sum, line) => sum + line.product.pricePkr * line.quantity, 0);
  return <div className="page-width cart-page"><div className="catalog-heading"><div><span className="section-kicker">Your selection</span><h1>Cart</h1></div></div>{lines.length === 0 ? <div className="notice">Your cart is empty. <Link className="text-link" href="/books">Browse the shelves.</Link></div> : <div className="cart-layout"><div className="cart-lines">{lines.map((line) => <article className="cart-line" key={line.product.id}><div className="line-thumb" style={{ background: line.product.accent }}><span>{line.product.title}</span></div><div><h2>{line.product.title}</h2><p>{line.product.authorOrBrand}</p><strong className="tabular">{formatPkr(line.product.pricePkr)}</strong><div className="quantity"><button type="button" onClick={() => update(line.product.id, line.quantity - 1)} aria-label={`Decrease ${line.product.title}`}>−</button><span>{line.quantity}</span><button type="button" onClick={() => update(line.product.id, line.quantity + 1)} aria-label={`Increase ${line.product.title}`}>+</button><button type="button" className="remove-line" onClick={() => remove(line.product.id)}>Remove</button></div></div></article>)}</div><aside className="cart-summary"><span className="section-kicker">Order summary</span><div className="subtotal"><span>Subtotal</span><strong className="tabular">{formatPkr(subtotal)}</strong></div><p>Shipping and final totals are confirmed at checkout.</p><Link className="button" href="/checkout">Proceed to checkout</Link></aside></div>}</div>;
}
