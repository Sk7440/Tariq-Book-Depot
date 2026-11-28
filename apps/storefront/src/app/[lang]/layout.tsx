import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { LiveRegion } from "@/components/chrome/live-region";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { STORE } from "@/config/store";
import { dirOf, isLang, LANGS } from "@/i18n/config";
import { t } from "@/i18n/t";
import { toClientProducts } from "@/lib/catalog";
import { fontVariables } from "../fonts";
import "../globals.css";

/**
 * Absolute base for Open Graph image URLs. Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically
 * (system environment variable); nothing needs configuring. Locally it falls back to the dev server.
 */
function siteUrl(): URL {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(host ? `https://${host}` : "http://localhost:8000");
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ lang: string }> {
  return LANGS.map((lang) => ({ lang }));
}

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Omit<LangLayoutProps, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const name = lang === "ur" ? STORE.nameUr : STORE.name;
  return {
    metadataBase: siteUrl(),
    title: { default: name, template: `%s · ${name}` },
    description: t(lang, "heroSub"),
    icons: { icon: "/brand/logo.webp" },
    alternates: { languages: { en: "/en", ur: "/ur" } },
  };
}

export const viewport: Viewport = { themeColor: "#0B2349" };

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const clientProducts = toClientProducts();

  return (
    <html lang={lang} dir={dirOf(lang)} className={fontVariables}>
      <body>
        <a className="skip" href="#main">{t(lang, "skip")}</a>
        <CartProvider products={clientProducts}>
          <SiteHeader lang={lang} products={clientProducts} />
          <CartDrawer lang={lang} />
          <main id="main" tabIndex={-1}>{children}</main>
          <SiteFooter lang={lang} />
        </CartProvider>
        <LiveRegion />
      </body>
    </html>
  );
}
