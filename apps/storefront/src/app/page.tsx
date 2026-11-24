import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  return <div className="page-width">
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">A considered online bookshop</span>
        <h1>Make room for a good book.</h1>
        <p>Discover reading companions and everyday paper goods, presented with the care of a physical bookstore in Lahore.</p>
        <div className="actions"><Link className="button" href="/books">Browse books <ArrowRight size={17} /></Link><Link className="button secondary" href="/stationery">Shop stationery</Link></div>
      </div>
      <div className="hero-stage" aria-label="Editorial display of demo books">
        <div className="book-stack"><div className="book one"><small>The Book of Maps</small></div><div className="book two"><small>اردو ریڈنگ روم</small></div><div className="book three"><small>A Small Atlas</small></div></div>
      </div>
    </section>
    <section className="trust-strip" aria-label="Store signals"><div className="trust-item">Nationwide Pakistan delivery</div><div className="trust-item">Original editions</div><div className="trust-item">Protective gift packaging</div><div className="trust-item">Cash on delivery available</div></section>
    <section className="section"><div className="section-heading"><h2>Selected for a slower afternoon</h2><Link className="text-link" href="/books">See the catalog</Link></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="section"><div className="section-heading"><h2>Paper for the everyday</h2><Link className="text-link" href="/stationery">Explore stationery</Link></div><div className="product-grid">{products.slice(3).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
  </div>;
}
