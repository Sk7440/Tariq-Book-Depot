import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/i18n/t";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: t("en", "notFoundT") };

/** 404 for paths outside /en and /ur (enabled by experimental.globalNotFound). Offers both languages. */
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <main id="main" className="wrap page">
          <div className="empty">
            <h1 className="page__title">{t("en", "notFoundT")}</h1>
            <p className="empty__b">{t("en", "notFoundB")}</p>
            <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn" href="/en">{t("en", "goHome")}</Link>
              <Link className="btn btn--line" href="/ur" lang="ur" dir="rtl">{t("ur", "goHome")}</Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
