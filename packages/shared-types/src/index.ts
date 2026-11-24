export type CatalogKind = "book" | "stationery";

export type DemoProduct = {
  id: string;
  handle: string;
  kind: CatalogKind;
  title: string;
  authorOrBrand: string;
  pricePkr: number;
  description: string;
  category: string;
  accent: string;
  specs: string[];
};
