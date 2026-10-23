import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { RestockView } from "@/components/restock-view";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/manager/restock")({
  head: () => seo("Restock", "Stock levels and restock requests."),
  component: () => (<><PageTitle title="Restock" /><RestockView manager /></>),
});
