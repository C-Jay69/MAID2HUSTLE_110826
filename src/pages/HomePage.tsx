import { useEffect, useState } from "react";
import { BrandHeader } from "@/components/layout";
import { Icon } from "@/components/ui/icon";
import { navigate } from "@/lib/router";
import { api, type Service } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const TOP_SERVICES = [
  { title: "Cleaning", icon: "cleaning_services", price: "$50", category: "Cleaning" },
  { title: "Plumbing", icon: "plumbing", price: "$80", category: "Plumbing" },
  { title: "Electrical", icon: "bolt", price: "$90", category: "Electrical" },
  { title: "Landscaping", icon: "park", price: "$65", category: "Landscaping" },
  { title: "HVAC", icon: "ac_unit", price: "$75", category: "HVAC" },
  { title: "Moving", icon: "local_shipping", price: "$120", category: "Moving" },
];

export function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    api.services().then(setServices).catch(() => {});
  }, []);

  return (
    <div>
      <BrandHeader onMenu={() => navigate("/menu")} />

      {/* Hero */}
      <section className="px-6 pt-8 pb-8">
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          <div className="w-full aspect-[4/3] gradient-bg-deep rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex items-center justify-center">
            <Icon name="cleaning_services" className="text-white text-[110px] opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-white text-5xl font-black leading-[1.1] tracking-tight">
              <span className="gradient-text">Book Trusted Home Services</span> in Minutes
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
              Professional help for every household task. Quality guaranteed for the modern hustle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-1">
              <button
                onClick={() => navigate("/explore")}
                className="flex-1 flex min-w-[160px] cursor-pointer items-center justify-center rounded-2xl h-14 gradient-bg text-white text-base font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Book Now
              </button>
              <button
                onClick={() => navigate(user ? "/join-provider" : "/register")}
                className="flex-1 flex min-w-[160px] cursor-pointer items-center justify-center rounded-2xl h-14 bg-transparent border-2 border-white/20 text-white text-base font-bold hover:bg-white/5 active:scale-95 transition-all"
              >
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Top Services */}
      <div className="px-6 flex items-center justify-between max-w-md mx-auto">
        <h2 className="text-white text-2xl font-black tracking-tight">Top Services</h2>
        <button onClick={() => navigate("/explore")} className="text-primary text-sm font-bold uppercase tracking-wider">
          View All
        </button>
      </div>
      <section className="max-w-md mx-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {TOP_SERVICES.map((s) => (
            <div
              key={s.title}
              onClick={() => navigate(`/explore?category=${encodeURIComponent(s.category)}`)}
              className="bg-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-4 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="bg-primary/20 size-10 rounded-xl flex items-center justify-center">
                <Icon name={s.icon} className="text-primary" />
              </div>
              <div>
                <p className="text-white text-lg font-bold">{s.title}</p>
                <p className="text-gray-400 text-sm font-medium">Starts at {s.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular services from API */}
      {services.length > 0 && (
        <>
          <div className="px-6 flex items-center justify-between max-w-md mx-auto">
            <h2 className="text-white text-2xl font-black tracking-tight">Popular This Week</h2>
          </div>
          <section className="max-w-md mx-auto p-6">
            <div className="flex flex-col gap-4">
              {services.slice(0, 2).map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/service/${s.id}`)}
                  className="bg-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="size-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Icon name={s.icon ?? "cleaning_services"} className="text-white text-[24px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{s.title}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Icon name="star" className="text-yellow-400 text-[14px]" filled />
                      {s.rating.toFixed(1)} • From ${s.base_price}
                    </p>
                  </div>
                  <Icon name="chevron_right" className="text-gray-500" />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* How It Works */}
      <section className="px-6 py-12 max-w-md mx-auto">
        <h2 className="text-white text-2xl font-black tracking-tight mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "1", title: "Choose a Service", desc: "Browse through dozens of categories and find the right professional for your needs.", color: "border-primary text-primary" },
            { n: "2", title: "Pick Your Time", desc: "Select a date and time that fits your busy schedule. Real-time availability guaranteed.", color: "border-secondary text-secondary" },
            { n: "3", title: "Relax & Hustle", desc: "Let our pros handle the heavy lifting while you focus on what you do best.", color: "border-primary text-primary" },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-4 items-start">
              <div className={`size-12 rounded-full border-2 ${step.color} flex items-center justify-center`}>
                <span className="font-black text-xl">{step.n}</span>
              </div>
              <h3 className="text-white text-xl font-bold">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-12">
        <div className="rounded-3xl gradient-bg p-8 text-center">
          <h3 className="text-white text-2xl font-black mb-2">Ready to get started?</h3>
          <p className="text-white/80 text-base mb-6">Book your first service in under 60 seconds.</p>
          <button
            onClick={() => navigate(user ? "/explore" : "/login")}
            className="bg-white text-black font-bold py-4 px-10 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
          >
            {user ? "Book First Service" : "Get Started"}
          </button>
        </div>
      </section>

      {/* Bottom spacer for nav */}
      <div className="h-24"></div>
    </div>
  );
}