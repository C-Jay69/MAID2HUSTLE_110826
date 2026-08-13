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
    <div className="relative flex h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto border-x border-gray-800/20">
      {/* Top */}
      <div className="flex items-center bg-black p-4 pb-2 justify-between">
        <div className="text-white flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined cursor-pointer" onClick={() => (window.location.hash = "/")}>
            close
          </span>
        </div>
        <h2 className="text-white text-sm font-bold tracking-widest flex-1 text-center pr-12 uppercase">MAID 2 HUSTLE</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center size-24 bg-primary/10 rounded-full border border-primary/30 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
            <Icon name="check_circle" className="text-primary text-6xl" filled />
          </div>
        </div>
        <h1 className="text-gradient text-[36px] font-bold leading-tight pb-2 text-transparent" style={{ backgroundImage: "linear-gradient(to bottom right, #a855f7, #c084fc)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
          Booking Confirmed!
        </h1>
        <p className="text-gray-400 text-sm font-medium tracking-wider mb-8">BOOKING ID: {booking?.booking_ref ?? `BK-${bookingId}`}</p>

        {booking && (
          <div className="w-full mb-10">
            <div className="flex items-stretch justify-between gap-4 rounded-xl bg-[#121212] border border-gray-800 p-5 shadow-xl text-left">
              <div className="flex flex-col gap-2 flex-grow">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-tighter">Service Summary</p>
                <p className="text-white text-lg font-bold leading-tight">{booking.service_title}</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-primary/80 text-sm">
                    <Icon name="calendar_today" className="text-[18px]" />
                    <span>{formatDateTime(booking.date, booking.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary/80 text-sm">
                    <Icon name="person" className="text-[18px]" />
                    <span>{booking.vendor_name} • ${booking.total}</span>
                  </div>
                </div>
                {tx && <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-1">Transaction: {tx}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="w-full space-y-4">
          <button
            onClick={() => (window.location.hash = "/bookings")}
            className="w-full gradient-bg hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            View Booking
          </button>
          <button
            onClick={() => (window.location.hash = "/tracking")}
            className="w-full bg-transparent border border-gray-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
          >
            <Icon name="near_me" className="text-[20px]" />
            Track Live Service
          </button>
        </div>
      </div>

      <div className="p-8 flex justify-center opacity-40">
        <div className="h-1 w-32 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
}