import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nameFromTitle, parseProductTxt, toKebab, toTitleCase } from "./parse-product-txt";

function parse(raw: string, folder = "Folder Name") {
  const result = parseProductTxt(raw, folder);
  if (!result.ok) throw new Error(`expected ok, got: ${result.reason}`);
  return result.value;
}

describe("parseProductTxt", () => {
  it("reads title, description, specs, brand, features and price (CRLF)", () => {
    const raw = "Oro Veezo Eraser – 72 Pieces Jar\r\n\r\nSmooth erasing.\r\n\r\nFeatures:\r\n\r\n* Brand: Oro\r\n* Pack Size: 72 Pieces\r\n* Easy to use\r\nrs 450";
    const p = parse(raw);
    assert.equal(p.title, "Oro Veezo Eraser – 72 Pieces Jar");
    assert.equal(p.name, "Oro Veezo Eraser");
    assert.equal(p.brand, "Oro");
    assert.equal(p.price, 450);
    assert.equal(p.priceNote, null);
    assert.deepEqual(p.description, ["Smooth erasing."]);
    assert.deepEqual(p.specs, [{ label: "Pack Size", value: "72 Pieces" }]);
    assert.deepEqual(p.features, ["Easy to use"]);
    assert.deepEqual(p.notes, []);
  });

  it("keeps the text after the price as priceNote", () => {
    const p = parse("Oro 8-Inch Scale – Single\n* Light\nRs 50 per pcs");
    assert.equal(p.price, 50);
    assert.equal(p.priceNote, "per pcs");
  });

  it("falls back to the folder name when line 1 is a bullet or blank", () => {
    assert.equal(parse("* Smooth ink\nRS 120", "Oro GR-7 Gel Pen").title, "Oro GR-7 Gel Pen");
    assert.equal(parse("\n* Smooth ink\nRS 80", "Oro R-6 Gel Pen").title, "Oro R-6 Gel Pen");
  });

  it("uses the subject of a sentence line 1 and keeps the sentence as description", () => {
    const p = parse("Dux 12-Inch Scale is a durable ruler.\n\n* 12-inch length.\nRS 80", "dux");
    assert.equal(p.title, "Dux 12-Inch Scale");
    assert.deepEqual(p.description, ["Dux 12-Inch Scale is a durable ruler."]);
    assert.deepEqual(p.features, ["12-inch length."]);
  });

  it("takes the last price-like line and keeps later lines as description", () => {
    const p = parse("* Smooth\nRS 120 \nAvailable clrs blck blue green", "Oro GR-7 Gel Pen");
    assert.equal(p.price, 120);
    assert.deepEqual(p.description, ["Available clrs blck blue green"]);
    assert.ok(p.notes.some((n) => n.includes("after the price line")));
  });

  it("reports a missing price line instead of guessing", () => {
    const result = parseProductTxt("Some Product – Box\n* A feature", "x");
    assert.equal(result.ok, false);
  });

  it("strips a UTF-8 BOM and drops any bullet heading", () => {
    const p = parse("﻿Copy Mate A4 – 70 GSM\nProduct Specifications:\n\n* Paper Size: A4\nRS 850");
    assert.equal(p.title, "Copy Mate A4 – 70 GSM");
    assert.deepEqual(p.description, []);
    assert.deepEqual(p.specs, [{ label: "Paper Size", value: "A4" }]);
  });

  it("parses a comma-grouped price", () => {
    assert.equal(parse("Ream – Box\nRS 1,000").price, 1000);
  });
});

describe("helpers", () => {
  it("cuts the name at the first separator", () => {
    assert.equal(nameFromTitle("BLC Paper Rim – 70 GSM | 500 Sheets"), "BLC Paper Rim");
    assert.equal(nameFromTitle("Copy Mate | A4"), "Copy Mate");
    assert.equal(nameFromTitle("Oro TX-7 Gel Pen"), "Oro TX-7 Gel Pen");
  });

  it("makes kebab-case ids and title-case names", () => {
    assert.equal(toKebab("ORO Trimetal Lead Pencil"), "oro-trimetal-lead-pencil");
    assert.equal(toKebab("Oro TX-7 Gel Pen"), "oro-tx-7-gel-pen");
    assert.equal(toTitleCase("pens"), "Pens");
  });
});
