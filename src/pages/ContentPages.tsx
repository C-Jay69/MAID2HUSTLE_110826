import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TopBar, BrandHeader } from "@/components/layout";

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <BrandHeader />
      <div className="px-5 py-8">
        <h1 className="text-3xl font-black leading-tight mb-3">
          Empowering the <span className="gradient-text">Modern Hustle</span>
        </h1>
        <div className="aspect-[4/3] gradient-bg-deep rounded-2xl border border-line flex items-center justify-center mb-8">
          <Icon name="groups" className="text-ink text-[80px]" />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-primary">The Story</h2>
          <p className="text-gray-300 leading-relaxed">
            MAID 2 HUSTLE started with a simple mission: to empower domestic and service workers to transform their jobs into thriving businesses. We built a platform where skilled professionals — cleaners, plumbers, electricians, landscapers and more — connect directly with customers who value quality.
          </p>
          <p className="text-gray-400 leading-relaxed mt-3">
            No middlemen. No lead fees. Just hustle, matched with people who appreciate it.
          </p>
        </div>
        <h2 className="text-xl font-bold mb-4">Core Values</h2>
        <div className="space-y-3">
          {[
            { icon: "verified_user", title: "Unwavering Trust", desc: "Every provider is background-checked and verified before their first booking." },
            { icon: "bolt", title: "Peak Efficiency", desc: "Book a trusted pro in under 60 seconds, with real-time availability." },
            { icon: "workspace_premium", title: "Obsessive Quality", desc: "Insured up to $1,000 and backed by our Trust & Safety Guarantee." },
          ].map((v) => (
            <div key={v.title} className="bg-[#2a2a2a] rounded-xl p-4 border border-white/5 flex gap-4">
              <div className="size-11 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Icon name={v.icon} className="text-ink text-[22px]" />
              </div>
              <div>
                <p className="font-bold">{v.title}</p>
                <p className="text-gray-400 text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl gradient-bg p-6 text-center">
          <h3 className="text-2xl font-black mb-2">Join the Movement</h3>
          <p className="text-ink/80 text-sm mb-5">Whether you need a hand or want to lend one, there's a place for you.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => (window.location.hash = "/explore")} className="bg-white text-ink font-bold py-3 rounded-xl shadow-sm">
              Find a Pro
            </button>
            <button onClick={() => (window.location.hash = "/join-provider")} className="bg-black/10 text-ink font-bold py-3 rounded-xl border border-black/10">
              Become a Partner
            </button>
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BrandHeader />
      <TopBar title="Get in Touch" back="/" transparent />
      <div className="px-5 py-6">
        <h1 className="text-3xl font-black mb-6">
          We'd love to <span className="gradient-text">hear from you</span>
        </h1>
        {sent ? (
          <div className="bg-[#1e132b] rounded-2xl border border-emerald-500/30 p-8 text-center">
            <Icon name="check_circle" className="text-emerald-400 text-[44px] mx-auto mb-3" filled />
            <h3 className="font-black text-lg mb-1">Message sent!</h3>
            <p className="text-gray-400 text-sm">Our team will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jane Doe" className="auth-input" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="jane@example.com" className="auth-input" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="How can we help you hustle?" className="w-full rounded-xl bg-white border border-line px-4 py-3 text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <button type="submit" className="w-full h-14 rounded-xl gradient-bg text-white font-bold text-lg shadow-lg shadow-primary/25">
              Send Message
            </button>
          </form>
        )}

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-xl p-4 border border-white/5">
            <Icon name="mail" className="text-primary text-[22px]" />
            <div>
              <p className="text-xs text-gray-500">Support Email</p>
              <p className="font-semibold">support@maid2hustle.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-xl p-4 border border-white/5">
            <Icon name="call" className="text-primary text-[22px]" />
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="font-semibold">+1 (555) 012-3456</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
}

export function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  const categories = [
    { icon: "calendar_today", label: "Booking Help" },
    { icon: "payments", label: "Payments" },
    { icon: "work", label: "For Providers" },
    { icon: "shield", label: "Account Safety" },
  ];
  const faqs = [
    { q: "How do I cancel a booking?", a: "Open the booking from your Bookings tab and tap Cancel. Cancellations are free up to 24 hours before the start time." },
    { q: "What is the service guarantee?", a: "Every booking is protected by our Trust & Safety Guarantee, insured up to $1,000. If you're not satisfied, we make it right." },
    { q: "Which payment methods do you accept?", a: "We accept credit/debit cards, Apple Pay, and PayPal. All payments are processed securely via Stripe." },
    { q: "How do I contact my provider?", a: "You can message or call your provider directly from the booking details screen, or use live tracking when they're en route." },
    { q: "How do I report an issue?", a: "Tap Help in the app or email support@maid2hustle.com. Our team responds within 24 hours and disputes are resolved quickly." },
  ];
  return (
    <div className="max-w-3xl mx-auto">
      <TopBar title="Help Center" back="/profile" />
      <div className="p-4">
        <div className="rounded-2xl gradient-bg p-6 mb-6">
          <h2 className="text-xl font-black mb-1">How can we help?</h2>
          <div className="mt-4 bg-white/30 rounded-xl h-12 flex items-center gap-2 px-4">
            <Icon name="search" className="text-ink/70" />
            <span className="text-ink/60 text-sm">Search help topics...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {categories.map((c) => (
            <button key={c.label} className="bg-[#2a2a2a] rounded-xl p-4 border border-white/5 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name={c.icon} className="text-primary text-[22px]" />
              </div>
              <span className="text-xs font-semibold">{c.label}</span>
            </button>
          ))}
        </div>
        <h3 className="text-ink font-bold mb-3">Top Questions</h3>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-semibold text-sm pr-2">{f.q}</span>
                <Icon name={open === i ? "expand_less" : "expand_more"} className="text-gray-500 shrink-0" />
              </button>
              {open === i && <p className="px-4 pb-4 text-gray-400 text-sm">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl gradient-bg p-5 text-center">
          <p className="font-black text-lg">Still need help?</p>
          <p className="text-ink/80 text-sm mb-3">Our support team is here 24/7.</p>
          <button onClick={() => (window.location.hash = "/contact")} className="bg-white text-ink font-bold py-3 px-6 rounded-xl shadow-sm">
            Contact Support
          </button>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
}

export function BlogPage() {
  const posts = [
    { id: 1, icon: "lightbulb", title: "5 Deep-Cleaning Hacks That Save You Hours", tag: "Home Care", read: "4 min" },
    { id: 2, icon: "currency_exchange", title: "How Providers Earn More on MAID 2 HUSTLE", tag: "For Providers", read: "3 min" },
    { id: 3, icon: "calendar_month", title: "The Perfect Pre-Holiday Home Prep Checklist", tag: "Tips", read: "5 min" },
    { id: 4, icon: "verified_user", title: "What Our Trust & Safety Guarantee Really Covers", tag: "Safety", read: "2 min" },
  ];
  return (
    <div className="max-w-3xl mx-auto">
      <TopBar title="The Hustle Blog" back="/" />
      <div className="p-4 space-y-4">
        {posts.map((p) => (
          <button key={p.id} className="w-full text-left bg-white rounded-xl border border-line overflow-hidden hover:border-primary/40 transition-colors">
            <div className="h-28 gradient-bg-deep flex items-center justify-center">
              <Icon name={p.icon} className="text-ink text-[44px]" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{p.tag}</span>
                <span className="text-gray-500 text-[10px]">• {p.read}</span>
              </div>
              <p className="font-bold">{p.title}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="h-24"></div>
    </div>
  );
}