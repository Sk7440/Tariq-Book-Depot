"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreProduct } from "@tariq-book-depot/shared-types";
import { formatPkr } from "@/lib/catalog";
import { useCart } from "./cart-provider";

export function ProductPurchase({ product }: { product: StoreProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { add } = useCart();
  const router = useRouter();

  const addProduct = () => {
    add(product, quantity);
    setMessage(`${quantity} ${product.title} added to cart.`);
  };

  return (
    <div className="buy-box">
      <p className="price tabular">{formatPkr(product.pricePkr)}</p>
      <div className="purchase-quantity" aria-label="Quantity">
        <button
          className="quantity-button"
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <output aria-live="polite">{quantity}</output>
        <button
          className="quantity-button"
          type="button"
          onClick={() => setQuantity((value) => value + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="purchase-actions">
        <button className="button" type="button" onClick={addProduct}>Add to cart</button>
        <button
          className="button secondary"
          type="button"
          onClick={() => {
            add(product, quantity);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>
      <p className="purchase-feedback" aria-live="polite">{message}</p>
    </div>
  );
}
