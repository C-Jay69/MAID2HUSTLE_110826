import { Icon, StarRating, currency } from "@/components/ui/icon";
import { navigate } from "@/lib/router";
import type { Service } from "@/lib/api";

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <div
      onClick={() => navigate(`/service/${service.id}`)}
      className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-[#2a2a2a] transition-all active:scale-[0.98] cursor-pointer"
    >
      <div className="relative w-full aspect-[16/9] gradient-bg-deep flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-black"></div>
        <Icon name={service.icon ?? "cleaning_services"} className="text-white text-[64px] drop-shadow-2xl" />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 border border-white/10">
          <Icon name="star" className="text-primary text-[16px]" filled />
          <span className="text-white text-xs font-bold tracking-tighter">
            {service.rating.toFixed(1)} ({service.reviews})
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-lg shadow-primary/40">
          <Icon name="favorite" className="text-white text-[20px]" filled />
        </div>
      </div>
      <div className="flex w-full flex-col p-4 gap-2">
        <div className="space-y-1">
          <p className="text-white text-lg font-bold leading-tight tracking-tight">{service.title}</p>
          {!compact && <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{service.description}</p>}
        </div>
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Starting from</span>
            <span className="text-primary text-xl font-bold">{currency(service.base_price)}</span>
          </div>
          <button className="flex items-center justify-center gap-1 rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
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
      className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${
        active ? "bg-primary shadow-lg shadow-primary/20" : "bg-[#2a2a2a] border border-white/5 hover:border-primary/50"
      }`}
    >
      <p className={`text-sm font-semibold ${active ? "text-white" : "text-white/80"}`}>{label}</p>
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
    <div className={`relative ${size} rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-black text-white text-lg shrink-0`}>
      {initials}
      {online && (
        <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-black"></span>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon name={icon} className="text-primary text-[32px]" />
      </div>
      <h3 className="text-white text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}