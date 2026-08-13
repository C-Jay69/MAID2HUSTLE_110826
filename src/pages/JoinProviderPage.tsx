import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { api, type Vendor } from "@/lib/api";
import { cn } from "@/lib/utils";

const SERVICE_TYPES = [
  { label: "Cleaning", icon: "cleaning_services" },
  { label: "Plumbing", icon: "plumbing" },
  { label: "Electrical", icon: "bolt" },
  { label: "Landscaping", icon: "park" },
  { label: "HVAC", icon: "ac_unit" },
  { label: "Moving", icon: "local_shipping" },
  { label: "Handyman", icon: "handyman" },
];

export function JoinProviderPage() {
  const { user, refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", service_type: "", hourly_rate: "", bio: "" });
  const [existing, setExisting] = useState<Vendor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.myVendor().then(setExisting).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.applyVendor({
        name: form.name,
        service_type: form.service_type,
        hourly_rate: Number(form.hourly_rate) || 30,
        bio: form.bio,
        availability: JSON.stringify({
          mon: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
          tue: ["08:00-10:00", "10:00-12:00"],
          wed: ["08:00-10:00", "12:00-14:00", "16:00-18:00"],
          thu: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
          fri: ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"],
        }),
      });
      await refresh();
      window.location.hash = "/provider";
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (existing) {
    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center px-6 text-center">
        <div className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
          <Icon name="verified" className="text-emerald-500 text-[40px]" filled />
        </div>
        <h1 className="text-ink text-2xl font-black mb-2">Application Submitted!</h1>
        <p className="text-gray-400 mb-8">
          {existing.approved
            ? "Your provider profile is live. Head to your dashboard to manage jobs."
            : "Your provider application is under review. Our team typically approves applications within 24 hours."}
        </p>
        <button
          onClick={() => (window.location.hash = existing.approved ? "/provider" : "/")}
          className="w-full max-w-sm h-14 rounded-xl gradient-bg text-white font-bold text-lg shadow-lg shadow-primary/25"
        >
          {existing.approved ? "Go to Dashboard" : "Back to Home"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col">
      <TopBar title="Maid 2 Hustle" subtitle="Provider Portal" back="/" />

      {/* Step indicators */}
      <div className="flex w-full items-center justify-center gap-3 py-5">
        {[1, 2, 3].map((s) => (
          <div key={s} className={cn("h-1.5 w-12 rounded-full", s <= step ? "bg-primary" : "bg-gray-800")} />
        ))}
      </div>

      <div className="px-4">
        <h2 className="text-ink tracking-tight text-[28px] font-bold leading-tight pb-1 pt-2">Let's get started</h2>
        <p className="text-gray-400 text-base pb-6">Step {step}: {step === 1 ? "Personal info" : step === 2 ? "Professional details" : "Review & submit"}</p>
      </div>

      {step === 1 && (
        <form className="space-y-4 px-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <Input label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="John Doe" />
          <Input label="Email Address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="john@example.com" type="email" />
          <Input label="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+1 (555) 000-0000" type="tel" />
          <div className="h-6"></div>
          <button className="gradient-bg w-full h-14 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
            Continue to Professional Info
            <Icon name="chevron_right" />
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-4 px-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
          <div>
            <span className="text-gray-400 text-sm font-medium leading-normal pb-2 px-1 block">Service Category</span>
            <div className="grid grid-cols-3 gap-3">
              {SERVICE_TYPES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setForm({ ...form, service_type: s.label })}
                  className={cn(
                    "border rounded-xl p-4 flex flex-col items-center gap-2 transition-colors",
                    form.service_type === s.label ? "border-primary bg-primary/10" : "border-gray-800 bg-[#111111]",
                  )}
                >
                  <Icon name={s.icon} className={form.service_type === s.label ? "text-primary" : "text-gray-500"} />
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Input label="Hourly Rate ($)" value={form.hourly_rate} onChange={(v) => setForm({ ...form, hourly_rate: v })} placeholder="30" type="number" />
          <div>
            <span className="text-gray-400 text-sm font-medium leading-normal pb-2 px-1 block">Short Bio</span>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Tell customers about your experience and specialties..."
              className="w-full rounded-xl bg-white border border-line px-4 py-3 text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 cursor-pointer">
            <Icon name="cloud_upload" className="text-gray-400 text-3xl" />
            <p className="text-sm font-medium">Upload License or ID</p>
            <p className="text-[10px] text-gray-600">PDF, JPG up to 5MB</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="w-1/3 py-4 rounded-xl border border-gray-800 font-bold text-sm active:scale-95 transition-transform">
              BACK
            </button>
            <button type="submit" className="flex-1 py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/40 active:scale-95 transition-transform">
              REVIEW APPLICATION
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="px-4">
          <div className="bg-[#1e132b] rounded-xl border border-slate-800 p-5 space-y-3">
            <Row label="Name" value={form.name} />
            <Row label="Email" value={form.email} />
            <Row label="Phone" value={form.phone || "—"} />
            <Row label="Category" value={form.service_type} />
            <Row label="Rate" value={form.hourly_rate ? `$${form.hourly_rate}/hr` : "—"} />
            <Row label="Bio" value={form.bio || "—"} />
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          <div className="flex items-center gap-3 my-6">
            <input id="terms" type="checkbox" required className="w-5 h-5 rounded bg-[#111] text-primary focus:ring-primary" />
            <label htmlFor="terms" className="text-xs text-gray-400">
              I agree to the <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span>.
            </label>
          </div>
          <button
            onClick={submit}
            disabled={busy}
            className="gradient-bg w-full h-14 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
          >
            {busy ? "Submitting..." : "Submit Application"}
            <Icon name="chevron_right" />
          </button>
          <button onClick={() => setStep(2)} className="w-full text-center text-gray-500 text-sm py-3">
            Back
          </button>
        </div>
      )}

      <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">Maid 2 Hustle Provider Portal</p>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-gray-400 text-sm font-medium leading-normal pb-2 px-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 rounded-xl bg-white border border-line px-4 text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-ink text-sm font-medium text-right">{value}</span>
    </div>
  );
}