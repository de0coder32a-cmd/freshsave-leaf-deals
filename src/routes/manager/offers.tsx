import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/app-shell";
import { OffersView } from "@/components/offers";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/manager/offers")({
  head: () => seo("Stock offers", "Manage offers and items expiring soon."),
  component: () => (<><PageTitle title="Stock offers" /><OffersView withExpiring /></>),
});
