import { useEffect, useMemo, useState } from "react";
import { Icon, StatusBadge, formatDateTime, currency } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { EmptyState } from "@/components/service-card";
import { useAuth } from "@/lib/auth";
import { api, type Booking } from "@/lib/api";
import { cn } from "@/lib/utils";

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isProvider = user?.role === "vendor";

  useEffect(() => {
    api
      .bookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const up: Booking[] = [];
    const pa: Booking[] = [];
    for (const b of bookings) {
      const when = new Date(`${b.date}T${b.start_time}`);
      if (b.status === "completed" || b.status === "cancelled" || when < now) pa.push(b);
      else up.push(b);
    }
    up.sort((a, b) => a.date.localeCompare(b.date));
    pa.sort((a, b) => b.date.localeCompare(a.date));
    return { upcoming: up, past: pa };
  }, [bookings]);

  const active = tab === "upcoming" ? upcoming : past;

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-black/80 ios-blur pt-4 pb-4 px-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight flex-1 text-center">
            {isProvider ? "My Jobs" : "Your Booking History"}
          </h1>
        </div>
        {/* Tabs */}
        <div className="flex p-1 bg-[#2a2a2a] rounded-xl mt-4">
          <button
            onClick={() => setTab("upcoming")}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
              tab === "upcoming" ? "bg-primary text-white shadow-sm" : "text-gray-400",
            )}
          >
            {isProvider ? "Upcoming" : "Upcoming"}
          </button>
          <button
            onClick={() => setTab("past")}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
              tab === "past" ? "bg-primary text-white shadow-sm" : "text-gray-400",
            )}
          >
            Past
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : active.length === 0 ? (
          <EmptyState
            icon="event_available"
            title={tab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
            subtitle={isProvider ? "New jobs will appear here when customers book you." : "Browse services and book your first home pro."}
          />
        ) : (
          active.map((b) => <BookingCard key={b.id} booking={b} provider={isProvider} />)
        )}
      </main>
    </div>
  );
}

export function BookingCard({ booking, provider = false }: { booking: Booking; provider?: boolean }) {
  return (
    <div className="bg-[#2a2a2a] rounded-xl border border-white/5 shadow-xl overflow-hidden">
      <div className="h-24 gradient-bg-deep relative flex items-center justify-center">
        <Icon name={booking.service_icon ?? "cleaning_services"} className="text-white text-[40px] opacity-90" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <StatusBadge status={booking.status} />
          <span className="text-xs text-gray-400 font-medium">{booking.booking_ref}</span>
        </div>
        <h3 className="text-white text-lg font-bold leading-tight">{booking.service_title}</h3>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Icon name="person" className="text-sm" />
            <p className="text-sm font-medium">{provider ? (booking.customer_name ?? "Customer") : booking.vendor_name}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Icon name="calendar_today" className="text-sm" />
            <p className="text-sm font-medium">{formatDateTime(booking.date, booking.start_time)}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Icon name="payments" className="text-sm" />
            <p className="text-sm font-medium">{currency(booking.total)}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => (window.location.hash = `/tracking?booking=${booking.id}`)}
            className="flex-1 rounded-lg h-10 bg-white/10 text-white text-sm font-bold border border-white/10 hover:border-primary/50 transition-all"
          >
            {booking.status === "confirmed" ? "Track" : booking.status === "pending" ? "Pending" : "Details"}
          </button>
          {booking.status === "pending" && !provider && (
            <button
              onClick={async () => {
                await api.updateBookingStatus(booking.id, "cancelled").catch(() => {});
                window.location.reload();
              }}
              className="flex-1 rounded-lg h-10 bg-transparent text-red-400 text-sm font-bold border border-red-500/30 hover:border-red-500/60 transition-all"
            >
              Cancel
            </button>
          )}
          {booking.status === "completed" && !provider && (
            <button
              onClick={() => (window.location.hash = `/rate?booking=${booking.id}`)}
              className="flex-1 rounded-lg h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all"
            >
              Rate Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}