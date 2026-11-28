import Link from "next/link";
import { href, type Lang } from "@/i18n/config";
import { t } from "@/i18n/t";
import { ShelfMotion } from "./shelf-motion";

/** Spine positions from the HTML: [x, height, width]. */
const SPINES: ReadonlyArray<readonly [number, number, number]> = [
  [20, 92, 26], [52, 108, 30], [88, 80, 22], [116, 100, 34], [156, 116, 26], [188, 86, 24],
  [218, 104, 30], [254, 94, 22], [282, 110, 28], [316, 84, 26], [348, 100, 30],
];

/** Featured books: an honest empty shelf until books are in the catalogue. */
export function BooksShelf({ lang }: { lang: Lang }) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec__head"><h2 className="sec__title">{t(lang, "featuredBooks")}</h2></div>
        <ShelfMotion>
          <svg className="shelf__art" viewBox="0 0 400 150" role="img" aria-label={t(lang, "booksEmptyT")}>
            {SPINES.map(([x, h, w]) => <rect key={x} className="spine" x={x} y={140 - h} width={w} height={h} rx={2} />)}
            <line className="board" x1={6} y1={141} x2={394} y2={141} />
          </svg>
          <div>
            <h3 className="shelf__t">{t(lang, "booksEmptyT")}</h3>
            <p className="shelf__b">{t(lang, "booksEmptyB")}</p>
            <Link className="btn btn--line" href={href(lang, "/shop/stationery")}>{t(lang, "shopStationery")}</Link>
          </div>
        </ShelfMotion>
      </div>
    </section>
  );
}
