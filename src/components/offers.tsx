import { useState } from "react";
import { Search, ShoppingCart, HeartHandshake, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStore, type PricedProduct } from "@/lib/store";
import { CATEGORIES } from "@/lib/mock-data";
import { urgency } from "@/lib/pricing";
import { ProductImage } from "@/components/product-image";
import { recipeFor } from "@/lib/recipes";
import { ChefHat, Clock } from "lucide-react";

const urgencyClass = { safe: "bg-success text-success-foreground", warn: "bg-warning text-warning-foreground", danger: "bg-destructive text-destructive-foreground" };

export function DealCard({ p, action }: { p: PricedProduct; action?: React.ReactNode }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-40 overflow-hidden bg-primary-soft">
        <ProductImage code={p.code} name={p.name} className="h-full w-full transition-transform group-hover:scale-105" />
        {p.discount > 0 && <span className="absolute left-3 top-3 rounded-full bg-gradient-fresh px-2.5 py-1 text-xs font-bold text-primary-foreground">-{p.discount}%</span>}
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyClass[urgency(p.days)]}`}>
          {p.days <= 0 ? "Expires today" : `${p.days} day${p.days === 1 ? "" : "s"} left`}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {p.label && <Badge variant="secondary" className="w-fit">{p.label}</Badge>}
        <h3 className="font-semibold leading-tight">{p.name}</h3>
        <p className="text-xs text-muted-foreground">#{p.code} · Exp {p.expiry}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-xl font-bold text-primary">₹{p.finalPrice}</span>
            {p.discount > 0 && <span className="ml-2 text-sm text-muted-foreground line-through">₹{p.price}</span>}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { cart, products, removeFromCart, checkout } = useStore();
  const items = cart.map((c) => ({ ...c, p: products.find((p) => p.code === c.code)! })).filter((i) => i.p);
  const total = items.reduce((t, i) => t + i.p.finalPrice * i.qty, 0);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><ShoppingCart /> Cart ({cart.reduce((t, c) => t + c.qty, 0)})</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader><SheetTitle>Your cart</SheetTitle></SheetHeader>
        <div className="flex-1 space-y-3 overflow-auto px-4">
          {items.length === 0 && <p className="py-10 text-center text-muted-foreground">Your cart is empty 🌱</p>}
          {items.map((i) => (
            <div key={i.code} className="flex items-center gap-3 rounded-xl border p-3">
              <ProductImage code={i.p.code} name={i.p.name} className="h-12 w-12 rounded-lg" />
              <div className="flex-1"><p className="text-sm font-medium">{i.p.name}</p><p className="text-xs text-muted-foreground">{i.qty} × ₹{i.p.finalPrice}</p></div>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(i.code)} aria-label="Remove"><Trash2 /></Button>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t p-4">
          <div className="flex justify-between font-semibold"><span>Total</span><span>₹{total}</span></div>
          <p className="text-xs text-muted-foreground">You'll earn {Math.floor(total / 10)} loyalty points</p>
          <Button className="w-full" disabled={!items.length} onClick={() => toast.success(`Order placed! +${checkout()} points earned`)}>Checkout</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function RecipesSection() {
  const { products } = useStore();
  const soon = products.filter((p) => p.days >= 0 && p.days <= 2 && p.stock > 0);
  if (!soon.length) return null;
  return (
    <section className="rounded-2xl border bg-primary-soft/40 p-4">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold"><ChefHat className="h-5 w-5 text-primary" /> 15-minute recipes</h2>
      <p className="mb-4 text-sm text-muted-foreground">Quick ideas to use up items expiring in the next 2 days.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {soon.map((p) => {
          const r = recipeFor(p.code, p.category);
          return (
            <article key={p.code} className="overflow-hidden rounded-xl border bg-card">
              <div className="flex items-center gap-3 border-b p-3">
                <ProductImage code={p.code} name={p.name} className="h-14 w-14 rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold leading-tight">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">Uses {p.name} · {p.days <= 0 ? "expires today" : `${p.days}d left`}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold"><Clock className="h-3 w-3" />15 min</span>
              </div>
              <div className="space-y-2 p-3 text-sm">
                <p><span className="font-semibold">You need:</span> {r.ingredients.join(", ")}</p>
                <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function OffersView({ withCart, withExpiring, withRecipes }: { withCart?: boolean; withExpiring?: boolean; withRecipes?: boolean }) {
  const { products, addToCart } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const list = products
    .filter((p) => p.days >= 0 && (cat === "All" || p.category === cat) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.code.includes(q)))
    .sort((a, b) => b.discount - a.discount);
  const expiring = products.filter((p) => p.days <= 2 && p.stock > 0);

  return (
    <div className="space-y-6">
      {withExpiring && (
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <h2 className="mb-3 text-lg font-bold">⏰ Expiring soon (≤ 2 days)</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {expiring.map((p) => (
              <div key={p.code} className="flex min-w-60 items-center gap-3 rounded-xl border bg-card p-3">
                <ProductImage code={p.code} name={p.name} className="h-12 w-12 rounded-lg" />
                <div className="flex-1"><p className="text-sm font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.days}d left · {p.stock} units</p></div>
                <Button size="sm" variant="outline" asChild><Link to="/manager/ngo" search={{ code: p.code }}><HeartHandshake /> NGO</Link></Button>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search deals by name or code" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {withCart && <Cart />}
      </div>
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => (
          <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} className="rounded-full" onClick={() => setCat(c)}>{c}</Button>
        ))}
      </div>
      {withRecipes && <RecipesSection />}
      {list.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No deals match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <DealCard key={p.code} p={p} action={withCart ? (
              <Button size="sm" disabled={!p.stock} onClick={() => { addToCart(p.code); toast.success(`${p.name} added to cart`); }}>Add</Button>
            ) : <span className="text-xs text-muted-foreground">{p.stock} in stock</span>} />
          ))}
        </div>
      )}
    </div>
  );
}
