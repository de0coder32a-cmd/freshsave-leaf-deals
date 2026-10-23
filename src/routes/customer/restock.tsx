import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { RestockView } from "@/components/restock-view";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/customer/restock")({
  head: () => seo("Restock", "Check product availability."),
  component: () => (<><PageTitle title="Restock" /><RestockView /></>),
});
