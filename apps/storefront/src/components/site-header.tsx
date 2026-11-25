"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, formatPkr, products } from "@/lib/catalog";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearchTerm(query.trim()), 200);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const matches = useMemo(() => {
    if (!searchTerm) return [];
    const normalized = searchTerm.toLocaleLowerCase();
    return products.filter((product) =>
      `${product.title} ${product.authorOrBrand ?? ""} ${product.category} ${product.description}`
        .toLocaleLowerCase()
        .includes(normalized),
    ).slice(0, 5);
  }, [searchTerm]);
  const matchingCategories = categories.filter((category) =>
    category.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Tariq Book Depot home">
          <strong>Tariq Book Depot</strong><span>Books · paper · Lahore</span>
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/shop">Shop all</Link>
          {categories.map((category) => (
            <Link href={`/collections/${category.handle}`} key={category.handle}>{category.name}</Link>
          ))}
          <Link href="/about">About</Link>
        </nav>
        <div
          className="search-wrap"
          onBlur={(event) => {
            if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
            window.setTimeout(() => setSearchOpen(false), 120);
          }}
        >
          <form className="header-search" action="/shop" role="search">
            <Search size={17} aria-hidden="true" />
            <input
              name="q"
              value={query}
              onChange={(event) => {
                if (!(event.nativeEvent instanceof InputEvent && event.nativeEvent.isComposing)) {
                  setQuery(event.currentTarget.value);
                }
              }}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={(event) => {
                setComposing(false);
                setQuery(event.currentTarget.value);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
                if (event.key === "ArrowDown") {
                  event.currentTarget.closest(".search-wrap")
                    ?.querySelector<HTMLAnchorElement>(".search-suggestions a")
                    ?.focus();
                }
              }}
              aria-label="Search products"
              aria-autocomplete="list"
              placeholder="Search products"
            />
          </form>
          {searchOpen && !composing && query.trim().length > 0 && (
            <div className="search-suggestions" id="search-suggestions" role="region" aria-label="Search suggestions" aria-live="polite">
              {matches.length > 0 ? (
                <ul aria-label="Matching products">
                  {matches.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.handle}`}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        <span className="search-result-image">
                          <Image src={product.images[0].url} alt="" fill sizes="48px" />
                        </span>
                        <span className="search-result-copy">
                          <strong>{product.title}</strong>
                          <small>{product.category} / {product.authorOrBrand}</small>
                        </span>
                        <span className="tabular">{formatPkr(product.pricePkr)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="search-empty">No matching products.</p>}
              {matchingCategories.length > 0 && (
                <div className="search-category-links">
                  <span>Categories</span>
                  {matchingCategories.map((category) => (
                    <Link
                      href={`/collections/${category.handle}`}
                      key={category.handle}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link className="search-view-all" href={`/shop?q=${encodeURIComponent(searchTerm)}`}>
                View search results
              </Link>
            </div>
          )}
        </div>
        <CartDrawer />
      </div>
    </header>
  );
}
