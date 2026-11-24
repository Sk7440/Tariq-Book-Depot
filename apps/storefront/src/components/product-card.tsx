"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { DemoProduct } from "@tariq-book-depot/shared-types";
import { formatPkr } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: DemoProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 180);
  };
  return (
    <article className="product-card">
      <Link href={`/products/${product.handle}`} className="product-art" aria-label={`View ${product.title}`}>
        <span className="art-label" style={{ background: product.accent }}>{product.title}</span>
      </Link>
      <div className="product-info">
        <p className="product-meta">{product.authorOrBrand} · {product.category}</p>
        <h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3>
        <div className="product-bottom">
          <span className="price tabular">{formatPkr(product.pricePkr)}</span>
          <button className="small-button" onClick={handleAdd} aria-live="polite"><Plus size={16} aria-hidden="true" /> {added ? "Added" : "Add"}</button>
        </div>
      </div>
    </article>
  );
}
