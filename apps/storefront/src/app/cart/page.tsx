"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPkr } from "@/lib/catalog";

export default function CartPage() {
  const { lines, remove } = useCart();
  const subtotal = lines.reduce((sum, line) => sum + line.product.pricePkr * line.quantity, 0);
  return <div className="page-width"><div className="page-title"><span className="eyebrow">Your reading pile</span><h1>Cart</h1></div>{lines.length === 0 ? <div className="notice">Your cart is empty. <Link className="text-link" href="/books">Browse the shelves.</Link></div> : <div className="form">{lines.map((line) => <div className="notice" key={line.product.id}><strong>{line.product.title}</strong> · {line.quantity} × {formatPkr(line.product.pricePkr)} <button className="small-button" onClick={() => remove(line.product.id)}>Remove</button></div>)}<p className="price tabular">Demo subtotal: {formatPkr(subtotal)}</p><p className="notice">Authoritative totals, shipping, discounts, and inventory will be returned by Medusa in the commerce milestone.</p><Link className="button" href="/checkout">Continue to checkout</Link></div>}</div>;
}
