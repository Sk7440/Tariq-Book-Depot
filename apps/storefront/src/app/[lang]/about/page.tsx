import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STORE } from "@/config/store";
import { href, isLang, type Lang } from "@/i18n/config";
import { pick, t } from "@/i18n/t";
import { getCategory, getProducts } from "@/lib/catalog";
import { DEPARTMENT_LIST } from "@/lib/departments";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: t(lang, "about") } : {};
}

const HOW_STEPS = [
  ["how1T", "how1B"],
  ["how2T", "how2B"],
  ["how3T", "how3B"],
] as const;

function deptCountLabel(lang: Lang, n: number): string {
  if (!n) return t(lang, "notOnline");
  return n === 1 ? t(lang, "products1") : t(lang, "productsN", { n });
}

/** The HTML's viewAbout(). */
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const products = getProducts();
  const countIn = (dept: string) => products.filter((p) => getCategory(p.category)?.departments.some((d) => d === dept)).length;

  return (
    <div className="wrap page">
      <h1 className="page__title">{t(lang, "aboutH")}</h1>
      <p className="lead">{t(lang, "aboutLead")}</p>
      <div className="about__cols">
        <Image src="/brand/logo.webp" alt={`${STORE.name}, ${t(lang, "brandSub")}`} width={280} height={280} />
        <section aria-labelledby="stock-t">
          <h2 className="sec__title" id="stock-t" style={{ marginBlockEnd: 16 }}>{t(lang, "stockT")}</h2>
          <div className="depts ruled">
            {DEPARTMENT_LIST.map((d) => (
              <div key={d.id}>
                <Link href={href(lang, `/shop/${d.id}`)}>{pick(lang, d.name)}</Link>
                <span>{deptCountLabel(lang, countIn(d.id))}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="sec" id="how" aria-labelledby="how-t">
        <div className="sec__head"><h2 className="sec__title" id="how-t">{t(lang, "howT")}</h2></div>
        <ol className="steps">
          {HOW_STEPS.map(([title, body], i) => (
            <li key={title}>
              <span className="step__n">{i + 1}</span>
              <h3>{t(lang, title)}</h3>
              <p>{t(lang, body)}</p>
            </li>
          ))}
        </ol>
        <p style={{ marginBlockStart: 32 }}><Link className="btn" href={href(lang, "/shop")}>{t(lang, "shopAll")}</Link></p>
      </section>
    </div>
  );
}
