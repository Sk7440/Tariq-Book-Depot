import type { Department } from "@/lib/catalog-schema";

/** Departments and their names, from the approved design (const DEPTS). */
export const DEPARTMENT_LIST: ReadonlyArray<{ id: Department; name: { en: string; ur: string } }> = [
  { id: "books", name: { en: "Books", ur: "کتابیں" } },
  { id: "stationery", name: { en: "Stationery", ur: "اسٹیشنری" } },
  { id: "paper", name: { en: "Paper products", ur: "کاغذی مصنوعات" } },
  { id: "office", name: { en: "Office supplies", ur: "دفتری سامان" } },
];
