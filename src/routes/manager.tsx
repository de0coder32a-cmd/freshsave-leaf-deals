import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/app-shell";

export const Route = createFileRoute("/manager")({
  component: () => <RoleLayout role="manager" />,
});
