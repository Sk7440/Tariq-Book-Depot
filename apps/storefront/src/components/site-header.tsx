"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Tariq Book Depot home">
          <strong>Tariq Book Depot</strong><span>Books · paper · Lahore</span>
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/books">Books</Link>
          <Link href="/stationery">Stationery</Link>
          <Link href="/cart">Cart</Link>
        </nav>
        <form className="header-search" action="/books">
          <Search size={17} aria-hidden="true" />
          <input name="q" aria-label="Search books and stationery" placeholder="Search title, author, ISBN or brand" />
        </form>
        <div className="header-actions">
          <Link className="icon-button" href="/cart" aria-label={`Cart with ${count} items`}><ShoppingBag size={20} /></Link>
          {count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
        </div>
      </div>
    </header>
  );
}
