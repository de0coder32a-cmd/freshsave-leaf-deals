import { createFileRoute } from "@tanstack/react-router";
import { OtpFlow } from "@/components/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/customer")({
  head: () => seo("Customer sign up", "Register with your mobile number to shop discounted fresh deals."),
  component: () => <OtpFlow role="customer" title="Join as a customer" sub="Sign up with your mobile number." nameLabel="Full name" redirect="/customer/home" />,
});
