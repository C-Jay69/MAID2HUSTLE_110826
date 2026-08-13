import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role });
      }
      window.location.hash = mode === "login" ? "/" : role === "vendor" ? "/join-provider" : "/";
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 gradient-bg rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Icon name="bolt" className="text-white text-[32px]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">MAID 2 HUSTLE</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your account in seconds."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <>
              <Field label="Full Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="John Doe"
                  className="auth-input"
                />
              </Field>
              <Field label="Phone (optional)">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="auth-input"
                />
              </Field>
              <Field label="I want to join as a...">
                <div className="grid grid-cols-2 gap-3">
                  <RoleButton active={role === "customer"} onClick={() => setRole("customer")} icon="person" label="Customer" />
                  <RoleButton active={role === "vendor"} onClick={() => setRole("vendor")} icon="work" label="Provider" />
                </div>
              </Field>
            </>
          )}
          <Field label="Email Address">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
              className="auth-input"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="••••••••"
              className="auth-input"
            />
          </Field>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-14 rounded-xl gradient-bg text-white font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center"
          >
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-primary font-bold"
            onClick={() => (window.location.hash = mode === "login" ? "/register" : "/login")}
          >
            {mode === "login" ? "Register here" : "Sign in"}
          </button>
        </p>

        <div className="mt-8 space-y-3">
          <button className="w-full h-12 rounded-xl bg-[#2a2a2a] border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <Icon name="g_mobiledata" className="text-primary" /> Continue with Google
          </button>
          <button className="w-full h-12 rounded-xl bg-[#2a2a2a] border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
            <Icon name="chat" className="text-blue-400" /> Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-gray-400 text-sm font-medium block pb-2 px-1">{label}</span>
      {children}
    </label>
  );
}

function RoleButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
        active ? "border-primary bg-primary/10" : "border-gray-800 bg-[#111]",
      )}
    >
      <Icon name={icon} className={active ? "text-primary" : "text-gray-500"} />
      <span className={cn("text-xs font-semibold", active ? "text-white" : "text-gray-400")}>{label}</span>
    </button>
  );
}