import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedProducts, type Product } from "./mock-data";
import { daysLeft, discountedPrice, getDiscount, pointsFor } from "./pricing";

export type Role = "customer" | "staff" | "manager";
export interface Session { role: Role; name: string; mobile?: string }
export interface Feedback { id: string; name: string; rating: number; message: string; date: string }
export interface Donation { id: string; ngoId: string; code: string; qty: number; status: "Pending" | "Accepted" | "Donated"; date: string }
export interface Restock { id: string; wholesalerId: string; items: { code: string; qty: number }[]; status: "Sent" | "Confirmed" | "Delivered"; date: string }
export interface PointsEntry { id: string; date: string; amount: number; points: number }
export interface CartItem { code: string; qty: number }

interface State {
  session: Session | null;
  products: Product[];
  feedback: Feedback[];
  donations: Donation[];
  restocks: Restock[];
  points: PointsEntry[];
  cart: CartItem[];
}

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

const initial = (): State => ({
  session: null,
  products: seedProducts(),
  feedback: [
    { id: "f1", name: "Priya S.", rating: 5, message: "Love the last-chance deals on bread!", date: "2026-10-18" },
    { id: "f2", name: "Rahul M.", rating: 4, message: "Great prices, wish there were more frozen items.", date: "2026-10-20" },
  ],
  donations: [],
  restocks: [],
  points: [
    { id: "p1", date: "2026-09-12", amount: 840, points: 84 },
    { id: "p2", date: "2026-10-02", amount: 1260, points: 126 },
  ],
  cart: [],
});

export function priced(p: Product) {
  const days = daysLeft(p.expiry);
  const d = getDiscount(days, p.stock);
  return { ...p, days, discount: d.percent, label: d.label, finalPrice: discountedPrice(p.price, d.percent) };
}
export type PricedProduct = ReturnType<typeof priced>;

function useStoreValue() {
  const [s, set] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("freshsave");
      if (saved) set({ ...initial(), ...JSON.parse(saved), products: initial().products.map((p) => {
        const old = (JSON.parse(saved).products as Product[] | undefined)?.find((o) => o.code === p.code);
        return old ? { ...p, stock: old.stock } : p;
      }) });
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("freshsave", JSON.stringify(s)); }, [s, hydrated]);

  const products = useMemo(() => s.products.map(priced), [s.products]);

  return {
    ...s, hydrated, products,
    login: (session: Session) => set((x) => ({ ...x, session })),
    logout: () => set((x) => ({ ...x, session: null, cart: [] })),
    addToCart: (code: string) => set((x) => {
      const ex = x.cart.find((c) => c.code === code);
      return { ...x, cart: ex ? x.cart.map((c) => (c.code === code ? { ...c, qty: c.qty + 1 } : c)) : [...x.cart, { code, qty: 1 }] };
    }),
    removeFromCart: (code: string) => set((x) => ({ ...x, cart: x.cart.filter((c) => c.code !== code) })),
    checkout: () => {
      let earned = 0;
      set((x) => {
        const amount = x.cart.reduce((t, c) => {
          const p = products.find((pp) => pp.code === c.code);
          return t + (p ? p.finalPrice * c.qty : 0);
        }, 0);
        earned = pointsFor(amount);
        return {
          ...x,
          products: x.products.map((p) => {
            const c = x.cart.find((cc) => cc.code === p.code);
            return c ? { ...p, stock: Math.max(0, p.stock - c.qty) } : p;
          }),
          points: [{ id: uid(), date: today(), amount, points: earned }, ...x.points],
          cart: [],
        };
      });
      return earned;
    },
    addFeedback: (f: Omit<Feedback, "id" | "date">) => set((x) => ({ ...x, feedback: [{ ...f, id: uid(), date: today() }, ...x.feedback] })),
    requestDonation: (ngoId: string, code: string, qty: number) =>
      set((x) => ({ ...x, donations: [{ id: uid(), ngoId, code, qty, status: "Pending", date: today() }, ...x.donations] })),
    advanceDonation: (id: string) => set((x) => ({
      ...x,
      donations: x.donations.map((d) => (d.id === id ? { ...d, status: d.status === "Pending" ? "Accepted" : "Donated" } : d)),
      products: x.products.map((p) => {
        const d = x.donations.find((dd) => dd.id === id);
        return d && d.status === "Accepted" && d.code === p.code ? { ...p, stock: Math.max(0, p.stock - d.qty) } : p;
      }),
    })),
    requestRestock: (wholesalerId: string, items: { code: string; qty: number }[]) =>
      set((x) => ({ ...x, restocks: [{ id: uid(), wholesalerId, items, status: "Sent", date: today() }, ...x.restocks] })),
    advanceRestock: (id: string) => set((x) => {
      const r = x.restocks.find((rr) => rr.id === id);
      const next = r?.status === "Sent" ? "Confirmed" : "Delivered";
      return {
        ...x,
        restocks: x.restocks.map((rr) => (rr.id === id ? { ...rr, status: next } : rr)),
        products: next === "Delivered" && r?.status === "Confirmed"
          ? x.products.map((p) => { const it = r.items.find((i) => i.code === p.code); return it ? { ...p, stock: p.stock + it.qty } : p; })
          : x.products,
      };
    }),
  };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const v = useStoreValue();
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}
