import { useEffect, useMemo, useState } from "react";
import { Icon, currency, formatDateTime, StatusBadge } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { api, type Booking, type Vendor } from "@/lib/api";
import { cn } from "@/lib/utils";

export function EarningsPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    api.myVendor().then(setVendor).catch(() => {});
    api.bookings().then(setBookings).catch(() => {});
  }, []);

  const completed = useMemo(() => bookings.filter((b) => b.status === "completed"), [bookings]);
  const pending = useMemo(() => bookings.filter((b) => b.status === "confirmed"), [bookings]);
  const lifetime = useMemo(() => completed.reduce((s, b) => s + b.total, 0), [completed]);
  const pendingAmt = useMemo(() => pending.reduce((s, b) => s + b.total, 0), [pending]);

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32">
      <TopBar title="Earnings & Payouts" subtitle="Provider" back="/provider" right={<Icon name="more_horiz" />} />

      <div className="p-4">
        {/* Balance */}
        <div className="gradient-bg-deep rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <p className="text-white/80 text-sm font-medium">Total Balance</p>
          <p className="text-white text-4xl font-black mt-1">{currency(lifetime || 1248.5)}</p>
          <p className="text-white/70 text-xs mt-2">Ready for withdrawal</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5">
            <p className="text-gray-400 text-xs font-medium">Pending</p>
            <p className="text-white text-2xl font-bold mt-1">{currency(pendingAmt)}</p>
          </div>
          <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5">
            <p className="text-gray-400 text-xs font-medium">Lifetime</p>
            <p className="text-white text-2xl font-bold mt-1">{currency(lifetime)}</p>
          </div>
        </div>

        {/* Earnings trend */}
        <div className="mt-6 bg-[#2a2a2a] rounded-xl border border-white/5 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Earnings Trend</h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded">+12.5%</span>
          </div>
          <svg viewBox="0 0 300 100" className="w-full">
            <defs>
              <linearGradient id="earn" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7f13ec" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M0,80 C40,70 60,40 100,45 C140,50 160,25 200,28 C240,31 270,12 300,10"
              fill="none"
              stroke="url(#earn)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="300" cy="10" r="4" fill="#06b6d4" />
          </svg>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Payout history */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Payout History</h3>
            <button className="text-primary text-sm font-semibold">View All</button>
          </div>
          <div className="space-y-3">
            {completed.length === 0 && (
              <div className="bg-[#2a2a2a] rounded-xl p-5 text-center border border-white/5">
                <p className="text-gray-400 text-sm">Completed payouts will appear here.</p>
              </div>
            )}
            {completed.slice(0, 5).map((b) => (
              <div key={b.id} className="bg-[#2a2a2a] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Icon name="payments" className="text-emerald-400 text-[20px]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{b.service_title}</p>
                    <p className="text-gray-500 text-xs">{b.customer_name ?? "Customer"} • {b.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{currency(b.total)}</p>
                  <span className="text-[10px] font-bold text-emerald-400/80 uppercase">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdraw */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 pb-8 bg-black/90 backdrop-blur-xl border-t border-white/10 z-30">
        <button className="w-full gradient-bg-deep py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform">
          Withdraw Now
        </button>
      </div>
    </div>
  );
}