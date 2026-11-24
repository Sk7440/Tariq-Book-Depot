import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.toLowerCase();
  const books = products.filter((product) => product.kind === "book" && (!query || `${product.title} ${product.authorOrBrand} ${product.category}`.toLowerCase().includes(query)));
  return <div className="catalog-page page-width"><aside className="catalog-sidebar"><span className="section-kicker">Refine the shelf</span><h2>Filters</h2><fieldset><legend>Language</legend><label><input type="checkbox" /> English</label><label><input type="checkbox" /> Urdu</label><label><input type="checkbox" /> Arabic</label></fieldset><fieldset><legend>Binding</legend><label><input type="checkbox" /> Paperback</label><label><input type="checkbox" /> Hardcover</label></fieldset><button className="button secondary filter-clear" type="button">Clear filters</button></aside><section className="catalog-content"><div className="catalog-heading"><div><span className="section-kicker">The shelves</span><h1>Books</h1></div><label>Sort<select><option>Featured</option><option>Title</option><option>Price: low to high</option></select></label></div><div className="active-filters"><button className="filter active">All books <span aria-hidden="true">×</span></button></div>{books.length ? <div className="product-grid catalog-grid">{books.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="notice">No titles matched “{resolvedSearchParams.q}”. Try a title, author, or ISBN.</div>}</section></div>;
}
