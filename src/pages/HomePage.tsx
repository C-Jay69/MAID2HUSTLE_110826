import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { navigate } from "@/lib/router";
import { api, type Service } from "@/lib/api";
import { ServiceCard } from "@/components/service-card";

const FEATURED_TASKS = [
  { title: "Furniture Assembly", icon: "chair" },
  { title: "TV Mounting", icon: "tv" },
  { title: "Home Repairs", icon: "handyman" },
  { title: "Help Moving", icon: "local_shipping" },
  { title: "Yard Work Services", icon: "yard" },
  { title: "Spring Cleaning", icon: "cleaning_services" },
  { title: "Plumbing", icon: "plumbing" },
  { title: "Hang Art, Mirror & Decor", icon: "photo_frame" },
  { title: "Electrical Help", icon: "electrical_services" },
  { title: "Wait in Line", icon: "schedule" },
  { title: "Closet Organization Service", icon: "inventory_2" },
  { title: "Handyman", icon: "construction" },
  { title: "Door, Cabinet & Furniture Repair", icon: "door_sliding" },
  { title: "Appliance Installation & Repairs", icon: "kitchen" },
  { title: "Drywall Repair Service", icon: "format_paint" },
  { title: "Heavy Lifting", icon: "fitness_center" },
  { title: "Smart Home Installation", icon: "smart_button" },
  { title: "Painting", icon: "brush" },
];

const CATEGORIES = [
  { label: "Cleaning", icon: "cleaning_services" },
  { label: "Home Repairs", icon: "handyman" },
  { label: "Furniture Assembly", icon: "chair" },
  { label: "Mounting & Installation", icon: "tv" },
  { label: "Moving & Packing", icon: "local_shipping" },
  { label: "Yard Work & Gardening", icon: "yard" },
  { label: "Shopping & Delivery", icon: "shopping_cart" },
  { label: "Personal Assistant", icon: "support_agent" },
  { label: "Organization", icon: "inventory_2" },
  { label: "Holiday Help", icon: "celebration" },
  { label: "Office Services", icon: "business_center" },
  { label: "Virtual & Online", icon: "computer" },
];

export function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.services({ popular: "1" }).then(setServices).catch(() => {});
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="rounded-3xl overflow-hidden mb-10 relative">
        <div className="bg-gradient-to-br from-[#c0ffff] via-[#e6fff7] to-[#fffdd0] px-6 sm:px-12 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-primary text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
                <Icon name="verified" className="text-[16px]" filled /> Trusted &amp; Insured
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-ink">
                Book Trusted <span className="gradient-text">Home Services</span> in Minutes
              </h1>
              <p className="text-lg text-ink/60 font-medium leading-relaxed mt-4 max-w-lg">
                From furniture assembly to deep cleaning — one platform for every task on your to-do list. Quality guaranteed for the modern hustle.
              </p>

              <form onSubmit={submitSearch} className="mt-7 flex items-center gap-2 bg-white rounded-2xl p-2 shadow-lg shadow-black/5 max-w-lg">
                <Icon name="search" className="text-ink/40 text-[24px] ml-2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What do you need done? e.g. TV mounting, packing help..."
                  className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
                <button type="submit" className="h-12 px-6 rounded-xl gradient-bg text-sm font-bold shadow-lg shadow-primary/25">
                  Search
                </button>
              </form>

              <div className="mt-7 flex flex-wrap gap-6">
                {[
                  { icon: "bolt", label: "Book in 60 seconds" },
                  { icon: "badge", label: "Background-checked pros" },
                  { icon: "verified_user", label: "$1,000 guarantee" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <div className="size-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Icon name={t.icon} className="text-primary text-[20px]" filled />
                    </div>
                    <span className="text-sm font-semibold text-ink/70">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c0ffff] to-[#b9f7d2] opacity-80"></div>
                <div className="absolute inset-6 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <img
                    src="/landing_page.jpeg"
                    alt="Landing Page"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -top-2 -left-2 size-16 rounded-2xl bg-white shadow-lg flex items-center justify-center rotate-[-8deg]">
                  <Icon name="chair" className="text-primary text-[32px]" />
                </div>
                <div className="absolute top-10 -right-4 size-16 rounded-2xl bg-white shadow-lg flex items-center justify-center rotate-[8deg]">
                  <Icon name="tv" className="text-secondary text-[32px]" />
                </div>
                <div className="absolute -bottom-2 left-8 size-16 rounded-2xl bg-white shadow-lg flex items-center justify-center rotate-[4deg]">
                  <Icon name="yard" className="text-primary text-[32px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tasks */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Featured Tasks</h2>
            <p className="text-ink/50 text-sm mt-1">Our most-booked tasks, ready to schedule today.</p>
          </div>
          <button onClick={() => navigate("/explore")} className="text-primary text-sm font-bold uppercase tracking-wider hover:underline">
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {FEATURED_TASKS.map((t) => (
            <button
              key={t.title}
              onClick={() => navigate(`/explore?q=${encodeURIComponent(t.title)}`)}
              className="group bg-white rounded-2xl p-4 border border-line hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-md transition-all text-left flex flex-col gap-3"
            >
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon name={t.icon} className="text-primary text-[24px] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-bold leading-tight">{t.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Browse by Category</h2>
          <button onClick={() => navigate("/categories")} className="text-primary text-sm font-bold uppercase tracking-wider hover:underline">
            View All
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate("/categories")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-line hover:border-primary/60 hover:text-primary transition-colors text-sm font-semibold"
            >
              <Icon name={c.icon} className="text-primary text-[18px]" />
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Popular services */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Popular Right Now</h2>
            <p className="text-ink/50 text-sm mt-1">Top-rated services customers are booking this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12 bg-white rounded-3xl border border-line p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "1", title: "Choose a Task", desc: "Search hundreds of services and find the right professional for the job.", icon: "search" },
            { n: "2", title: "Pick Your Time", desc: "Select a date and arrival window. Real-time availability, no back-and-forth.", icon: "calendar_month" },
            { n: "3", title: "Relax & Hustle", desc: "Track your pro live, pay securely, and get on with what you do best.", icon: "bolt" },
          ].map((step) => (
            <div key={step.n} className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="size-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25">
                  <Icon name={step.icon} className="text-[28px]" />
                </div>
                <span className="absolute -top-2 -right-2 size-7 rounded-full bg-white border border-line flex items-center justify-center text-xs font-black text-primary shadow-sm">
                  {step.n}
                </span>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-ink/60 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl gradient-bg p-10 sm:p-14 text-center mb-4">
        <h3 className="text-3xl sm:text-4xl font-black mb-2">Ready to get started?</h3>
        <p className="text-ink/70 text-lg mb-7">Book your first service in under 60 seconds.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate("/explore")} className="bg-white text-ink font-bold py-4 px-10 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
            Browse Services
          </button>
          <button onClick={() => navigate("/join-provider")} className="bg-black/10 text-ink font-bold py-4 px-10 rounded-2xl border-2 border-white/60 hover:scale-[1.02] transition-transform">
            Become a Provider
          </button>
        </div>
      </section>
    </div>
  );
}