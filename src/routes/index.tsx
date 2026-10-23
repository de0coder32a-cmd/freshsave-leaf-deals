import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBasket, ScanBarcode, BarChart3, ArrowRight } from "lucide-react";
import { Logo } from "@/components/app-shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Choose your role", "Save food, save money. Sign in as a customer, staff member or store manager."),
  component: Index,
});

const roles = [
  { to: "/auth/customer", icon: ShoppingBasket, title: "Customer", desc: "Shop fresh deals on near-expiry items & earn points" },
  { to: "/auth/staff", icon: ScanBarcode, title: "Staff", desc: "Scan products, check expiry and stock" },
  { to: "/auth/manager", icon: BarChart3, title: "Manager", desc: "Offers, NGO donations, wholesalers & tax savings" },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-leaf">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-14 text-center">
        <Logo size="lg" />
        <h1 className="mt-8 max-w-2xl text-4xl font-extrabold sm:text-5xl">Good food deserves a <span className="text-primary">second chance</span>.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Near-expiry products are discounted automatically — and what's left goes to NGOs instead of the bin.</p>

        <div className="mt-8 flex gap-3">
          {[["12,480", "meals saved"], ["3,920 kg", "waste reduced"], ["18", "NGO partners"]].map(([v, l]) => (
            <div key={l} className="rounded-2xl border bg-card px-4 py-3 shadow-soft">
              <p className="font-display text-xl font-bold text-primary sm:text-2xl">{v}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
          {roles.map((r, i) => (
            <Link key={r.to} to={r.to} style={{ animationDelay: `${i * 80}ms` }}
              className="group animate-rise rounded-3xl border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-gradient-fresh group-hover:text-primary-foreground">
                <r.icon className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-2xl font-bold">{r.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
