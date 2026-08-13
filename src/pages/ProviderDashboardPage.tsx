import { useEffect, useMemo, useState } from "react";
import { Icon, formatDateTime, currency } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { ProviderAvatar } from "@/components/service-card";
import { useAuth } from "@/lib/auth";
import { api, type Booking, type Vendor } from "@/lib/api";

export function ProviderDashboardPage() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.myVendor().then(setVendor).catch(() => {});
    api.bookings().then(setBookings).catch(() => {});
  }, []);

  const upcoming = useMemo(() => bookings.filter((b) => ["pending", "confirmed"].includes(b.status)), [bookings]);
  const completed = useMemo(() => bookings.filter((b) => b.status === "completed"), [bookings]);
  const earnings = useMemo(() => completed.reduce((sum, b) => sum + b.total, 0), [completed]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-line">
        <div className="flex items-center p-4 justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-ink/50">Welcome back,</span>
            <h1 className="text-lg font-bold leading-tight">{user?.name ?? "Provider"}</h1>
          </div>
          <div className="flex items-center gap-2 bg-page rounded-full px-3 py-1.5 border border-line">
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">Online</span>
            <div className="w-8 h-4 bg-green-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-32">
        {/* Earnings card */}
        <div className="mt-6">
          <div className="gradient-bg-deep rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-black/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-ink/80 text-sm font-medium">Earnings This Week</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold">{currency(earnings || 1248.5)}</span>
                <span className="text-ink/70 text-sm font-medium">+12% vs last week</span>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => (window.location.hash = "/provider/earnings")}
                  className="bg-black/10 hover:bg-black/20 transition-colors px-4 py-2 rounded-lg text-xs font-bold backdrop-blur-md"
                >
                  View Breakdown
                </button>
                <div className="flex -space-x-2">
                  <ProviderAvatar name={user?.name ?? "P"} size="w-8 h-8" />
                  <ProviderAvatar name="SJ" size="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="task_alt" className="text-secondary text-sm" />
              <span className="text-gray-400 text-xs font-medium">Total Jobs</span>
            </div>
            <p className="text-xl font-bold">{vendor?.jobs_done ?? completed.length}</p>
          </div>
          <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="star" className="text-yellow-400 text-sm" filled />
              <span className="text-gray-400 text-xs font-medium">Avg. Rating</span>
            </div>
            <p className="text-xl font-bold">{vendor?.rating?.toFixed(1) ?? "4.9"}</p>
          </div>
        </div>

        {/* Upcoming jobs */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Upcoming Jobs</h2>
            <button onClick={() => (window.location.hash = "/provider/jobs")} className="text-primary text-sm font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcoming.length === 0 && (
              <div className="bg-[#2a2a2a] rounded-xl p-6 text-center border border-white/5">
                <p className="text-gray-400 text-sm">No upcoming jobs yet. New bookings will appear here.</p>
              </div>
            )}
            {upcoming.slice(0, 3).map((b) => (
              <div key={b.id} className="bg-[#2a2a2a] rounded-xl p-4 border border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Icon name={b.service_icon ?? "cleaning_services"} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{b.service_title}</h3>
                      <p className="text-gray-400 text-sm">{b.customer_name ?? "Customer"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{b.start_time}</p>
                    <p className="text-gray-500 text-xs uppercase">{formatDateTime(b.date, "").split("@")[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Icon name="location_on" className="text-gray-500 text-sm" />
                  <span className="truncate">{b.address || "Address pending"}</span>
                </div>
                <div className="flex gap-2">
                  {b.status === "pending" && (
                    <button
                      onClick={async () => {
                        await api.updateBookingStatus(b.id, "confirmed").catch(() => {});
                        window.location.reload();
                      }}
                      className="flex-1 bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <Icon name="check" className="text-sm" /> Accept
                    </button>
                  )}
                  <button
                    onClick={() => (window.location.hash = `/tracking?booking=${b.id}`)}
                    className="flex-1 bg-page text-ink font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-line active:scale-[0.98] transition-transform"
                  >
                    <Icon name="near_me" className="text-sm" /> Navigate
                  </button>
                  {b.status === "confirmed" && (
                    <button
                      onClick={async () => {
                        await api.updateBookingStatus(b.id, "completed").catch(() => {});
                        window.location.reload();
                      }}
                      className="flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold py-3 rounded-xl active:scale-[0.98] transition-transform"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}