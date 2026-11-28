import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/components/shop/shop-page";
import { isLang } from "@/i18n/config";
import { pick } from "@/i18n/t";
import { DEPARTMENT_LIST } from "@/lib/departments";

interface Props {
  params: Promise<{ lang: string; dept: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ dept: string }> {
  return DEPARTMENT_LIST.map((d) => ({ dept: d.id }));
}

function findDept(id: string) {
  return DEPARTMENT_LIST.find((d) => d.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, dept } = await params;
  const d = findDept(dept);
  return isLang(lang) && d ? { title: pick(lang, d.name) } : {};
}

export default async function DepartmentPage({ params }: Props) {
  const { lang, dept } = await params;
  const d = findDept(dept);
  if (!isLang(lang) || !d) notFound();
  return <ShopPage lang={lang} dept={d.id} />;
}
