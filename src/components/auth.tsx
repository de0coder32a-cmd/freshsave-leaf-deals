import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Logo } from "@/components/app-shell";
import { useStore } from "@/lib/store";

export function AuthCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-leaf px-4">
      <div className="w-full max-w-md animate-rise rounded-3xl border bg-card p-8 shadow-soft">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{sub}</p>
        {children}
      </div>
    </div>
  );
}

export function OtpFlow({ role, title, sub, nameLabel, redirect }: { role: "customer" | "manager"; title: string; sub: string; nameLabel: string; redirect: string }) {
  const { login } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!/^\d{10}$/.test(mobile)) { toast.error("Enter a valid 10-digit mobile number"); return; }
    setBusy(true);
    setTimeout(() => { setBusy(false); setStep("otp"); toast.success(`OTP sent to +91 ${mobile}`); }, 600);
  };
  const verify = () => {
    if (otp !== "123456") { toast.error("Incorrect OTP"); return; }
    login({ role, name: name.trim(), mobile });
    toast.success(role === "customer" ? "Registration complete!" : "Welcome back!");
    navigate({ to: redirect as "/" });
  };

  return (
    <AuthCard title={step === "form" ? title : "Enter OTP"} sub={step === "form" ? sub : `We sent a 6-digit code to +91 ${mobile}`}>
      {step === "form" ? (
        <form onSubmit={send} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">{nameLabel}</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="mobile">Mobile number</Label><Input id="mobile" inputMode="numeric" maxLength={10} placeholder="98XXXXXXXX" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} /></div>
          <Button className="w-full" disabled={busy}>{busy ? "Sending…" : "Send OTP"}</Button>
        </form>
      ) : (
        <div className="space-y-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={() => {}}>
            <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          </InputOTP>
          <p className="rounded-lg bg-primary-soft px-3 py-2 text-xs text-secondary-foreground">Demo: use OTP <b>123456</b></p>
          <Button className="w-full" disabled={otp.length !== 6} onClick={verify}>Verify</Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep("form")}>Change number</Button>
        </div>
      )}
    </AuthCard>
  );
}
