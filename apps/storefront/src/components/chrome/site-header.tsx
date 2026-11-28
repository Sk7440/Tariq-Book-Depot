"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState, type MouseEvent } from "react";
import { CartCount } from "@/components/cart/cart-count";
import { useCart } from "@/components/cart/cart-provider";
import { Icon } from "@/components/icons";
import { STORE } from "@/config/store";
import { href, switchLangPath, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import type { ClientProduct } from "@/lib/catalog";
import { MenuSheet } from "./menu-sheet";
import { activeNavKey, navItems } from "./nav-items";
import { SearchBox } from "./search-box";

const MENU_ID = "menu";

interface SiteHeaderProps {
  lang: Lang;
  products: readonly ClientProduct[];
}

export function SiteHeader({ lang, products }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, isReady, isDrawerOpen, openDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const items = navItems(lang);
  const activeKey = activeNavKey(pathname);
  const other: Lang = lang === "en" ? "ur" : "en";
  const langHref = switchLangPath(pathname, other);
  // Keep shop filters and search terms when switching language (read at click time to keep the header static).
  const handleLangClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!window.location.search || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    router.push(`${langHref}${window.location.search}`, { scroll: false });
  };
  const shownCount = isReady ? count : 0;

  return (
    <>
      <header className="hdr" id="hdr">
        <div className="hdr__bar wrap">
          <button className="iconbtn hdr__menu" type="button" aria-controls={MENU_ID} aria-expanded={isMenuOpen} aria-label={t(lang, "openMenu")} onClick={() => setIsMenuOpen(true)}>
            <Icon name="menu" />
          </button>
          <Link className="brand" href={href(lang, "/")} aria-label={`${STORE.name}, ${t(lang, "home")}`}>
            <Image className="brand__badge" src="/brand/logo.webp" alt="" width={48} height={48} priority />
            <span className="brand__text">
              <span className="brand__name" lang="en">{STORE.name}</span>
              <span className="brand__sub">{t(lang, "brandSub")}</span>
            </span>
          </Link>
          <SearchBox lang={lang} products={products} />
          <Link className="langbtn" href={langHref} lang={other} hrefLang={other} aria-label={t(lang, "langLabel")} scroll={false} onClick={handleLangClick}>
            <span className="langbtn__full">{t(lang, "langSwitch")}</span>
            <span className="langbtn__short" aria-hidden="true">{lang === "en" ? "اردو" : "EN"}</span>
          </Link>
          <button className="iconbtn cartbtn" type="button" aria-controls="cart" aria-expanded={isDrawerOpen} onClick={openDrawer}>
            <Icon name="bag" />
            <span className="cartbtn__label">{t(lang, "cart")}</span>
            <CartCount count={shownCount} />
            <span className="sr-only">{t(lang, "cartItems", { n: shownCount })}</span>
          </button>
        </div>
        <nav className="hdr__nav wrap" aria-label={t(lang, "mainNav")}>
          {items.map((n) => (
            <Link key={n.key} href={n.href} aria-current={n.key === activeKey ? "page" : undefined}>{n.label}</Link>
          ))}
        </nav>
      </header>
      <MenuSheet lang={lang} id={MENU_ID} isOpen={isMenuOpen} items={items} activeKey={activeKey} onClose={closeMenu} />
    </>
  );
}
