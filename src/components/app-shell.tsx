import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore, type Role } from "@/lib/store";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-bold">
      <span className={`grid place-items-center rounded-xl bg-gradient-fresh text-primary-foreground shadow-soft ${size === "lg" ? "h-14 w-14" : "h-9 w-9"}`}>
        <Leaf className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
      </span>
      <span className={size === "lg" ? "text-4xl" : "text-xl"}>Fresh<span className="text-primary">Save</span></span>
    </span>
  );
}

export const MENUS: Record<Role, { to: string; label: string }[]> = {
  customer: [
    { to: "/customer/home", label: "Home" },
    { to: "/customer/restock", label: "Restock" },
    { to: "/customer/dashboard", label: "Dashboard" },
  ],
  staff: [
    { to: "/staff/scan", label: "Scan Barcode" },
    { to: "/staff/home", label: "Home (Stock Offers)" },
    { to: "/staff/restock", label: "Restock" },
    { to: "/staff/dashboard", label: "Dashboard" },
  ],
  manager: [
    { to: "/manager/offers", label: "Stock Offers" },
    { to: "/manager/restock", label: "Restock" },
    { to: "/manager/dashboard", label: "Sales Dashboard" },
    { to: "/manager/feedback", label: "Customer Feedback" },
    { to: "/manager/ngo", label: "NGO" },
    { to: "/manager/wholesalers", label: "Wholesalers" },
  ],
};

export function RoleLayout({ role }: { role: Role }) {
  const { session, hydrated, logout } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && session?.role !== role) navigate({ to: `/auth/${role}` as "/auth/customer" });
  }, [hydrated, session, role, navigate]);

  if (!hydrated || session?.role !== role) {
    return <div className="mx-auto max-w-6xl space-y-4 p-6"><Skeleton className="h-12 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-leaf">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">Hi, {session.name} · <span className="capitalize">{role}</span></span>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu"><Menu /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-72 flex-col">
                <SheetHeader><SheetTitle><Logo /></SheetTitle></SheetHeader>
                <nav className="mt-4 flex flex-1 flex-col gap-1 px-2">
                  {MENUS[role].map((m) => (
                    <Link key={m.to} to={m.to as "/"} onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-primary-soft"
                      activeProps={{ className: "bg-primary-soft text-primary" }}>
                      {m.label}
                    </Link>
                  ))}
                </nav>
                <Button variant="outline" className="m-4" onClick={() => { logout(); navigate({ to: "/" }); }}>
                  <LogOut /> Logout
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 animate-rise"><Outlet /></main>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
    </div>
  );
}
