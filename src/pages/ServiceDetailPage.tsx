import { useEffect, useState } from "react";
import { Icon, StarRating, currency } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { ProviderAvatar } from "@/components/service-card";
import { useRouter } from "@/lib/router";
import { api, type Service, type Vendor } from "@/lib/api";
import { cn } from "@/lib/utils";

const TIERS = [
  { name: "Basic", desc: "Essential maintenance", price: 1, features: ["Essential cleaning & care", "Standard materials"] },
  { name: "Standard", desc: "Deep room refresh", price: 1.3, features: ["Everything in Basic", "Priority scheduling", "Premium materials"] },
  { name: "Premium", desc: "Total home sanitization", price: 1.7, features: ["Everything in Standard", "Same-week guarantee", "2 follow-up visits"] },
];

export function ServiceDetailPage() {
  const { params } = useRouter();
  const id = Number(params.id);
  const [service, setService] = useState<Service | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [tier, setTier] = useState(1);

  useEffect(() => {
    api.service(id).then((s) => {
      setService(s);
      setVendors(s.vendors ?? []);
    }).catch(() => setService(null));
  }, [id]);

  if (!service) {
    return (
      <div>
        <TopBar title="Service Details" back="/explore" />
        <div className="py-20 text-center text-gray-400">Service not found</div>
      </div>
    );
  }

  const selected = vendors.find((v) => v.id === selectedVendor) ?? vendors[0];
  const price = Math.round(service.base_price * TIERS[tier]!.price);

  return (
    <div className="relative flex flex-col min-h-screen pb-28">
      <TopBar title="Service Details" back="/explore" right={<Icon name="share" className="text-white" />} />

      {/* Hero */}
      <div className="relative">
        <div className="h-80 w-full gradient-bg-deep relative flex flex-col justify-end overflow-hidden">
          <Icon name={service.icon ?? "cleaning_services"} className="absolute inset-0 m-auto text-white text-[120px] opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="p-5 flex flex-col gap-1.5 relative">
            <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">
              {service.popular ? "Most Popular" : service.category}
            </span>
            <h1 className="text-white text-[32px] font-extrabold leading-tight gradient-text-white">{service.title}</h1>
            <div className="flex items-center gap-2">
              <StarRating rating={service.rating} />
              <span className="text-gray-400 text-sm">{service.reviews} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pt-6">
        <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-2">The Mission</h3>
        <p className="text-gray-300 text-base font-normal leading-relaxed">{service.description}</p>
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
          <Icon name="schedule" className="text-[16px]" />
          <span>Approx. {service.duration_hours} hours</span>
        </div>
      </div>

      {/* Providers */}
      {vendors.length > 0 && (
        <div className="mt-6 px-5">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Choose Your Specialist</h3>
          <div className="flex flex-col gap-3">
            {vendors.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVendor(v.id)}
                className={cn(
                  "flex items-center gap-4 bg-[#2a2a2a]/50 p-4 rounded-xl border transition-colors cursor-pointer",
                  selectedVendor === v.id ? "border-primary bg-primary/5" : "border-white/5",
                )}
              >
                <ProviderAvatar name={v.name} size="h-14 w-14" online />
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-white font-bold">{v.name}</p>
                    {!!v.verified && <Icon name="verified" className="text-primary text-[16px]" filled />}
                  </div>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Icon name="star" className="text-yellow-500 text-[14px]" filled />
                    {v.rating.toFixed(1)} • {v.jobs_done}+ jobs
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-bold">{currency(v.hourly_rate)}/hr</p>
                  <div className={cn("size-5 rounded-full border-2 mx-auto mt-1", selectedVendor === v.id ? "border-primary bg-primary" : "border-gray-600")}>
                    {selectedVendor === v.id && <span className="block size-2.5 bg-white rounded-full m-auto mt-0.5"></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Tiers */}
      <div className="mt-8 px-5 pb-4">
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Pricing Tiers</h3>
        <div className="flex flex-col gap-4">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              onClick={() => setTier(i)}
              className={cn(
                "bg-[#2a2a2a] p-5 rounded-xl border relative overflow-hidden transition-colors cursor-pointer",
                i === 1 ? "border-2 border-primary" : "border-white/5",
              )}
            >
              {i === 1 && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tight">
                  Best Value
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white text-lg font-bold">{t.name}</h4>
                  <p className="text-gray-400 text-sm">{t.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{currency(Math.round(service.base_price * t.price))}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Icon name="check_circle" className="text-primary text-[18px]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-black/80 ios-blur border-t border-white/5 pb-8 z-30">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm text-gray-400">
            {TIERS[tier]?.name} • {selected?.name}
          </span>
          <span className="text-xl font-bold text-white">{currency(price)}</span>
        </div>
        <button
          onClick={() => (window.location.hash = `/schedule?service=${service.id}&vendor=${selected?.id ?? 1}`)}
          className="w-full gradient-bg hover:opacity-90 active:scale-[0.98] transition-all text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          Book This Service
          <Icon name="calendar_today" />
        </button>
      </div>
    </div>
  );
}