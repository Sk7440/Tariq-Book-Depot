import * as z from "zod";
import type { Order } from "@/lib/order";

/** The last placed order, kept in sessionStorage for the confirmation page (no backend). */
const KEY = "tbd-last-order-v1";

const OrderSchema = z.strictObject({
  ref: z.string().regex(/^TB-\d{6}-\d{4}$/),
  date: z.string(),
  delivery: z.enum(["local", "courier"]),
  deliveryPrice: z.number().int().nonnegative().nullable(),
  subtotal: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  customer: z.strictObject({ name: z.string(), phone: z.string(), address: z.string(), city: z.string(), notes: z.string() }),
  lines: z.array(z.strictObject({ id: z.string(), name: z.string(), pack: z.string().nullable(), qty: z.number().int().positive(), rate: z.number().int().positive() })).min(1),
});

export function saveLastOrder(order: Order): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Blocked storage: the confirmation page will show "order not found", which is honest.
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = OrderSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
