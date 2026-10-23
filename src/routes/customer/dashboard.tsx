import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/app-shell";
import { Panel, SimpleBar } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { customerSpend } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/customer/dashboard")({
  head: () => seo("My dashboard", "Your spending, loyalty points and feedback."),
  component: Dashboard,
});

function Dashboard() {
  const { points, session, addFeedback } = useStore();
  const [rating, setRating] = useState(0);
  const [msg, setMsg] = useState("");
  const total = points.reduce((t, p) => t + p.points, 0);
  const submit = () => {
    if (!rating || !msg.trim()) { toast.error("Add a rating and a message"); return; }
    addFeedback({ name: session?.name ?? "Customer", rating, message: msg.trim() });
    setRating(0); setMsg("");
    toast.success("Thanks for your feedback! 🌿");
  };
  return (
    <>
      <PageTitle title="My dashboard" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Monthly spending (₹)" className="lg:col-span-2"><SimpleBar data={customerSpend} x="month" y="spend" /></Panel>
        <Panel>
          <div className="rounded-2xl bg-gradient-fresh p-5 text-primary-foreground">
            <p className="text-sm opacity-90">Loyalty points</p>
            <p className="font-display text-5xl font-extrabold">{total}</p>
            <p className="mt-1 text-xs opacity-90">1 point for every ₹10 spent</p>
          </div>
          <h3 className="mb-2 mt-4 text-sm font-semibold">Recent history</h3>
          <ul className="space-y-2">
            {points.slice(0, 5).map((p) => (
              <li key={p.id} className="flex justify-between text-sm"><span className="text-muted-foreground">{p.date} · ₹{p.amount}</span><span className="font-semibold text-primary">+{p.points}</span></li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="Share your feedback" className="mt-4">
        <div className="mb-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
              <Star className={`h-7 w-7 transition-transform hover:scale-110 ${n <= rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <Textarea placeholder="Tell us about your experience…" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <Button className="mt-3" onClick={submit}>Submit feedback</Button>
      </Panel>
    </>
  );
}
