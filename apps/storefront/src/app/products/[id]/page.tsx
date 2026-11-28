import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/plain-catalog.module.css";
import { formatPrice, getProduct, getProducts, priceOf } from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ id: string }> {
  return getProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? { title: product.name } : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProduct((await params).id);
  if (!product) notFound();

  return (
    <main className={styles.page}>
      <p><Link href="/shop">All products</Link></p>
      <h1>{product.title}</h1>
      <p className={styles.price}>
        {formatPrice(priceOf(product))}
        {product.priceNote ? ` ${product.priceNote}` : ""}
      </p>
      {product.brand ? <p>Brand: {product.brand}</p> : null}
      <div className={styles.gallery}>
        {product.images.map((src, i) => (
          <span key={src} className={styles.frame}>
            <Image src={src} alt={`${product.name}, photo ${i + 1}`} fill sizes="(max-width: 480px) 100vw, 320px" priority={i === 0} />
          </span>
        ))}
      </div>
      {product.description.map((text) => <p key={text}>{text}</p>)}
      {product.specs.length ? (
        <dl>
          {product.specs.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
      ) : null}
      {product.features.length ? <ul>{product.features.map((f) => <li key={f}>{f}</li>)}</ul> : null}
    </main>
  );
}
