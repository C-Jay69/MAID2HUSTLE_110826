import { useEffect, useMemo, useState } from "react";
import { Icon, StatusBadge, formatDateTime, currency } from "@/components/ui/icon";
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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">{isProvider ? "My Jobs" : "Your Bookings"}</h1>
        <p className="text-ink/50 text-sm mt-1">Track, manage, and review your scheduled services.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white border border-line rounded-xl w-full sm:w-80 mb-6">
        <button
          onClick={() => setTab("upcoming")}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
            tab === "upcoming" ? "bg-primary text-white shadow-sm" : "text-ink/50 hover:text-primary",
          )}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("past")}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
            tab === "past" ? "bg-primary text-white shadow-sm" : "text-ink/50 hover:text-primary",
          )}
        >
          Past
        </button>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
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
      </div>
    </div>
  );
}

export function BookingCard({ booking, provider = false }: { booking: Booking; provider?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-20 gradient-bg-deep relative flex items-center justify-center">
        <Icon name={booking.service_icon ?? "cleaning_services"} className="text-[40px] opacity-90" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <StatusBadge status={booking.status} />
          <span className="text-xs text-ink/40 font-medium">{booking.booking_ref}</span>
        </div>
        <h3 className="text-ink text-lg font-bold leading-tight">{booking.service_title}</h3>
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center gap-2 text-ink/60">
            <Icon name="person" className="text-sm" />
            <p className="text-sm font-medium">{provider ? (booking.customer_name ?? "Customer") : booking.vendor_name}</p>
          </div>
          <div className="flex items-center gap-2 text-ink/60">
            <Icon name="calendar_today" className="text-sm" />
            <p className="text-sm font-medium">{formatDateTime(booking.date, booking.start_time)}</p>
          </div>
          <div className="flex items-center gap-2 text-ink/60">
            <Icon name="payments" className="text-sm" />
            <p className="text-sm font-medium">{currency(booking.total)}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => (window.location.hash = `/tracking?booking=${booking.id}`)}
            className="flex-1 rounded-lg h-10 bg-page text-ink text-sm font-bold border border-line hover:border-primary/50 transition-all"
          >
            {booking.status === "confirmed" ? "Track" : booking.status === "pending" ? "Pending" : "Details"}
          </button>
          {booking.status === "pending" && !provider && (
            <button
              onClick={async () => {
                await api.updateBookingStatus(booking.id, "cancelled").catch(() => {});
                window.location.reload();
              }}
              className="flex-1 rounded-lg h-10 bg-transparent text-red-500 text-sm font-bold border border-red-300 hover:border-red-500/60 transition-all"
            >
              Cancel
            </button>
          )}
          {booking.status === "completed" && !provider && (
            <button
              onClick={() => (window.location.hash = `/rate?booking=${booking.id}`)}
              className="flex-1 rounded-lg h-10 gradient-bg text-sm font-bold shadow-lg shadow-primary/20 transition-all"
            >
              Rate Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}