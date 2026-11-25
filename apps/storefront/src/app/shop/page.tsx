import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/catalog";

type ShopPageProps = {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q = "", category = "", sort = "featured" } = await searchParams;
  const query = q.trim().toLocaleLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = !category || product.categoryHandle === category;
    const searchable = `${product.title} ${product.authorOrBrand ?? ""} ${product.category} ${product.description}`.toLocaleLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
  const sorted = [...filtered];
  if (sort === "price-asc") sorted.sort((a, b) => a.pricePkr - b.pricePkr);
  if (sort === "price-desc") sorted.sort((a, b) => b.pricePkr - a.pricePkr);
  if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  const selectedCategory = categories.find((item) => item.handle === category);

  return (
    <div className="page-width">
      <div className="catalog-heading">
        <div><span className="section-kicker">Tariq Book Depot</span><h1>Shop all</h1></div>
        <p>{sorted.length} {sorted.length === 1 ? "product" : "products"}</p>
      </div>
      <form className="catalog-toolbar" action="/shop" method="get">
        <label>
          Search
          <input type="search" name="q" defaultValue={q} aria-label="Search all products" />
        </label>
        <label>
          Category
          <select name="category" defaultValue={category}>
            <option value="">All categories</option>
            {categories.map((item) => <option value={item.handle} key={item.handle}>{item.name}</option>)}
          </select>
        </label>
        <label>
          Sort
          <select name="sort" defaultValue={sort}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title">Title</option>
          </select>
        </label>
        <button className="button secondary" type="submit">Apply</button>
        {(q || category || sort !== "featured") && <a className="text-link" href="/shop">Clear all</a>}
      </form>
      {(q || selectedCategory) && (
        <div className="active-filters" aria-label="Active filters">
          {q && <span className="filter active">Search: {q}</span>}
          {selectedCategory && <span className="filter active">{selectedCategory.name}</span>}
        </div>
      )}
      {sorted.length > 0 ? (
        <div className="product-grid catalog-grid">
          {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="notice">No products match these filters. Clear the filters or choose another category.</div>
      )}
    </div>
  );
}
