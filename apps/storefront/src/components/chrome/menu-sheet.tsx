"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/components/icons";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { useModalSheet } from "@/hooks/use-modal-sheet";
import type { NavItem } from "./nav-items";

interface MenuSheetProps {
  lang: Lang;
  id: string;
  isOpen: boolean;
  items: readonly NavItem[];
  activeKey: string;
  onClose: () => void;
}

/** Mobile menu: the owner's menu written on a ruled copy page. */
export function MenuSheet({ lang, id, isOpen, items, activeKey, onClose }: MenuSheetProps) {
  const ref = useRef<HTMLElement>(null);
  useModalSheet(isOpen, onClose, ref);

  return (
    <>
      <div className="scrim" hidden={!isOpen} onClick={onClose} />
      <nav ref={ref} className="sheet sheet--start" id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} hidden={!isOpen}>
        <div className="sheet__head">
          <h2 className="sheet__title" id={`${id}-title`}>{t(lang, "menu")}</h2>
          <button className="iconbtn" type="button" data-sheet-close aria-label={t(lang, "closeMenu")} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="menu-page">
          {items.map((n) => (
            <Link key={n.key} href={n.href} aria-current={n.key === activeKey ? "page" : undefined} onClick={onClose}>
              {n.label}
            </Link>
          ))}
        </div>
        <div className="sheet__foot">
          {t(lang, "brandSub")}. {t(lang, "cod")}.
        </div>
      </nav>
    </>
  );
}
