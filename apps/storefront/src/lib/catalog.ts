import type { DemoProduct } from "@tariq-book-depot/shared-types";

export const products: DemoProduct[] = [
  { id: "book-maps", handle: "the-book-of-maps", kind: "book", title: "The Book of Maps", authorOrBrand: "Demo Editions", pricePkr: 1850, category: "Fiction", accent: "#1f3a2e", description: "A demonstration title for the editorial storefront. Replace with verified catalog copy before launch.", specs: ["Paperback", "English", "ISBN pending"] },
  { id: "book-urdu", handle: "urdu-reading-room", kind: "book", title: "اردو ریڈنگ روم", authorOrBrand: "نمونہ ایڈیشن", pricePkr: 1250, category: "Urdu Literature", accent: "#2b3e63", description: "ایک نمائشی عنوان۔ اشاعت اور دستیابی کی تفصیل backend میں تصدیق کے بعد شامل ہوگی۔", specs: ["Paperback", "Urdu", "ISBN pending"] },
  { id: "book-atlas", handle: "a-small-atlas", kind: "book", title: "A Small Atlas", authorOrBrand: "Tariq Press Demo", pricePkr: 2200, category: "Non-Fiction", accent: "#b85d3b", description: "A considered placeholder product demonstrating the product-detail data shape.", specs: ["Hardcover", "English", "ISBN pending"] },
  { id: "stationery-notebook", handle: "linen-notebook-a5", kind: "stationery", title: "Linen Notebook A5", authorOrBrand: "Tariq Studio Demo", pricePkr: 780, category: "Notebooks & Journals", accent: "#6d7965", description: "A demo notebook with a quiet paper surface and room for everyday notes.", specs: ["100 GSM", "Dotted", "A5"] },
  { id: "stationery-pen", handle: "forest-gel-pen", kind: "stationery", title: "Forest Gel Pen", authorOrBrand: "Demo Stationery", pricePkr: 260, category: "Pens & Ink", accent: "#1f3a2e", description: "A demonstration stationery item. Variant inventory is supplied by Medusa when connected.", specs: ["0.5mm", "Green ink", "Single"] },
  { id: "stationery-pencils", handle: "artists-graphite-set", kind: "stationery", title: "Artist's Graphite Set", authorOrBrand: "Demo Atelier", pricePkr: 960, category: "Art Supplies", accent: "#9a5b13", description: "A compact demo set for sketching and study.", specs: ["12 pencils", "Mixed grades", "Gift-ready"] },
];

export function getProduct(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function formatPkr(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
}
