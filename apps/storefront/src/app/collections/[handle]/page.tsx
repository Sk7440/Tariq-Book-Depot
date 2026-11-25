import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCategory, getProductsInCategory } from "@/lib/catalog";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const category = getCategory(handle);
  if (!category) notFound();
  const categoryProducts = getProductsInCategory(handle);

  return (
    <div className="page-width">
      <div className="catalog-heading">
        <div><span className="section-kicker">Product category</span><h1>{category.name}</h1></div>
        <p>{categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}</p>
      </div>
      {categoryProducts.length ? (
        <div className="product-grid catalog-grid">
          {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : <div className="notice">There are no products in this category.</div>}
    </div>
  );
}
