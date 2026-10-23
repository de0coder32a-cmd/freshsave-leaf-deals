import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/app-shell";
import { Panel } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NGOS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/manager/ngo")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => ({ code: typeof s.code === "string" ? s.code : undefined }),
  head: () => seo("NGO donations", "Send expiring products to partner NGOs before they go to waste."),
  component: Ngo,
});

function Ngo() {
  const { code: initial } = Route.useSearch();
  const { products, donations, requestDonation, advanceDonation } = useStore();
  const eligible = products.filter((p) => p.days <= 2 && p.days >= 0 && p.stock > 0);
  const [code, setCode] = useState(initial ?? "");
  const [ngo, setNgo] = useState("");
  const [qty, setQty] = useState(1);
  const prod = products.find((p) => p.code === code);

  const send = () => {
    if (!prod || !ngo) return toast.error("Choose a product and an NGO");
    if (qty < 1 || qty > prod.stock) return toast.error(`Quantity must be 1–${prod.stock}`);
    requestDonation(ngo, code, qty);
    toast.success("Donation request sent");
  };

  return (
    <>
      <PageTitle title="NGO donations" sub="Products with 1 day or less left are eligible for donation." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Partner NGOs">
          <ul className="space-y-3">
            {NGOS.map((n) => (
              <li key={n.id} className="rounded-xl border p-3">
                <div className="flex justify-between"><p className="font-semibold">{n.name}</p><Badge variant="secondary">{n.distanceKm} km</Badge></div>
                <p className="mt-1 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{n.location}</span><span className="flex items-center gap-1"><Phone className="h-3 w-3" />{n.contact}</span></p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="New donation request">
          <div className="space-y-4">
            <div className="space-y-2"><Label>Expiring product</Label>
              <Select value={code} onValueChange={setCode}><SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{eligible.map((p) => <SelectItem key={p.code} value={p.code}>{p.emoji} {p.name} · {p.days}d · {p.stock} units</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>NGO</Label>
              <Select value={ngo} onValueChange={setNgo}><SelectTrigger><SelectValue placeholder="Select NGO" /></SelectTrigger>
                <SelectContent>{NGOS.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Quantity</Label><Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} /></div>
            <Button className="w-full" onClick={send}>Send donation request</Button>
          </div>
        </Panel>
      </div>
      <Panel title="Request status" className="mt-4">
        {donations.length === 0 ? <p className="py-6 text-center text-muted-foreground">No donation requests yet</p> : (
          <ul className="space-y-2">
            {donations.map((d) => {
              const p = products.find((pp) => pp.code === d.code);
              return (
                <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border p-3">
                  <span className="text-2xl">{p?.emoji}</span>
                  <div className="flex-1"><p className="text-sm font-semibold">{p?.name} × {d.qty}</p><p className="text-xs text-muted-foreground">{NGOS.find((n) => n.id === d.ngoId)?.name} · {d.date}</p></div>
                  <Badge variant={d.status === "Donated" ? "default" : "secondary"}>{d.status}</Badge>
                  {d.status !== "Donated" && <Button size="sm" variant="outline" onClick={() => { advanceDonation(d.id); toast.success(d.status === "Pending" ? "NGO accepted the request" : "Marked as picked up & donated"); }}>
                    {d.status === "Pending" ? "Simulate NGO accept" : "Mark picked up"}
                  </Button>}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
