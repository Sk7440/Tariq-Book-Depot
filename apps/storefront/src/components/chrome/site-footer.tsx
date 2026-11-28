import Link from "next/link";
import { STORE } from "@/config/store";
import { href, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { DEPARTMENT_LIST } from "@/lib/departments";

interface SiteFooterProps {
  lang: Lang;
}

export function SiteFooter({ lang }: SiteFooterProps) {
  const phoneHref = STORE.phone ? `tel:${STORE.phone.replace(/[^\d+]/g, "")}` : null;
  return (
    <footer className="ftr" id="ftr">
      <div className="wrap ftr__grid">
        <div>
          <p className="ftr__name">{lang === "ur" ? STORE.nameUr : STORE.name}</p>
          <p className="ftr__tag">{t(lang, "footTag")}</p>
        </div>
        <nav aria-labelledby="f-shop">
          <h2 id="f-shop">{t(lang, "footShop")}</h2>
          <ul>
            <li><Link href={href(lang, "/shop")}>{t(lang, "all")}</Link></li>
            {DEPARTMENT_LIST.map((d) => (
              <li key={d.id}><Link href={href(lang, `/shop/${d.id}`)}>{pick(lang, d.name)}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="f-help">
          <h2 id="f-help">{t(lang, "footHelp")}</h2>
          <ul>
            <li><Link href={href(lang, "/about")}>{t(lang, "about")}</Link></li>
            <li><Link href={`${href(lang, "/about")}#how`}>{t(lang, "howT")}</Link></li>
            <li><Link href={href(lang, "/contact")}>{t(lang, "contact")}</Link></li>
            <li><Link href={href(lang, "/cart")}>{t(lang, "yourCart")}</Link></li>
          </ul>
        </nav>
        <div>
          <h2>{t(lang, "footVisit")}</h2>
          <p>{STORE.address ?? pick(lang, STORE.city)}</p>
          <p style={{ marginBlockStart: 8 }}>
            {STORE.phone && phoneHref ? (
              <a href={phoneHref} lang="en">{STORE.phone}</a>
            ) : (
              <>{t(lang, "cPhone")}: <span className="missing">{t(lang, "missing")}</span></>
            )}
          </p>
        </div>
      </div>
      <div className="wrap ftr__base">{t(lang, "footBase")}</div>
    </footer>
  );
}
