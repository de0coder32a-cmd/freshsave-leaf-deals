import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { OffersView } from "@/components/offers";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/customer/home")({
  head: () => seo("Fresh deals", "Discounted near-expiry groceries near you."),
  component: () => (<><PageTitle title="Fresh deals" /><OffersView withCart /></>),
});
