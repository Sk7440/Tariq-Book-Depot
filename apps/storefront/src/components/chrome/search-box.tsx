"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import type { ClientProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { matchesQuery } from "@/lib/shop-filter";

const MAX_RESULTS = 5;
const DEBOUNCE_MS = 90;

function searchProducts(products: readonly ClientProduct[], query: string): ClientProduct[] {
  return products.filter((p) => matchesQuery(p.haystack, query));
}

interface SearchBoxProps {
  lang: Lang;
  products: readonly ClientProduct[];
}

export function SearchBox({ lang, products }: SearchBoxProps) {
  const router = useRouter();
  const popId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(value), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [value]);

  const q = query.trim();
  const results = q ? searchProducts(products, q) : [];
  const isPopVisible = isOpen && q.length > 0;

  const close = () => setIsOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = value.trim();
    if (!term) return;
    close();
    inputRef.current?.blur();
    router.push(`${href(lang, "/search")}?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Escape" && isPopVisible) {
      e.stopPropagation();
      close();
      inputRef.current?.focus();
      return;
    }
    if (!isPopVisible || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    const links = Array.from(popRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (!links.length) return;
    e.preventDefault();
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowDown" ? (i + 1) % links.length : i <= 0 ? -1 : i - 1;
    if (next === -1) inputRef.current?.focus();
    else links[next].focus();
  };

  const handleBlur = (e: FocusEvent<HTMLFormElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
  };

  return (
    <form className="search" role="search" autoComplete="off" onSubmit={handleSubmit} onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <label className="sr-only" htmlFor="q">{t(lang, "searchLabel")}</label>
      <div className="search__box">
        <Icon name="search" />
        <input
          ref={inputRef}
          className="search__input"
          id="q"
          type="search"
          placeholder={t(lang, "search")}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={popId}
          aria-expanded={isPopVisible}
          enterKeyHint="search"
        />
        <button className="search__go" type="submit">{t(lang, "searchGo")}</button>
      </div>
      <div className="search__pop" id={popId} ref={popRef} hidden={!isPopVisible}>
        {isPopVisible && results.length > 0 && (
          <>
            {results.slice(0, MAX_RESULTS).map((p) => (
              <Link key={p.id} className="sres" href={href(lang, `/products/${p.id}`)} onClick={close}>
                <Image src={p.image} alt="" width={44} height={44} />
                <span>
                  <span className="sres__name" lang="en">{p.name}</span>
                  <span className="sres__meta" lang="en">{[p.pack, formatPrice(p.offerPrice ?? p.price)].filter(Boolean).join(", ")}</span>
                </span>
              </Link>
            ))}
            <Link className="sres__all" href={`${href(lang, "/search")}?q=${encodeURIComponent(q)}`} onClick={close}>
              {t(lang, "seeAll", { q })}
            </Link>
          </>
        )}
        {isPopVisible && results.length === 0 && <p className="sres__none">{t(lang, "searchNone", { q })}</p>}
      </div>
    </form>
  );
}
