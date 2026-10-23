import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { OffersView } from "@/components/offers";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/staff/home")({
  head: () => seo("Stock offers", "Current discounted stock offers."),
  component: () => (<><PageTitle title="Stock offers" /><OffersView /></>),
});
