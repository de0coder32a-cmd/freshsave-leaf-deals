import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/app-shell";

export const Route = createFileRoute("/customer")({
  component: () => <RoleLayout role="customer" />,
});
