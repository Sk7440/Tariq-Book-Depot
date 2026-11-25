export type CatalogKind = "book" | "stationery" | "bundle";

export interface ProductCategory {
  handle: string;
  name: string;
  kind: CatalogKind;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  pricePkr?: number;
  image?: ProductImage;
}

export interface BookMetadata {
  author?: string;
  publisher?: string;
  isbn13?: string;
  edition?: string;
  binding?: string;
  language?: string;
  pages?: number;
}

export interface StationeryMetadata {
  brand?: string;
  productType?: string;
  paperWeightGsm?: number;
  paperSize?: string;
  ruling?: string;
  nibSize?: string;
  colorOrInk?: string;
  packQuantity?: string;
  dimensions?: string;
  unit?: string;
}

export interface StoreProduct {
  id: string;
  handle: string;
  kind: CatalogKind;
  title: string;
  authorOrBrand?: string;
  pricePkr: number;
  description: string;
  category: string;
  categoryHandle: string;
  images: ProductImage[];
  specs: ProductSpecification[];
  book?: BookMetadata;
  stationery?: StationeryMetadata;
  variants?: ProductVariant[];
}
