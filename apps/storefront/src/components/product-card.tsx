"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { StoreProduct } from "@tariq-book-depot/shared-types";
import { formatPkr } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: StoreProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    add(product);
    setAdded(true);
  };
  return (
    <article className={`product-card product-card--${product.kind}`}>
      <Link href={`/products/${product.handle}`} className="product-art" aria-label={`View ${product.title}`}>
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>
      <div className="product-info">
        <p className="product-meta">{product.authorOrBrand} / {product.category}</p>
        <h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3>
        <p className="product-spec-summary">{product.specs.slice(0, 2).map((item) => item.value).join(" / ")}</p>
        <div className="product-bottom">
          <span className="price tabular">{formatPkr(product.pricePkr)}</span>
          <button className="small-button" onClick={handleAdd} aria-live="polite"><Plus size={16} aria-hidden="true" /> {added ? "Added" : "Add"}</button>
        </div>
      </div>
    </article>
  );
}
