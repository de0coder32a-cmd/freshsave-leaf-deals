import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageTitle } from "@/components/app-shell";
import { Panel, Stat } from "@/components/charts";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/manager/feedback")({
  head: () => seo("Customer feedback", "What customers are saying about FreshSave."),
  component: Feedback,
});

function Feedback() {
  const { feedback } = useStore();
  const avg = feedback.length ? feedback.reduce((t, f) => t + f.rating, 0) / feedback.length : 0;
  return (
    <>
      <PageTitle title="Customer feedback" />
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Stat label="Average rating" value={`${avg.toFixed(1)} / 5`} />
        <Stat label="Total reviews" value={String(feedback.length)} />
      </div>
      <div className="space-y-3">
        {feedback.length === 0 && <Panel><p className="text-center text-muted-foreground">No feedback yet</p></Panel>}
        {feedback.map((f) => (
          <Panel key={f.id}>
            <div className="flex items-center justify-between"><p className="font-semibold">{f.name}</p><span className="text-xs text-muted-foreground">{f.date}</span></div>
            <div className="my-1 flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= f.rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />)}</div>
            <p className="text-sm">{f.message}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
