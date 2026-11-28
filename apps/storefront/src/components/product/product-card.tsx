import Image from "next/image";
import Link from "next/link";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import type { CatalogProduct } from "@/lib/catalog";
import { formatPrice, packOf, priceOf } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";

const CARD_SIZES = "(max-width: 680px) 50vw, (max-width: 1024px) 33vw, 280px";

interface ProductCardProps {
  lang: Lang;
  product: CatalogProduct;
}

/** The HTML's card(): photo (second photo on hover), brand, name, pack, price, add button. */
export function ProductCard({ lang, product }: ProductCardProps) {
  const [main, alt] = product.images;
  const pack = packOf(product);
  const hasOffer = product.offerPrice !== null;
  return (
    <article className="card">
      <div className="card__media">
        <Image className="card__img is-cut" src={main} alt={product.name} fill sizes={CARD_SIZES} />
        {alt && <Image className="card__img card__img--alt is-cut" src={alt} alt="" aria-hidden="true" fill sizes={CARD_SIZES} />}
        {hasOffer && <span className="card__flag">{t(lang, "onSale")}</span>}
      </div>
      <div className="card__body">
        {product.brand && <p className="card__brand" lang="en">{product.brand}</p>}
        <h3 className="card__name" lang="en">
          <Link href={href(lang, `/products/${product.id}`)}>{product.name}</Link>
        </h3>
        {pack && <p className="card__pack" lang="en">{pack}</p>}
        <div className="card__foot">
          <span className="price card__price" lang="en">
            {hasOffer && <s>{formatPrice(product.price)}</s>}
            {formatPrice(priceOf(product))}
            {product.priceNote ? ` ${product.priceNote}` : ""}
          </span>
          <AddToCartButton lang={lang} productId={product.id} productName={product.name} />
        </div>
      </div>
    </article>
  );
}
