import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { RevealSection } from "@/components/reveal-section";
import { HeroReveal } from "@/components/hero-reveal";

export default function HomePage() {
  return <div className="page-width">
    <section className="hero">
      <HeroReveal><div className="hero-copy">
        <span className="eyebrow">A considered online bookshop</span>
        <h1>Make room for a good book.</h1>
        <p>Discover reading companions and everyday paper goods, presented with the care of a physical bookstore in Lahore.</p>
        <div className="actions"><Link className="button" href="/books">Browse books <ArrowRight size={17} /></Link><Link className="button secondary" href="/stationery">Shop stationery</Link></div>
      </div></HeroReveal>
      <div className="hero-stage" aria-label="Featured book display">
        <div className="book-stack" aria-hidden="true"><div className="book one"><small>The Book of Maps</small></div><div className="book two"><small>اردو ریڈنگ روم</small></div><div className="book three"><small>A Small Atlas</small></div></div>
        <div className="quick-buy"><span>Featured title</span><strong>The Book of Maps</strong><small>Demo Editions · Hardcover</small><div><b className="tabular">Rs. 1,850</b><Link className="quick-link" href="/products/the-book-of-maps" aria-label="View The Book of Maps">View <ArrowRight size={14} /></Link></div></div>
      </div>
    </section>
    <section className="trust-strip" aria-label="Store signals"><div className="trust-item">Nationwide Pakistan delivery</div><div className="trust-item">Original editions</div><div className="trust-item">Protective gift packaging</div><div className="trust-item">Cash on delivery available</div></section>
    <RevealSection className="section category-section">
      <div className="section-heading"><div><span className="section-kicker">Browse by shelf</span><h2>Find your next good read</h2></div><Link className="text-link" href="/books">View all books</Link></div>
      <div className="category-arches">{["Fiction","Non-Fiction","Academic","Urdu Literature"].map((name, index) => <Link href="/books" className={`category-arch arch-${index + 1}`} key={name}><span>0{index + 1}</span><strong>{name}</strong></Link>)}</div>
    </RevealSection>
    <RevealSection className="section">
      <div className="section-heading"><div><span className="section-kicker">Selected on the desk</span><h2>Selected for a slower afternoon</h2></div><Link className="text-link" href="/books">See the catalog</Link></div>
      <div className="product-grid">{products.filter((product) => product.kind === "book").slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </RevealSection>
    <RevealSection className="section bundle-band"><div><span className="section-kicker">The reading set</span><h2>Pair a novel with something useful.</h2></div><div className="bundle-list">{products.filter((product) => product.kind === "stationery").slice(0, 3).map((product) => <Link className="bundle-item" href={`/products/${product.handle}`} key={product.id}><span style={{ background: product.accent }} /><div><strong>{product.title}</strong><small>{product.specs.join(" · ")}</small></div></Link>)}</div></RevealSection>
    <RevealSection className="section">
      <div className="section-heading"><div><span className="section-kicker">On the writing table</span><h2>Paper for the everyday</h2></div><Link className="text-link" href="/stationery">Explore stationery</Link></div>
      <div className="product-grid">{products.filter((product) => product.kind === "stationery").map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </RevealSection>
  </div>;
}
