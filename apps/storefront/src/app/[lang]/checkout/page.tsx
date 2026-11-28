import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { href, isLang } from "@/i18n/config";
import { t } from "@/i18n/t";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "checkout"), robots: { index: false } } : {};
}

export default async function CheckoutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label={t(lang, "breadcrumb")}>
        <Link href={href(lang, "/cart")}>{t(lang, "yourCart")}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{t(lang, "checkout")}</span>
      </nav>
      <h1 className="page__title">{t(lang, "checkout")}</h1>
      <CheckoutForm lang={lang} />
    </div>
  );
}
