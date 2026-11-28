import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderReceipt } from "@/components/checkout/order-receipt";
import { isLang } from "@/i18n/config";
import { t } from "@/i18n/t";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "orderPlaced"), robots: { index: false } } : {};
}

export default async function OrderPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div className="wrap page">
      <OrderReceipt lang={lang} />
    </div>
  );
}
