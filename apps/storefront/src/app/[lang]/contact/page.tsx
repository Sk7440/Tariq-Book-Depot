import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { FaqItem } from "@/components/contact/faq-item";
import { STORE } from "@/config/store";
import { isLang, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "contact") } : {};
}

const FAQ = [
  ["q1", "a1"],
  ["q2", "a2"],
  ["q3", "a3"],
] as const;

function Missing({ lang }: { lang: Lang }) {
  return <span className="missing">{t(lang, "missing")}</span>;
}

/** The HTML's viewContact(). Every unknown value shows "Not added yet". */
export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const value = (v: string | null, render: (v: string) => ReactNode): ReactNode => (v ? render(v) : <Missing lang={lang} />);

  return (
    <div className="wrap page">
      <h1 className="page__title">{t(lang, "contactH")}</h1>
      <div className="contact">
        <dl className="clist ruled">
          <div><dt>{t(lang, "cShop")}</dt><dd>{lang === "ur" ? STORE.nameUr : STORE.name}, {pick(lang, STORE.city)}</dd></div>
          <div><dt>{t(lang, "cAddress")}</dt><dd>{value(STORE.address, (v) => v)}</dd></div>
          <div><dt>{t(lang, "cPhone")}</dt><dd>{value(STORE.phone, (v) => <a className="textlink" href={`tel:${v.replace(/[^\d+]/g, "")}`} lang="en">{v}</a>)}</dd></div>
          <div><dt>{t(lang, "cWhatsapp")}</dt><dd>{value(STORE.whatsapp, (v) => <a className="textlink" href={`https://wa.me/${v}`} rel="noopener noreferrer" lang="en">+{v}</a>)}</dd></div>
          <div><dt>{t(lang, "cEmail")}</dt><dd>{value(STORE.email, (v) => <a className="textlink" href={`mailto:${v}`} lang="en">{v}</a>)}</dd></div>
          <div><dt>{t(lang, "cHours")}</dt><dd>{STORE.hours ? pick(lang, STORE.hours) : <Missing lang={lang} />}</dd></div>
        </dl>
        <section className="faq" aria-labelledby="faq-t">
          <h2 className="sec__title" id="faq-t" style={{ marginBlockEnd: 16 }}>{t(lang, "faqT")}</h2>
          {FAQ.map(([q, a]) => <FaqItem key={q} question={t(lang, q)} answer={t(lang, a)} />)}
        </section>
      </div>
    </div>
  );
}
