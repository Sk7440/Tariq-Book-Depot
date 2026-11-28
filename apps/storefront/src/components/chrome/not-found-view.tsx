import Link from "next/link";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";

/** The HTML's viewNotFound(). */
export function NotFoundView({ lang }: { lang: Lang }) {
  return (
    <div className="wrap page">
      <div className="empty">
        <h1 className="page__title">{t(lang, "notFoundT")}</h1>
        <p className="empty__b">{t(lang, "notFoundB")}</p>
        <Link className="btn" href={href(lang, "/")}>{t(lang, "goHome")}</Link>
      </div>
    </div>
  );
}
