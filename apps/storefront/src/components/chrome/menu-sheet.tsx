"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import type { NavItem } from "./nav-items";
import { Sheet } from "./sheet";

interface MenuSheetProps {
  lang: Lang;
  id: string;
  isOpen: boolean;
  items: readonly NavItem[];
  activeKey: string;
  onClose: () => void;
}

const MotionLink = motion.create(Link);

/** Mobile menu: the owner's menu written on a ruled copy page. Links are written in one by one. */
export function MenuSheet({ lang, id, isOpen, items, activeKey, onClose }: MenuSheetProps) {
  const dx = lang === "ur" ? 12 : -12;
  return (
    <Sheet lang={lang} id={id} isOpen={isOpen} onClose={onClose} side="start" element="nav">
      <div className="sheet__head">
        <h2 className="sheet__title" id={`${id}-title`}>{t(lang, "menu")}</h2>
        <button className="iconbtn" type="button" data-sheet-close aria-label={t(lang, "closeMenu")} onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <div className="menu-page">
        {items.map((n, i) => (
          <MotionLink
            key={n.key}
            href={n.href}
            aria-current={n.key === activeKey ? "page" : undefined}
            onClick={onClose}
            initial={{ opacity: 0, x: dx }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.35, delay: 0.12 + i * 0.035, ease: "easeOut" } }}
          >
            {n.label}
          </MotionLink>
        ))}
      </div>
      <div className="sheet__foot">
        {t(lang, "brandSub")}. {t(lang, "cod")}.
      </div>
    </Sheet>
  );
}
