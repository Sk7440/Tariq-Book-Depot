import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/config/store";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";

export function AboutBand({ lang }: { lang: Lang }) {
  return (
    <section className="sec">
      <div className="wrap aboutband">
        <Image src="/brand/logo.webp" alt={`${STORE.name}, ${t(lang, "brandSub")}`} width={240} height={240} />
        <div>
          <h2 className="sec__title">{t(lang, "aboutT")}</h2>
          <p>{t(lang, "aboutB")}</p>
          <Link className="textlink" href={href(lang, "/about")}>{t(lang, "readAbout")}</Link>
        </div>
      </div>
    </section>
  );
}
