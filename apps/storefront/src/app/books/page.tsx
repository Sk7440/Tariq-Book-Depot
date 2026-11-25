import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.toLowerCase();
  const books = products.filter((product) => product.kind === "book" && (!query || `${product.title} ${product.authorOrBrand} ${product.category}`.toLowerCase().includes(query)));
  return <div className="page-width"><div className="catalog-heading"><div><span className="section-kicker">Books and reading</span><h1>Books</h1></div></div>{books.length ? <div className="product-grid catalog-grid">{books.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="notice">{query ? `No book titles matched "${resolvedSearchParams.q}".` : "There are no book titles in the supplied product catalog yet."} <Link className="text-link" href="/shop">Browse the available products.</Link></div>}</div>;
}
