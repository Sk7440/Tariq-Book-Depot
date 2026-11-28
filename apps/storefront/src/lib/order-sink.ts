import { STORE } from "@/config/store";
import { buildOrderMessage, buildWhatsAppUrl, type Order } from "@/lib/order";

/** Where a placed order goes. Today: WhatsApp. Another channel can implement the same interface. */
export interface OrderSink {
  /** False when the channel isn't configured; checkout disables the button and says why. */
  readonly isAvailable: boolean;
  /** Builds the hand-off URL for an order (null when unavailable). */
  urlFor(order: Order): string | null;
  /** Hands the order off (opens WhatsApp in a new tab). Returns the URL used, or null. */
  send(order: Order): string | null;
}

/**
 * The shop's WhatsApp number. STORE.whatsapp is null until the owner provides it.
 * NEXT_PUBLIC_E2E_WHATSAPP exists only for the Playwright build (see README); production never sets it.
 */
export function orderWhatsAppNumber(): string | null {
  return STORE.whatsapp ?? (process.env.NEXT_PUBLIC_E2E_WHATSAPP || null);
}

export function createWhatsAppSink(number: string | null): OrderSink {
  const urlFor = (order: Order): string | null => (number ? buildWhatsAppUrl(number, buildOrderMessage(order)) : null);
  return {
    isAvailable: number !== null,
    urlFor,
    send(order) {
      const url = urlFor(order);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return url;
    },
  };
}
