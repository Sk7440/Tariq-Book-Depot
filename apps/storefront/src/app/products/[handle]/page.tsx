import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { HeroReveal } from "@/components/hero-reveal";
import { RevealSection } from "@/components/reveal-section";
import { categories, getProduct, products } from "@/lib/catalog";

type ProductPageProps = { params: Promise<{ handle: string }> };

function plainDescription(description: string) {
  return description.replace(/^\*\s/gm, "").replace(/\n/g, " ").trim();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return {};

  return {
    title: product.title,
    description: plainDescription(product.description).slice(0, 160),
    openGraph: {
      title: product.title,
      description: plainDescription(product.description).slice(0, 160),
      images: [{ url: product.images[0].url, alt: product.images[0].alt }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const category = categories.find((item) => item.handle === product.categoryHandle);
  const descriptionBlocks = product.description.split("\n\n");
  const related = products
    .filter((item) => item.categoryHandle === product.categoryHandle && item.id !== product.id)
    .slice(0, 4);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: plainDescription(product.description),
    image: product.images.map((image) => image.url),
    category: product.category,
    brand: product.authorOrBrand
      ? { "@type": "Brand", name: product.authorOrBrand }
      : undefined,
  };

  return (
    <div className="page-width product-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/collections/${product.categoryHandle}`}>{category?.name ?? product.category}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">{product.title}</span>
      </nav>

      <section className="detail">
        <ProductGallery images={product.images} title={product.title} />
        <div className="detail-copy">
          <Link className="product-category-link" href={`/collections/${product.categoryHandle}`}>
            {category?.name ?? product.category}
          </Link>
          {product.authorOrBrand && <p className="product-byline">{product.authorOrBrand}</p>}
          <HeroReveal><h1>{product.title}</h1></HeroReveal>
          <p className="product-lead">
            {descriptionBlocks.find((block, index) =>
              index > 0 &&
              block !== product.title &&
              !/^(features|key features|product features|product specifications):/i.test(block) &&
              !block.includes("\n* "),
            ) ?? descriptionBlocks[0]}
          </p>
          <ProductPurchase product={product} />
          <div className="delivery-panel">
            <strong>Delivery and payment</strong>
            <p>Available delivery methods, charges, and payment options are confirmed at checkout.</p>
          </div>
        </div>
      </section>

      <RevealSection className="product-story section">
        <section className="product-story-copy" aria-labelledby="product-story-title">
          <h2 id="product-story-title">Product details</h2>
          {product.description.split("\n\n").map((block, index) => {
            const lines = block.split("\n");
            const heading = lines[0].replace(/:$/, "");
            const bulletLines = lines.slice(1).filter((line) => line.startsWith("* "));

            if (bulletLines.length > 0) {
              return (
                <section className="description-group" key={`${heading}-${index}`}>
                  <h3>{heading}</h3>
                  <ul>
                    {bulletLines.map((line) => <li key={line}>{line.slice(2)}</li>)}
                  </ul>
                </section>
              );
            }

            return <p className="description" key={`${block}-${index}`}>{block}</p>;
          })}
        </section>
        {product.specs.length > 0 && (
          <section className="product-specifications" aria-labelledby="specifications-title">
            <h2 id="specifications-title">Specifications</h2>
            <dl className="spec-list">
              {product.specs.map((item) => (
                <div className="spec" key={item.name}>
                  <dt>{item.name}</dt><dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </RevealSection>

      {related.length > 0 && (
        <section className="section related-products">
          <div className="section-heading">
            <div><h2>More from {category?.name ?? product.category}</h2></div>
            <Link className="text-link" href={`/collections/${product.categoryHandle}`}>Browse category</Link>
          </div>
          <div className="product-grid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
