import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { RestockView } from "@/components/restock-view";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/staff/restock")({
  head: () => seo("Restock", "Check stock levels."),
  component: () => (<><PageTitle title="Restock" /><RestockView /></>),
});
