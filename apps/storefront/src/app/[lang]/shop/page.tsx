import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/components/shop/shop-page";
import { isLang } from "@/i18n/config";
import { t } from "@/i18n/t";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "all") } : {};
}

export default async function AllProductsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <ShopPage lang={lang} dept={null} />;
}
