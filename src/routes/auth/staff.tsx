import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

const CODES: Record<string, string> = { "12345": "Arjun", "54321": "Meera" };

export const Route = createFileRoute("/auth/staff")({
  head: () => seo("Staff login", "Staff sign in with a 5-digit code to scan and manage stock."),
  component: StaffAuth,
});

function StaffAuth() {
  const [code, setCode] = useState("");
  const { login } = useStore();
  const navigate = useNavigate();
  const submit = () => {
    if (!/^\d{5}$/.test(code)) { toast.error("Staff code must be exactly 5 digits"); return; }
    if (!CODES[code]) { toast.error("Unknown staff code"); return; }
    login({ role: "staff", name: CODES[code] });
    toast.success(`Welcome, ${CODES[code]}`);
    navigate({ to: "/staff/scan" });
  };
  return (
    <AuthCard title="Staff login" sub="Enter your 5-digit staff code.">
      <div className="space-y-4">
        <InputOTP maxLength={5} value={code} onChange={setCode}>
          <InputOTPGroup>{[0, 1, 2, 3, 4].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
        </InputOTP>
        <p className="rounded-lg bg-primary-soft px-3 py-2 text-xs text-secondary-foreground">Demo codes: <b>12345</b> or <b>54321</b></p>
        <Button className="w-full" onClick={submit} disabled={code.length !== 5}>Continue</Button>
      </div>
    </AuthCard>
  );
}
