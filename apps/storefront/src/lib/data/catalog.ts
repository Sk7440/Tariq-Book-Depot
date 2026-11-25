import type {
  ProductCategory,
  ProductImage,
  ProductSpecification,
  StoreProduct,
} from "@tariq-book-depot/shared-types";

export const categories: ProductCategory[] = [
  { handle: "paper", name: "Paper", kind: "stationery" },
  { handle: "erasers", name: "Erasers", kind: "stationery" },
  { handle: "pencils", name: "Pencils", kind: "stationery" },
  { handle: "scales", name: "Scales", kind: "stationery" },
  { handle: "sharpners", name: "Sharpeners", kind: "stationery" },
];

function gallery(
  categoryHandle: string,
  productHandle: string,
  title: string,
  count: number,
): ProductImage[] {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      url: `/products/${categoryHandle}/${productHandle}/${number}-product-image.jpeg`,
      alt: `${title}, product photograph ${index + 1}`,
    };
  });
}

function spec(name: string, value: string): ProductSpecification {
  return { name, value };
}

export const products: StoreProduct[] = [
  {
    id: "paper-blc-rim",
    handle: "blc-paper-rim-70-gsm",
    kind: "stationery",
    title: "BLC Paper Rim – 70 GSM | 500 Sheets",
    authorOrBrand: "BLC",
    pricePkr: 1000,
    category: "Paper",
    categoryHandle: "paper",
    description:
      "BLC Paper Rim – 70 GSM | 500 Sheets\n\nHigh-quality BLC Paper Rim containing 500 sheets of 70 GSM paper. Ideal for printing, photocopying, office documentation, school assignments, university work and everyday writing.\n\nSuitable for offices, schools, colleges and businesses.",
    specs: [
      spec("Paper weight", "70 GSM"),
      spec("Quantity", "500 sheets"),
    ],
    stationery: {
      brand: "BLC",
      productType: "Paper rim",
      paperWeightGsm: 70,
      packQuantity: "500 sheets",
    },
    images: gallery("paper", "blc-paper-rim", "BLC Paper Rim", 2),
  },
  {
    id: "paper-copy-mate-a4",
    handle: "copy-mate-a4-paper-70-gsm",
    kind: "stationery",
    title: "Copy Mate A4 Paper – 70 GSM (500 Sheets)",
    authorOrBrand: "Copy Mate",
    pricePkr: 850,
    category: "Paper",
    categoryHandle: "paper",
    description:
      "Copy Mate A4 Paper – 70 GSM (500 Sheets)\n\nGet quality and reliability with Copy Mate A4 Paper. Ideal for everyday printing, photocopying, office documentation and educational use.\n\nProduct Specifications:\n* Brand: Copy Mate\n* Paper Size: A4\n* Paper Weight: 70 GSM\n* Quantity: 500 Sheets (1 Ream)\n* Suitable For: Printing, Photocopying, Office & School Use",
    specs: [
      spec("Paper size", "A4"),
      spec("Paper weight", "70 GSM"),
      spec("Quantity", "500 sheets (1 ream)"),
    ],
    stationery: {
      brand: "Copy Mate",
      productType: "Paper ream",
      paperWeightGsm: 70,
      paperSize: "A4",
      packQuantity: "500 sheets (1 ream)",
    },
    images: gallery("paper", "copy-mate-a4-paper", "Copy Mate A4 Paper", 4),
  },
  {
    id: "eraser-oro-offyso",
    handle: "oro-offyso-eraser-48-pack",
    kind: "stationery",
    title: "Oro Offyso Eraser – 48 Pieces Pack",
    authorOrBrand: "Oro",
    pricePkr: 480,
    category: "Erasers",
    categoryHandle: "erasers",
    description:
      "Oro Offyso Eraser – 48 Pieces Pack\n\nHigh-quality Oro Offyso Erasers, specially designed for clean and smooth erasing. They remove pencil marks easily without damaging or tearing paper.\n\nFeatures:\n* Brand: Oro\n* Product: Offyso Eraser\n* Pack Size: 48 Pieces\n* Smooth and clean erasing\n* Gentle on paper\n* Ideal for students, schools, offices and everyday use.\n* Perfect for school stationery supplies.",
    specs: [
      spec("Pack size", "48 pieces"),
      spec("Pack type", "Pack"),
    ],
    stationery: {
      brand: "Oro",
      productType: "Offyso eraser",
      packQuantity: "48 pieces",
    },
    images: gallery("erasers", "oro-offyso-eraser", "Oro Offyso Eraser", 3),
  },
  {
    id: "eraser-oro-veezo",
    handle: "oro-veezo-eraser-72-jar",
    kind: "stationery",
    title: "Oro Veezo Eraser – 72 Pieces Jar",
    authorOrBrand: "Oro",
    pricePkr: 450,
    category: "Erasers",
    categoryHandle: "erasers",
    description:
      "Oro Veezo Eraser – 72 Pieces Jar\n\nOro Veezo Erasers are designed for smooth and clean erasing. They easily remove pencil marks while keeping paper neat and clean. Packed in a convenient jar containing 72 pieces, making them ideal for stationery shops, schools and everyday use.\n\nFeatures:\n* Brand: Oro\n* Product: Veezo Eraser\n* Pack Size: 72 Pieces\n* Packaging: Convenient Jar\n* Smooth and clean erasing\n* Easy to use\n* Suitable for students, schools and offices.\n* Ideal for everyday stationery needs.",
    specs: [
      spec("Pack size", "72 pieces"),
      spec("Packaging", "Jar"),
    ],
    stationery: {
      brand: "Oro",
      productType: "Veezo eraser",
      packQuantity: "72 pieces",
    },
    images: gallery("erasers", "oro-veezo-eraser", "Oro Veezo Eraser", 3),
  },
  {
    id: "pencil-oro-trimetal",
    handle: "oro-trimetal-hb-lead-pencil",
    kind: "stationery",
    title: "ORO Trimetal Lead Pencil – 12 Pcs Box",
    authorOrBrand: "ORO",
    pricePkr: 250,
    category: "Pencils",
    categoryHandle: "pencils",
    description:
      "ORO Trimetal Lead Pencil – 12 Pcs Box\n\nEnjoy smooth and comfortable writing with ORO Trimetal HB Lead Pencils. Designed with an attractive metallic finish and ergonomic triangular shape for a comfortable grip. These pencils feature break-resistant lead technology for enhanced durability and consistent writing performance.\n\nKey Features:\n* Brand: ORO\n* Product Type: HB Lead Pencil\n* Quantity: 12 Pencils per Box\n* Metallic Finish\n* Comfortable Ergonomic Grip\n* Break-Resistant Lead\n* Matching Eraser on Each Pencil\n* Smooth Writing Experience\n* Suitable for School, Office, Drawing and Everyday Use\n* Non-Toxic and Environment Friendly\n\nIdeal For: Students, teachers and everyday writing needs.",
    specs: [
      spec("Type", "HB lead pencil"),
      spec("Quantity", "12 pencils per box"),
      spec("Finish", "Metallic"),
    ],
    stationery: {
      brand: "ORO",
      productType: "HB lead pencil",
      packQuantity: "12 pencils per box",
    },
    images: gallery("pencils", "oro-trimetal-lead-pencil", "ORO Trimetal Pencil", 3),
  },
  {
    id: "pencil-piano-lead",
    handle: "piano-lead-pencils-12-box",
    kind: "stationery",
    title: "Piano Lead Pencils – 12 Pcs Box",
    authorOrBrand: "Piano",
    pricePkr: 250,
    category: "Pencils",
    categoryHandle: "pencils",
    description:
      "Piano Lead Pencils – 12 Pcs Box\n\nPiano Lead Pencils are ideal for everyday writing, drawing and schoolwork. Designed for smooth and comfortable writing, they are suitable for students, teachers and office use.\n\nProduct Features:\n* Brand: Piano\n* Type: Lead Pencils\n* Quantity: 12 Pencils per Box\n* Smooth writing performance\n* Ideal for writing, drawing and sketching\n* Suitable for school, home and office use\n\nA reliable choice for everyday writing needs!",
    specs: [
      spec("Type", "Lead pencil"),
      spec("Quantity", "12 pencils per box"),
    ],
    stationery: {
      brand: "Piano",
      productType: "Lead pencil",
      packQuantity: "12 pencils per box",
    },
    images: gallery("pencils", "piano-lead-pencil", "Piano Lead Pencils", 4),
  },
  {
    id: "scale-dux-12-inch",
    handle: "dux-12-inch-scale",
    kind: "stationery",
    title: "Dux 12-Inch Scale",
    authorOrBrand: "Dux",
    pricePkr: 80,
    category: "Scales",
    categoryHandle: "scales",
    description:
      "Dux 12-Inch Scale is a high-quality and durable measuring ruler, perfect for school, college, office, and everyday stationery use.\n\nFeatures:\n* 12-inch measuring length.\n* Clear and easy-to-read measurement markings.\n* Durable and lightweight design.\n* Suitable for drawing straight lines and measuring.\n* Easy to carry and handle.\n* Ideal for students, teachers, and office professionals.",
    specs: [
      spec("Length", "12 inches"),
    ],
    stationery: {
      brand: "Dux",
      productType: "Scale",
      dimensions: "12 inches",
    },
    images: gallery("scales", "dux-12-inch-scale", "Dux 12-Inch Scale", 2),
  },
  {
    id: "scale-oro-8-inch",
    handle: "oro-8-inch-scale",
    kind: "stationery",
    title: "Oro 8-Inch Scale",
    authorOrBrand: "Oro",
    pricePkr: 50,
    category: "Scales",
    categoryHandle: "scales",
    description:
      "Oro 8-Inch Scale is a durable and lightweight measuring ruler, ideal for everyday school, office, and stationery use.\n\nFeatures:\n* 8-inch measuring scale.\n* Clear and easy-to-read markings.\n* Lightweight and easy to carry.\n* Durable plastic construction.\n* Suitable for drawing straight lines and measuring.\n* Ideal for students, teachers, and office use.",
    specs: [
      spec("Length", "8 inches"),
      spec("Material", "Plastic"),
      spec("Price unit", "Per piece"),
    ],
    stationery: {
      brand: "Oro",
      productType: "Scale",
      dimensions: "8 inches",
      unit: "Per piece",
    },
    images: gallery("scales", "oro-8-inch-scale", "Oro 8-Inch Scale", 4),
  },
  {
    id: "sharpener-dux-colour",
    handle: "dux-colour-sharpener-50-box",
    kind: "stationery",
    title: "Dux Colour Sharpener – 50 Pieces Box",
    authorOrBrand: "Dux",
    pricePkr: 500,
    category: "Sharpeners",
    categoryHandle: "sharpners",
    description:
      "Dux Colour Sharpener – 50 Pieces Box\n\nDux Colour Sharpener is a useful and colourful stationery essential designed for smooth and easy pencil sharpening. Its practical design helps create a neat pencil point, making it ideal for everyday writing and drawing activities.\n\nKey Features:\n* Brand: Dux\n* Product: Colour Sharpener\n* Quantity: 50 Pieces per Box\n* Attractive assorted colours\n* Smooth and easy pencil sharpening\n* Compact and easy-to-use design\n* Suitable for school, college and office use\n* Ideal for students, teachers and stationery shops\n\nA practical and colourful addition to your everyday stationery collection.",
    specs: [
      spec("Quantity", "50 pieces per box"),
      spec("Colour", "Assorted"),
    ],
    stationery: {
      brand: "Dux",
      productType: "Colour sharpener",
      colorOrInk: "Assorted colours",
      packQuantity: "50 pieces per box",
    },
    images: gallery("sharpners", "dux-colour-sharpener", "Dux Colour Sharpener", 6),
  },
  {
    id: "sharpener-oro-reeko",
    handle: "oro-reeko-sharpener-50-jar",
    kind: "stationery",
    title: "Oro Reeko Sharpener – 50 Pieces Jar",
    authorOrBrand: "Oro",
    pricePkr: 500,
    category: "Sharpeners",
    categoryHandle: "sharpners",
    description:
      "Oro Reeko Sharpener – 50 Pieces Jar\n\nOro Reeko Sharpener comes in a convenient jar containing 50 high-quality sharpeners. Designed for smooth and precise pencil sharpening, it provides a clean and neat pencil point without damaging the lead.\n\nKey Features:\n* Brand: Oro\n* Model: Reeko Sharpener\n* Quantity: 50 Pieces per Jar\n* Smooth and efficient sharpening\n* Durable and easy-to-use design\n* Ideal for school, college, office and everyday stationery use\n* Convenient jar packaging for easy storage\n\nA perfect stationery essential for students, teachers and everyday use.",
    specs: [
      spec("Quantity", "50 pieces per jar"),
      spec("Packaging", "Jar"),
    ],
    stationery: {
      brand: "Oro",
      productType: "Reeko sharpener",
      packQuantity: "50 pieces per jar",
    },
    images: gallery("sharpners", "oro-reeko-sharpener", "Oro Reeko Sharpener", 5),
  },
];

export function getProduct(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function getCategory(handle: string) {
  return categories.find((category) => category.handle === handle);
}

export function getProductsInCategory(handle: string) {
  return products.filter((product) => product.categoryHandle === handle);
}

export function formatPkr(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}
