import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "../styles/tokens.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-nastaliq" });

export const metadata: Metadata = {
  title: { default: "Tariq Book Depot", template: "%s · Tariq Book Depot" },
  description: "Books, paper and stationery from Lahore.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${newsreader.variable} ${jakarta.variable} ${nastaliq.variable}`}><body><CartProvider><div className="site-shell"><SiteHeader /><main className="main-content">{children}</main><footer className="footer"><div className="page-width footer-grid"><div><h3>Tariq Book Depot</h3><p>Books and paper goods from Lahore, selected for reading, studying, and everyday writing.</p></div><div><h3>Shop</h3><p><Link href="/books">Books</Link><br /><Link href="/stationery">Stationery</Link><br /><Link href="/collections/gift-bundles">Gift bundles</Link></p></div><div><h3>Customer care</h3><p><Link href="/checkout">Checkout</Link><br /><Link href="/about">About & dispatch</Link><br /><Link href="/cart">Cart</Link></p></div></div></footer></div></CartProvider></body></html>;
}
