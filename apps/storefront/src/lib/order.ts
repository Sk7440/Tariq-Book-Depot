/**
 * Order model, validation and the WhatsApp message (pure; unit-tested in order.test.ts).
 * Prices come from products.json via the cart; nothing here invents values.
 */

export type DeliveryId = "local" | "courier";

export interface OrderLine {
  id: string;
  name: string;
  pack: string | null;
  qty: number;
  /** Rupees per unit. */
  rate: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export interface Order {
  ref: string;
  /** ISO date-time. */
  date: string;
  delivery: DeliveryId;
  /** Null while the delivery rate is not set (OPEN_QUESTIONS.md). */
  deliveryPrice: number | null;
  subtotal: number;
  /** Subtotal plus delivery when its price is known. */
  total: number;
  customer: Customer;
  lines: OrderLine[];
}

export type FieldName = "name" | "phone" | "address" | "city";
export type FieldError = "eName" | "ePhone" | "eAddress" | "eCity";

/** Pakistani mobile: 03XX-XXXXXXX, also +92 / 0092 prefixes (the HTML's VALIDATE.phone). */
const PHONE = /^(\+92|0092|0)3\d{2}[-\s]?\d{7}$/;

const RULES: Record<FieldName, { test: (v: string) => boolean; error: FieldError }> = {
  name: { test: (v) => v.trim().length >= 2, error: "eName" },
  phone: { test: (v) => PHONE.test(v.replace(/\s+/g, "")), error: "ePhone" },
  address: { test: (v) => v.trim().length >= 6, error: "eAddress" },
  city: { test: (v) => v.trim().length >= 2, error: "eCity" },
};

export const REQUIRED_FIELDS: readonly FieldName[] = ["name", "phone", "address", "city"];

export function validateField(field: FieldName, value: string): FieldError | null {
  const rule = RULES[field];
  return rule.test(value) ? null : rule.error;
}

export function validateCustomer(c: Customer): Partial<Record<FieldName, FieldError>> {
  const errors: Partial<Record<FieldName, FieldError>> = {};
  REQUIRED_FIELDS.forEach((f) => {
    const e = validateField(f, c[f]);
    if (e) errors[f] = e;
  });
  return errors;
}

/** TB-YYMMDD-NNNN (the HTML's order reference). */
export function makeOrderRef(now: Date, random: number): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const n = 1000 + Math.floor(Math.min(Math.max(random, 0), 0.9999) * 9000);
  return `TB-${yy}${mm}${dd}-${n}`;
}

export function orderTotals(lines: readonly OrderLine[], deliveryPrice: number | null): { subtotal: number; total: number } {
  const subtotal = lines.reduce((s, l) => s + l.rate * l.qty, 0);
  return { subtotal, total: subtotal + (deliveryPrice ?? 0) };
}

const rs = (n: number): string => `Rs ${n.toLocaleString("en-PK")}`;
const DELIVERY_LABEL: Record<DeliveryId, string> = { local: "Local delivery (within Pattoki)", courier: "Courier (other cities)" };

/** Plain-text order for the shop, in English so the shop always reads the same format. */
export function buildOrderMessage(order: Order): string {
  const c = order.customer;
  const items = order.lines.map((l, i) => {
    const pack = l.pack ? ` (${l.pack})` : "";
    return `${i + 1}. ${l.name}${pack} x ${l.qty} @ ${rs(l.rate)} = ${rs(l.rate * l.qty)}`;
  });
  const delivery = order.deliveryPrice === null ? "rate to be confirmed by the shop" : rs(order.deliveryPrice);
  const total = order.deliveryPrice === null ? `${rs(order.total)} + delivery` : rs(order.total);
  return [
    `New order ${order.ref}`,
    `Date: ${order.date.slice(0, 10)}`,
    "",
    "Items:",
    ...items,
    "",
    `Subtotal: ${rs(order.subtotal)}`,
    `Delivery (${DELIVERY_LABEL[order.delivery]}): ${delivery}`,
    `Total: ${total}`,
    "Payment: Cash on delivery",
    "",
    "Customer:",
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    `Address: ${c.address}, ${c.city}`,
    ...(c.notes ? [`Notes: ${c.notes}`] : []),
  ].join("\n");
}

/** https://wa.me/<digits>?text=<message>. Throws on a malformed number. */
export function buildWhatsAppUrl(number: string, message: string): string {
  if (!/^\d{10,15}$/.test(number)) throw new Error(`WhatsApp number must be 10–15 digits in international format, got "${number}"`);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
