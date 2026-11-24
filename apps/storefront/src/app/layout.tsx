import type { Metadata } from "next";
import "../styles/tokens.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default: "Tariq Book Depot", template: "%s · Tariq Book Depot" },
  description: "Books, paper and stationery from Lahore.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><div className="site-shell"><SiteHeader /><main className="main-content">{children}</main><footer className="footer"><div className="page-width footer-grid"><div><h3 className="serif">Tariq Book Depot</h3><p>A storefront foundation for a thoughtful online book and stationery shop. Catalog and policy details will come from the configured business backend.</p></div><div><h3>Shop</h3><p><Link href="/books">Books</Link><br /><Link href="/stationery">Stationery</Link><br /><Link href="/cart">Cart</Link></p></div><div><h3>Information</h3><p>Delivery, returns, and contact details will be published after they are supplied and verified.</p></div></div></footer></div></CartProvider></body></html>;
}

import Link from "next/link";
