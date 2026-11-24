import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export default function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  // Server pages await dynamic params in Next.js 15.
  return <CollectionContent params={params} />;
}

async function CollectionContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const title = handle === "gift-bundles" ? "Gift bundles" : handle.replaceAll("-", " ");
  return <div className="page-width"><div className="catalog-heading"><div><span className="section-kicker">Curated set</span><h1 className="capitalize">{title}</h1></div></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div><p className="collection-note"><Link className="text-link" href="/books">Continue to the full catalog</Link></p></div>;
}
