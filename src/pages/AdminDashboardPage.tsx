import { useEffect, useState } from "react";
import { Icon, currency, StatusBadge } from "@/components/ui/icon";
import { useRouter } from "@/lib/router";
import { api, type Booking, type Vendor } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AdminStats {
  bookings: number;
  revenue: number;
  pendingVendors: number;
  users: number;
  services: number;
  pendingBookings: number;
  byStatus: { status: string; n: number }[];
  byCategory: { category: string; n: number }[];
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { navigate } = useRouter();

  useEffect(() => {
    api.adminStats().then(setStats).catch(() => {});
    api.adminBookings().then(setBookings).catch(() => {});
  }, []);

  const statCards = stats
    ? [
        { label: "Total Bookings", value: stats.bookings.toLocaleString(), change: "+12%", pct: 70 },
        { label: "Revenue", value: currency(stats.revenue), change: "+8%", pct: 45 },
        { label: "New Applications", value: stats.pendingVendors.toString(), change: "+5%", pct: 30 },
      ]
    : [];

  return (
    <div className="max-w-md mx-auto min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center bg-black px-4 py-4 justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={() => (window.location.hash = "/")} className="text-primary flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon name="menu" />
          </button>
          <h2 className="text-white text-lg font-bold tracking-tight uppercase">MAID 2 HUSTLE</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative flex size-10 items-center justify-center rounded-full bg-[#1f2937] text-white">
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary"></span>
          </button>
          <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </header>

      <main className="pb-8">
        {/* Stats */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 rounded-xl p-5 bg-[#1f2937] shadow-sm border border-gray-800">
              <div className="flex justify-between items-start">
                <p className="text-gray-400 text-sm font-medium">{s.label}</p>
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold">{s.change}</span>
              </div>
              <p className="text-white tracking-tight text-3xl font-bold leading-tight">{s.value}</p>
              <div className="mt-2 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${s.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        {stats && stats.byCategory.length > 0 && (
          <div className="px-4 py-2">
            <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
              <h3 className="text-white font-bold text-sm mb-3">Bookings by Category</h3>
              <div className="space-y-2">
                {stats.byCategory.slice(0, 5).map((c) => {
                  const max = stats.byCategory[0]?.n ?? 1;
                  return (
                    <div key={c.category} className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs w-20">{c.category}</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full gradient-bg" style={{ width: `${(c.n / max) * 100}%` }}></div>
                      </div>
                      <span className="text-white text-xs font-bold">{c.n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent bookings */}
        <div className="px-4 py-2 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold tracking-tight">Recent Bookings</h2>
          <button onClick={() => navigate("/admin/bookings")} className="text-primary text-sm font-semibold">
            View All
          </button>
        </div>
        <div className="px-4 space-y-2">
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="flex items-center gap-4 bg-[#1f2937] px-4 py-3 rounded-xl border border-gray-800 shadow-sm">
              <div className="size-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold shrink-0">
                {b.customer_name?.[0] ?? "C"}
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <p className="text-white text-base font-semibold leading-none mb-1 truncate">{b.customer_name}</p>
                <p className="text-gray-400 text-xs font-medium truncate">
                  {b.service_title} • {b.start_time} {b.date}
                </p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="px-4 pt-8">
          <h2 className="text-white text-xl font-bold tracking-tight mb-4">CMS Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickLink onClick={() => navigate("/admin/services")} icon="cleaning_services" label="Services" primary />
            <QuickLink onClick={() => navigate("/admin/vendors")} icon="groups" label="Providers" />
            <QuickLink onClick={() => navigate("/admin/bookings")} icon="article" label="Bookings" />
            <QuickLink onClick={() => navigate("/admin/earnings")} icon="settings" label="Earnings" />
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickLink({ onClick, icon, label, primary }: { onClick: () => void; icon: string; label: string; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-2xl transition-transform active:scale-[0.98]",
        primary ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-[#1f2937] text-white border border-gray-800",
      )}
    >
      <Icon name={icon} className="text-3xl mb-2" />
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}