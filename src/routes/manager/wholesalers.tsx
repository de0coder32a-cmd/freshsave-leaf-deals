import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/app-shell";
import { Panel } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WHOLESALERS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/manager/wholesalers")({
  validateSearch: (s: { code?: unknown }): { code?: string } => (typeof s.code === "string" ? { code: s.code } : {}),
  head: () => seo("Wholesalers", "Send restock requests to wholesale suppliers."),
  component: Wholesalers,
});

function Wholesalers() {
  const { code } = Route.useSearch();
  const { products, restocks, requestRestock, advanceRestock } = useStore();
  const pre = products.find((p) => p.code === code);
  const [ws, setWs] = useState(pre ? WHOLESALERS.find((w) => w.supplies.includes(pre.category))?.id ?? "" : "");
  const [qtys, setQtys] = useState<Record<string, number>>(pre ? { [pre.code]: 50 } : {});
  const sel = WHOLESALERS.find((w) => w.id === ws);
  const items = products.filter((p) => sel?.supplies.includes(p.category));

  const send = () => {
    const list = Object.entries(qtys).filter(([c, q]) => q > 0 && items.some((i) => i.code === c)).map(([c, q]) => ({ code: c, qty: q }));
    if (!sel || !list.length) { toast.error("Pick a wholesaler and at least one product quantity"); return; }
    requestRestock(sel.id, list);
    setQtys({});
    toast.success(`Restock request sent to ${sel.name}`);
  };

  return (
    <>
      <PageTitle title="Wholesalers" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {WHOLESALERS.map((w) => (
          <button key={w.id} onClick={() => setWs(w.id)} className={`rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-soft ${ws === w.id ? "border-primary ring-2 ring-primary/30" : ""}`}>
            <p className="font-semibold">{w.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{w.supplies.join(", ")}</p>
            <p className="mt-2 flex items-center gap-1 text-xs"><Phone className="h-3 w-3" />{w.contact}</p>
          </button>
        ))}
      </div>
      {sel && (
        <Panel title={`Order from ${sel.name}`} className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((p) => (
              <div key={p.code} className="flex items-center gap-3 rounded-xl border p-2">
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">Stock {p.stock}</p></div>
                <Input type="number" min={0} className="w-20" value={qtys[p.code] ?? ""} placeholder="0" onChange={(e) => setQtys({ ...qtys, [p.code]: Number(e.target.value) })} />
              </div>
            ))}
          </div>
          <Button className="mt-4" onClick={send}>Send restock request</Button>
        </Panel>
      )}
      <Panel title="Request status" className="mt-4">
        {restocks.length === 0 ? <p className="py-6 text-center text-muted-foreground">No restock requests yet</p> : (
          <ul className="space-y-2">
            {restocks.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border p-3">
                <div className="flex-1"><p className="text-sm font-semibold">{WHOLESALERS.find((w) => w.id === r.wholesalerId)?.name}</p>
                  <p className="text-xs text-muted-foreground">{r.items.map((i) => `${products.find((p) => p.code === i.code)?.name} × ${i.qty}`).join(", ")}</p></div>
                <Badge variant={r.status === "Delivered" ? "default" : "secondary"}>{r.status}</Badge>
                {r.status !== "Delivered" && <Button size="sm" variant="outline" onClick={() => { advanceRestock(r.id); toast.success("Status updated"); }}>{r.status === "Sent" ? "Mark confirmed" : "Mark delivered"}</Button>}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
