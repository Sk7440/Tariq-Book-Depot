import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/plain-catalog.module.css";
import { formatPrice, getProducts, priceOf } from "@/lib/catalog";

export const metadata: Metadata = { title: "All products" };

export default function ShopPage() {
  const products = getProducts();
  return (
    <main className={styles.page}>
      <h1>All products</h1>
      <p>{products.length} products</p>
      <ul className={styles.grid}>
        {products.map((p) => (
          <li key={p.id}>
            <Link className={styles.card} href={`/products/${p.id}`}>
              <span className={styles.frame}>
                <Image src={p.images[0]} alt={p.name} fill sizes="(max-width: 480px) 100vw, 240px" />
              </span>
              <span>{p.name}</span>
              <span className={styles.price}>
                {formatPrice(priceOf(p))}
                {p.priceNote ? ` ${p.priceNote}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
