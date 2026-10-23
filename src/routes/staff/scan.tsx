import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/app-shell";
import { Panel } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/staff/scan")({
  head: () => seo("Scan barcode", "Scan a product to see expiry, stock and discount."),
  component: Scan,
});

const SAMPLES = ["890100001", "890300002", "890600004", "890400001"];

function Scan() {
  const { products } = useStore();
  const [code, setCode] = useState("");
  const [found, setFound] = useState<string | null>(null);
  const [camOn, setCamOn] = useState(false);
  const scanner = useRef<{ stop: () => Promise<void> } | null>(null);

  const lookup = (c: string) => {
    const p = products.find((pp) => pp.code === c.trim());
    if (!p) { setFound(null); return toast.error("Product not found"); }
    setFound(p.code); toast.success(`Scanned ${p.name}`);
  };

  useEffect(() => {
    if (!camOn) return;
    let cancelled = false;
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled) return;
      const s = new Html5Qrcode("reader");
      scanner.current = s;
      s.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 120 } }, (text) => { lookup(text); setCamOn(false); }, () => {})
        .catch(() => { toast.error("Camera unavailable — use manual entry"); setCamOn(false); });
    });
    return () => { cancelled = true; scanner.current?.stop().catch(() => {}); scanner.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camOn]);

  const p = products.find((pp) => pp.code === found);

  return (
    <>
      <PageTitle title="Scan barcode" sub="Point the camera at a barcode or type the code." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div id="reader" className={`overflow-hidden rounded-xl ${camOn ? "" : "hidden"}`} />
          {!camOn && <div className="grid h-48 place-items-center rounded-xl border-2 border-dashed bg-primary-soft text-muted-foreground">Camera is off</div>}
          <Button className="mt-3 w-full" variant={camOn ? "outline" : "default"} onClick={() => setCamOn(!camOn)}>
            {camOn ? <><CameraOff /> Stop camera</> : <><Camera /> Start camera</>}
          </Button>
          <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); lookup(code); }}>
            <Input placeholder="Enter barcode manually" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button type="submit" variant="secondary">Look up</Button>
          </form>
          <p className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">Simulate scan</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => <Button key={s} size="sm" variant="outline" onClick={() => { setCode(s); lookup(s); }}>{s}</Button>)}
          </div>
        </Panel>
        <Panel title="Product details">
          {!p ? <p className="py-16 text-center text-muted-foreground">Scan a product to see its details</p> : (
            <div className="animate-rise">
              <div className="flex items-center gap-4">
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-primary-soft text-5xl">{p.emoji}</span>
                <div><h3 className="text-xl font-bold">{p.name}</h3><p className="text-sm text-muted-foreground">#{p.code} · {p.category}</p></div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {[["Manufactured", p.mfg], ["Expiry", p.expiry], ["Days left", String(p.days)], ["Stock", `${p.stock} units`], ["Discount", `${p.discount}%`], ["Price", `₹${p.finalPrice} (was ₹${p.price})`]].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-muted p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
                ))}
              </dl>
              {p.label && <p className="mt-3 text-sm font-semibold text-primary">{p.label}</p>}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
