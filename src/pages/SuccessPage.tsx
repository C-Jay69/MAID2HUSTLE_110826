import { useEffect, useState } from "react";
import { Icon, formatDateTime } from "@/components/ui/icon";
import { useRouter } from "@/lib/router";
import { api, type Booking } from "@/lib/api";

export function SuccessPage() {
  const { params } = useRouter();
  const bookingId = Number(params.booking);
  const tx = params.tx ?? "";
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    api
      .bookings()
      .then((bs) => setBooking(bs.find((b) => b.id === bookingId) ?? null))
      .catch(() => {});
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Icon name="bolt" className="text-[22px]" />
          </div>
          <span className="text-xl font-black tracking-tight uppercase">
            Maid <span className="gradient-text">2 Hustle</span>
          </span>
        </div>
        <button onClick={() => (window.location.hash = "/")} className="size-10 flex items-center justify-center rounded-full hover:bg-primary/10">
          <Icon name="close" className="text-[24px]" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 max-w-xl mx-auto w-full text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center size-24 bg-white rounded-full border border-primary/30 shadow-[0_0_40px_rgba(0,163,76,0.3)]">
            <Icon name="check_circle" className="text-primary text-6xl" filled />
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight gradient-text pb-2">Booking Confirmed!</h1>
        <p className="text-ink/50 text-sm font-medium tracking-wider mb-8">BOOKING ID: {booking?.booking_ref ?? `BK-${bookingId}`}</p>

        {booking && (
          <div className="w-full mb-10">
            <div className="rounded-2xl bg-white border border-line p-5 shadow-sm text-left">
              <div className="flex flex-col gap-2">
                <p className="text-ink/40 text-xs font-semibold uppercase tracking-tighter">Service Summary</p>
                <p className="text-ink text-lg font-bold leading-tight">{booking.service_title}</p>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <Icon name="calendar_today" className="text-[18px]" />
                    <span>{formatDateTime(booking.date, booking.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <Icon name="person" className="text-[18px]" />
                    <span>{booking.vendor_name} • ${booking.total}</span>
                  </div>
                </div>
                {tx && <p className="text-ink/40 text-[10px] uppercase tracking-wider mt-2">Transaction: {tx}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="w-full space-y-3 max-w-sm">
          <button
            onClick={() => (window.location.hash = "/bookings")}
            className="w-full gradient-bg font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]"
          >
            View Booking
          </button>
          <button
            onClick={() => (window.location.hash = `/tracking?booking=${bookingId}`)}
            className="w-full bg-white border border-line font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:border-primary/60 transition-colors"
          >
            <Icon name="near_me" className="text-[20px] text-primary" />
            Track Live Service
          </button>
        </div>
      </div>
    </div>
  );
}