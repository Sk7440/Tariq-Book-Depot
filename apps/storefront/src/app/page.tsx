import Image from "next/image";
import Link from "next/link";
import { HeroReveal } from "@/components/hero-reveal";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { categories, getProductsInCategory, products } from "@/lib/catalog";

const featuredProduct = products[0];

export default function HomePage() {
  return (
    <div className="page-width">
      <section className="hero">
        <HeroReveal>
          <div className="hero-copy">
            <span className="eyebrow">Tariq Book Depot</span>
            <h1>Useful things for the page and the desk.</h1>
            <p>Browse paper, pencils and everyday stationery from our Lahore shop.</p>
            <div className="actions">
              <Link className="button" href="/shop">Shop all products</Link>
              <Link className="button secondary" href="/stationery">Browse stationery</Link>
            </div>
          </div>
        </HeroReveal>
        <div className="hero-product">
          <Link className="hero-product-image" href={`/products/${featuredProduct.handle}`}>
            <Image
              src={featuredProduct.images[0].url}
              alt={featuredProduct.images[0].alt}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 48vw"
            />
          </Link>
          <div className="hero-product-details">
            <div>
              <span className="product-meta">{featuredProduct.category}</span>
              <h2><Link href={`/products/${featuredProduct.handle}`}>{featuredProduct.title}</Link></h2>
            </div>
            <ProductPurchase product={featuredProduct} />
          </div>
        </div>
      </section>

      <section className="section category-section" aria-labelledby="categories-title">
        <div className="section-heading">
          <div><h2 id="categories-title">Shop by category</h2></div>
          <Link className="text-link" href="/shop">View the full catalog</Link>
        </div>
        <div className="category-arches">
          {categories.map((category) => {
            const count = getProductsInCategory(category.handle).length;
            return (
              <Link
                href={`/collections/${category.handle}`}
                className="category-arch"
                key={category.handle}
              >
                <span>{count} {count === 1 ? "item" : "items"}</span>
                <strong>{category.name}</strong>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div><h2 id="catalog-title">The catalog</h2></div>
          <Link className="text-link" href="/shop">Browse all {products.length} products</Link>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
