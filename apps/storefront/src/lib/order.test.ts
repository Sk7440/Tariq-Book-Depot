import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildOrderMessage, buildWhatsAppUrl, makeOrderRef, orderTotals, validateCustomer, validateField, type Order } from "./order";

const ORDER: Order = {
  ref: "TB-261128-4821",
  date: "2026-11-28T10:00:00.000Z",
  delivery: "local",
  deliveryPrice: null,
  subtotal: 950,
  total: 950,
  customer: { name: "Ali Raza", phone: "0300-1234567", address: "House 1, Street 2, Model Town", city: "Pattoki", notes: "Call before" },
  lines: [
    { id: "oro-veezo-eraser", name: "Oro Veezo Eraser", pack: "72 Pieces Jar", qty: 1, rate: 450 },
    { id: "piano-lead-pencils", name: "Piano Lead Pencils", pack: "12 Pcs Box", qty: 2, rate: 250 },
  ],
};

describe("validateField", () => {
  it("accepts 03XX-XXXXXXX and +92 / 0092 forms", () => {
    for (const ok of ["0300-1234567", "03001234567", "0300 1234567", "+923001234567", "00923001234567"]) {
      assert.equal(validateField("phone", ok), null, ok);
    }
  });

  it("rejects landlines and short numbers", () => {
    for (const bad of ["042-1234567", "0300-12345", "1234", ""]) assert.equal(validateField("phone", bad), "ePhone", bad);
  });

  it("requires a name, address and city", () => {
    const errors = validateCustomer({ name: "A", phone: "0300-1234567", address: "x", city: "", notes: "" });
    assert.deepEqual(errors, { name: "eName", address: "eAddress", city: "eCity" });
  });
});

describe("makeOrderRef", () => {
  it("formats TB-YYMMDD-NNNN with a 4-digit suffix", () => {
    const d = new Date(2026, 10, 28);
    assert.equal(makeOrderRef(d, 0), "TB-261128-1000");
    assert.equal(makeOrderRef(d, 0.99999), "TB-261128-9999");
  });
});

describe("orderTotals", () => {
  it("adds delivery only when its price is known", () => {
    assert.deepEqual(orderTotals(ORDER.lines, null), { subtotal: 950, total: 950 });
    assert.deepEqual(orderTotals(ORDER.lines, 150), { subtotal: 950, total: 1100 });
  });
});

describe("buildOrderMessage", () => {
  it("lists every line, quantity, total and customer detail", () => {
    const msg = buildOrderMessage(ORDER);
    assert.match(msg, /New order TB-261128-4821/);
    assert.match(msg, /1\. Oro Veezo Eraser \(72 Pieces Jar\) x 1 @ Rs 450 = Rs 450/);
    assert.match(msg, /2\. Piano Lead Pencils \(12 Pcs Box\) x 2 @ Rs 250 = Rs 500/);
    assert.match(msg, /Total: Rs 950 \+ delivery/);
    assert.match(msg, /Delivery \(Local delivery \(within Pattoki\)\): rate to be confirmed by the shop/);
    for (const part of ["Name: Ali Raza", "Phone: 0300-1234567", "Address: House 1, Street 2, Model Town, Pattoki", "Notes: Call before", "Payment: Cash on delivery"]) {
      assert.ok(msg.includes(part), part);
    }
  });

  it("omits Notes when empty and shows a known delivery price", () => {
    const msg = buildOrderMessage({ ...ORDER, deliveryPrice: 150, total: 1100, customer: { ...ORDER.customer, notes: "" } });
    assert.ok(!msg.includes("Notes:"));
    assert.match(msg, /Total: Rs 1,100$/m);
  });
});

describe("buildWhatsAppUrl", () => {
  it("encodes the message into a wa.me link", () => {
    const url = buildWhatsAppUrl("923001234567", "Hi & bye\nline 2");
    assert.equal(url, "https://wa.me/923001234567?text=Hi%20%26%20bye%0Aline%202");
  });

  it("rejects numbers that are not international digits", () => {
    assert.throws(() => buildWhatsAppUrl("0300-1234567", "x"));
    assert.throws(() => buildWhatsAppUrl("+923001234567", "x"));
  });
});
