import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.toLowerCase();
  const books = products.filter((product) => product.kind === "book" && (!query || `${product.title} ${product.authorOrBrand} ${product.category}`.toLowerCase().includes(query)));
  return <div className="page-width"><div className="page-title"><span className="eyebrow">The shelves</span><h1>Books with a little room around them.</h1><p>Demonstration catalog items are marked by their sample metadata and are not claims of live stock.</p></div><div className="filters"><button className="filter">All books</button><button className="filter">English</button><button className="filter">Urdu</button><button className="filter">Paperback</button></div>{books.length ? <div className="product-grid">{books.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="notice">No demo titles matched “{resolvedSearchParams.q}”. Try a title, author, or ISBN.</div>}</div>;
}
