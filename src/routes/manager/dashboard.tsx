import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { Panel, SimpleBar, Stat } from "@/components/charts";
import { Progress } from "@/components/ui/progress";
import { dailySales } from "@/lib/mock-data";
import { SETTINGS, taxReduction } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/manager/dashboard")({
  head: () => seo("Sales dashboard", "Sales, food waste saved and tax reduction earned."),
  component: ManagerDash,
});

function ManagerDash() {
  const { donations, products } = useStore();
  const donated = donations.filter((d) => d.status === "Donated");
  const qty = donated.reduce((t, d) => t + d.qty, 0);
  const kg = donated.reduce((t, d) => t + d.qty * (products.find((p) => p.code === d.code)?.weightKg ?? 0), 0);
  const value = donated.reduce((t, d) => t + d.qty * (products.find((p) => p.code === d.code)?.price ?? 0), 0);
  const totalStock = products.reduce((t, p) => t + p.stock, 0) + qty;
  const tax = taxReduction(qty, totalStock, value);
  const pct = Math.round(tax.share * 1000) / 10;

  return (
    <>
      <PageTitle title="Sales dashboard" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Food waste saved" value={`${kg.toFixed(1)} kg`} hint={`${qty} items donated`} />
        <Stat label="Tax reduction earned" value={`₹${tax.amount.toLocaleString("en-IN")}`} hint={tax.unlocked ? "Unlocked 🎉" : "Not yet unlocked"} />
        <Stat label="Donated value" value={`₹${value.toLocaleString("en-IN")}`} />
      </div>
      <Panel title="Monthly donation vs threshold" className="mt-4">
        <div className="mb-2 flex justify-between text-sm"><span>{pct}% donated</span><span className="text-muted-foreground">Target {SETTINGS.donationThreshold * 100}–30%</span></div>
        <Progress value={Math.min(100, (tax.share / 0.3) * 100)} />
        <div className="mt-4 rounded-xl bg-muted p-4 font-mono text-xs leading-6">
          share = donated qty / total stock = {qty} / {totalStock} = {pct}%<br />
          if share ≥ {SETTINGS.donationThreshold * 100}% → reduction = {SETTINGS.taxReductionRate * 100}% × donated value<br />
          = {SETTINGS.taxReductionRate * 100}% × ₹{value} = <b>₹{tax.amount}</b>
        </div>
      </Panel>
      <Panel title="Day-wise sales (₹)" className="mt-4"><SimpleBar data={dailySales(14)} x="day" y="sales" /></Panel>
    </>
  );
}
