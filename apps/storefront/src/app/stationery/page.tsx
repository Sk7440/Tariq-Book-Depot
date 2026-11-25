import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/catalog";

type StationeryPageProps = { searchParams: Promise<{ category?: string; sort?: string }> };

export default async function StationeryPage({ searchParams }: StationeryPageProps) {
  const { category = "", sort = "featured" } = await searchParams;
  const selected = products.filter((product) => !category || product.categoryHandle === category);
  if (sort === "price-asc") selected.sort((a, b) => a.pricePkr - b.pricePkr);
  if (sort === "price-desc") selected.sort((a, b) => b.pricePkr - a.pricePkr);
  const selectedCategory = categories.find((item) => item.handle === category);
  return (
    <div className="page-width">
      <div className="catalog-heading">
        <div><span className="section-kicker">Paper and writing supplies</span><h1>Stationery</h1></div>
        <p>{selected.length} {selected.length === 1 ? "product" : "products"}</p>
      </div>
      <form className="catalog-toolbar" action="/stationery" method="get">
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
          </select>
        </label>
        <button className="button secondary" type="submit">Apply</button>
        {(category || sort !== "featured") && <a className="text-link" href="/stationery">Clear all</a>}
      </form>
      {selectedCategory && <div className="active-filters"><span className="filter active">{selectedCategory.name}</span></div>}
      {selected.length ? (
        <div className="product-grid catalog-grid">{selected.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : <div className="notice">No stationery products match this category.</div>}
    </div>
  );
}
