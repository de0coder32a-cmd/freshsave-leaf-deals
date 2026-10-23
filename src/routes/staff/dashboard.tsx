import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/app-shell";
import { Panel, SimpleBar } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { dailySales, monthlySales } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/staff/dashboard")({
  head: () => seo("Staff dashboard", "Daily and monthly store sales."),
  component: StaffDash,
});

function StaffDash() {
  const [range, setRange] = useState(7);
  return (
    <>
      <PageTitle title="Sales dashboard" />
      <div className="grid gap-4">
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Daily sales (₹)</h2>
            <div className="flex gap-2">{[7, 30].map((r) => <Button key={r} size="sm" variant={range === r ? "default" : "outline"} onClick={() => setRange(r)}>{r} days</Button>)}</div>
          </div>
          <SimpleBar data={dailySales(range)} x="day" y="sales" />
        </Panel>
        <Panel title="Monthly sales (₹)"><SimpleBar data={monthlySales} x="month" y="sales" /></Panel>
      </div>
    </>
  );
}
