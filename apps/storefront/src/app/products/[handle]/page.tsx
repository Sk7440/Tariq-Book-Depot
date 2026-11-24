import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { formatPkr, getProduct, products } from "@/lib/catalog";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const product = getProduct(resolvedParams.handle);
  if (!product) notFound();
  const related = products.filter((item) => item.kind === product.kind && item.id !== product.id).slice(0, 3);
  return <div className="page-width"><div className="detail"><div className="detail-art"><span className="art-label" style={{ background: product.accent }}>{product.title}</span></div><div className="detail-copy"><span className="eyebrow">{product.kind === "book" ? "Book" : "Stationery"} · demo catalog</span><h1>{product.title}</h1><p className="product-meta">{product.authorOrBrand} · {product.category}</p><p className="description">{product.description}</p><dl className="spec-list">{product.specs.map((spec) => <div className="spec" key={spec}><dt>Specification</dt><dd>{spec}</dd></div>)}</dl><p className="price tabular">{formatPkr(product.pricePkr)}</p><form action="/cart" className="actions"><button className="button" type="submit">Add to cart</button></form><p className="notice">This is demonstration data. Live variant selection, inventory, pricing, and checkout are intentionally deferred until Medusa is configured.</p></div></div>{related.length > 0 && <section className="section"><div className="section-heading"><h2>More from this shelf</h2></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}</div>;
}
