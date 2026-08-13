import { Icon, StarRating, currency } from "@/components/ui/icon";
import { navigate } from "@/lib/router";
import type { Service } from "@/lib/api";

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <div
      onClick={() => navigate(`/service/${service.id}`)}
      className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden bg-white border border-line shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] cursor-pointer"
    >
      <div className="relative w-full aspect-[16/9] gradient-bg-deep flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-black"></div>
        <Icon name={service.icon ?? "cleaning_services"} className="text-[72px] opacity-90" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
          <Icon name="star" className="text-yellow-500 text-[16px]" filled />
          <span className="text-ink text-xs font-bold tracking-tighter">
            {service.rating.toFixed(1)} ({service.reviews})
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow-sm">
          <Icon name="favorite" className="text-primary text-[20px]" filled />
        </div>
      </div>
      <div className="flex w-full flex-col p-4 gap-2">
        <div className="space-y-1">
          <p className="text-ink text-lg font-bold leading-tight tracking-tight">{service.title}</p>
          {!compact && <p className="text-ink/60 text-sm leading-relaxed line-clamp-2">{service.description}</p>}
        </div>
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-line">
          <div className="flex flex-col">
            <span className="text-[10px] text-ink/40 uppercase font-bold tracking-widest">Starting from</span>
            <span className="text-primary text-xl font-bold">{currency(service.base_price)}</span>
          </div>
          <button className="flex items-center justify-center gap-1 rounded-xl h-10 px-4 gradient-bg text-sm font-bold shadow-lg shadow-primary/20">
            Book Now
            <Icon name="arrow_forward_ios" className="text-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 border transition-colors ${
        active ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-line hover:border-primary/60 text-ink/70 hover:text-primary"
      }`}
    >
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

export function ProviderAvatar({ name, size = "h-12 w-12", online }: { name: string; size?: string; online?: boolean }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className={`relative ${size} rounded-full gradient-bg flex items-center justify-center font-black text-sm shrink-0`}>
      {initials}
      {online && <span className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon name={icon} className="text-primary text-[32px]" />
      </div>
      <h3 className="text-ink text-lg font-bold mb-1">{title}</h3>
      <p className="text-ink/60 text-sm">{subtitle}</p>
    </div>
  );
}
