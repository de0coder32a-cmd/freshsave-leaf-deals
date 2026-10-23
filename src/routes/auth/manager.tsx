import { createFileRoute } from "@tanstack/react-router";
import { OtpFlow } from "@/components/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/manager")({
  head: () => seo("Manager sign in", "Store managers sign in to manage offers, donations and restocks."),
  component: () => <OtpFlow role="manager" title="Manager sign in" sub="Verify with your registered mobile." nameLabel="Manager name" redirect="/manager/offers" />,
});
