import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartPageView } from "@/components/cart/cart-page-view";
import { isLang } from "@/i18n/config";
import { t } from "@/i18n/t";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "yourCart"), robots: { index: false } } : {};
}

export default async function CartPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div className="wrap page">
      <h1 className="page__title">{t(lang, "yourCart")}</h1>
      <CartPageView lang={lang} />
    </div>
  );
}
