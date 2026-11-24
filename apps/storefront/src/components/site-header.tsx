"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Tariq Book Depot home">
          <strong>Tariq Book Depot</strong><span>Books · paper · Lahore</span>
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/books">Books</Link>
          <Link href="/stationery">Stationery</Link>
          <Link href="/books?category=urdu">Urdu Literature</Link>
          <Link href="/collections/gift-bundles">Bundles</Link>
          <Link href="/about">About</Link>
        </nav>
        <form className="header-search" action="/books">
          <Search size={17} aria-hidden="true" />
          <input name="q" aria-label="Search books and stationery" placeholder="Search title, author, ISBN or brand" />
        </form>
        <CartDrawer />
      </div>
    </header>
  );
}
