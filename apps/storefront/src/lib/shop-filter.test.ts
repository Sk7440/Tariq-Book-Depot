import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyFilters, DEFAULT_FILTERS, filtersFrom, filtersToQuery, matchesQuery } from "./shop-filter";

const P = [
  { id: "a", name: "Piano Pencils", brand: "Piano", category: "pencils", price: 250, offerPrice: null },
  { id: "b", name: "Oro Eraser", brand: "Oro", category: "erasers", price: 450, offerPrice: 400 },
  { id: "c", name: "Dux Scale", brand: null, category: "scales", price: 80, offerPrice: null },
];

describe("applyFilters", () => {
  it("keeps shop order by default", () => {
    assert.deepEqual(applyFilters(P, DEFAULT_FILTERS).map((p) => p.id), ["a", "b", "c"]);
  });

  it("sorts by the price customers pay (offer price first)", () => {
    assert.deepEqual(applyFilters(P, { ...DEFAULT_FILTERS, sort: "low" }).map((p) => p.id), ["c", "a", "b"]);
    assert.deepEqual(applyFilters(P, { ...DEFAULT_FILTERS, sort: "high" }).map((p) => p.id), ["b", "a", "c"]);
    assert.deepEqual(applyFilters(P, { ...DEFAULT_FILTERS, sort: "name" }).map((p) => p.id), ["c", "b", "a"]);
  });

  it("filters by category and brand", () => {
    assert.deepEqual(applyFilters(P, { ...DEFAULT_FILTERS, cat: "erasers" }).map((p) => p.id), ["b"]);
    assert.deepEqual(applyFilters(P, { ...DEFAULT_FILTERS, brand: "Piano" }).map((p) => p.id), ["a"]);
    assert.deepEqual(applyFilters(P, { ...DEFAULT_FILTERS, cat: "erasers", brand: "Piano" }), []);
  });
});

describe("URL filters", () => {
  it("ignores unknown sort values", () => {
    assert.deepEqual(filtersFrom(new URLSearchParams("cat=pens&sort=bogus")), { cat: "pens", brand: "", sort: "shop" });
  });

  it("drops defaults and keeps other params", () => {
    assert.equal(filtersToQuery("q=pen&sort=low", { cat: "pens", brand: "", sort: "shop" }), "q=pen&cat=pens");
  });
});

describe("matchesQuery", () => {
  it("needs every term and tolerates a plural s", () => {
    assert.equal(matchesQuery("oro veezo eraser jar", "erasers oro"), true);
    assert.equal(matchesQuery("oro veezo eraser jar", "eraser piano"), false);
    assert.equal(matchesQuery("anything", "   "), false);
  });
});
