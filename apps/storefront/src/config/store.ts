/**
 * Store settings. Every unknown value stays null until the owner provides it
 * (see OPEN_QUESTIONS.md); the UI shows an honest "not added yet" state.
 */
export interface DeliveryOption {
  id: "local" | "courier";
  /** Rupees; null until the owner sets the rate. */
  price: number | null;
}

export interface StoreSettings {
  name: string;
  nameUr: string;
  /** From the shop logo ("PATTOKI"). */
  city: { en: string; ur: string };
  /** From the shop logo ("SINCE 1984"). */
  since: number;
  address: string | null;
  phone: string | null;
  /** International format, digits only, e.g. "923001234567". */
  whatsapp: string | null;
  email: string | null;
  hours: { en: string; ur: string } | null;
  delivery: readonly DeliveryOption[];
}

export const STORE: StoreSettings = {
  name: "Tariq Book Depot",
  nameUr: "طارق بک ڈپو",
  city: { en: "Pattoki", ur: "پتوکی" },
  since: 1984,
  address: "2VC2+3V8, Shahrah-e-Quaid-e-Azam Rd, Pattoki",
  phone: "+923244962323",
  whatsapp: "923244962323",
  email: "info@tariqbookdepot.com",
  hours: { en: "24/7", ur: "24/7" },
  delivery: [
    { id: "local", price: 150 },
    { id: "courier", price: 300 },
  ],
};
