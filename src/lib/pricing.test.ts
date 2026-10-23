import { describe, expect, it } from "vitest";
import { getDiscount, isDonationEligible, pointsFor, taxReduction } from "./pricing";

describe("discount rules", () => {
  it("65% at 1 day or less", () => expect(getDiscount(1, 10).percent).toBe(65));
  it("60% at 2 days", () => expect(getDiscount(2, 100).percent).toBe(60));
  it("35% bulk for 41-59 units within 3-4 days", () => expect(getDiscount(4, 50).percent).toBe(35));
  it("40% bulk for 60+ units", () => expect(getDiscount(3, 60).percent).toBe(40));
  it("no bulk deal at 40 units", () => expect(getDiscount(3, 40).label).not.toBe("Bulk Deal"));
});

describe("donation and tax", () => {
  it("eligible at 1 day left with stock", () => expect(isDonationEligible(1, 5)).toBe(true));
  it("not eligible at 2 days", () => expect(isDonationEligible(2, 5)).toBe(false));
  it("20% reduction once 25% donated", () => expect(taxReduction(25, 100, 1000).amount).toBe(200));
  it("no reduction below 25%", () => expect(taxReduction(24, 100, 1000).amount).toBe(0));
  it("1 point per Rs.10", () => expect(pointsFor(259)).toBe(25));
});
