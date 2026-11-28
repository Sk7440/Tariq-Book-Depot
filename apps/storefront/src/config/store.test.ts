import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STORE } from "./store";

/** Guards the owner-edited settings: a malformed value here breaks checkout at runtime. */
describe("store settings", () => {
  it("WhatsApp number is digits only, international format (wa.me requirement)", () => {
    if (STORE.whatsapp === null) return;
    assert.match(STORE.whatsapp, /^\d{10,15}$/, `got "${STORE.whatsapp}" — remove "+", spaces and dashes`);
  });

  it("delivery prices are whole rupees or null", () => {
    for (const d of STORE.delivery) {
      if (d.price === null) continue;
      assert.ok(Number.isInteger(d.price) && d.price >= 0, `${d.id}: ${d.price}`);
    }
  });

  it("phone, when set, contains 10–15 digits", () => {
    if (STORE.phone === null) return;
    const digits = STORE.phone.replace(/\D/g, "");
    assert.ok(digits.length >= 10 && digits.length <= 15, STORE.phone);
  });
});
