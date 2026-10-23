// Core FreshSave business rules. Pure functions so they can move server-side later.

export const SETTINGS = {
  donationThreshold: 0.25, // donated share of monthly stock needed to unlock tax reduction
  taxReductionRate: 0.2, // reduction applied to the value of donated goods
  pointsPerRupees: 10, // 1 loyalty point per Rs.10 spent
  lowStock: 15,
};

const DAY = 86_400_000;

export function daysLeft(expiry: string | Date, now: Date = new Date()): number {
  const e = new Date(expiry);
  const a = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((a - b) / DAY);
}

export type DealLabel = "Last-Chance Deal" | "Bulk Deal" | "Fresh Saver" | null;

export function getDiscount(days: number, quantity: number): { percent: number; label: DealLabel } {
  if (days <= 1) return { percent: 65, label: "Last-Chance Deal" };
  if (days === 2) return { percent: 60, label: "Last-Chance Deal" };
  if (days <= 4 && quantity > 40) {
    return { percent: quantity >= 60 ? 40 : 35, label: "Bulk Deal" };
  }
  if (days <= 7) return { percent: 10, label: "Fresh Saver" };
  return { percent: 0, label: null };
}

export function discountedPrice(price: number, percent: number) {
  return Math.round(price * (1 - percent / 100));
}

export function isDonationEligible(days: number, stock: number) {
  return days <= 1 && stock > 0;
}

export function urgency(days: number): "safe" | "warn" | "danger" {
  if (days <= 2) return "danger";
  if (days <= 4) return "warn";
  return "safe";
}

export function taxReduction(donatedQty: number, totalStock: number, donatedValue: number) {
  const share = totalStock > 0 ? donatedQty / totalStock : 0;
  const unlocked = share >= SETTINGS.donationThreshold;
  return { share, unlocked, amount: unlocked ? Math.round(donatedValue * SETTINGS.taxReductionRate) : 0 };
}

export function pointsFor(amount: number) {
  return Math.floor(amount / SETTINGS.pointsPerRupees);
}
