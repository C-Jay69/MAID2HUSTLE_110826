import { useEffect, useState } from "react";
import { Icon, formatDateTime, currency } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useRouter } from "@/lib/router";
import { api, type Booking } from "@/lib/api";
import { cn } from "@/lib/utils";

export function CheckoutPage() {
  const { params } = useRouter();
  const bookingId = Number(params.booking);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .bookings()
      .then((bs) => setBooking(bs.find((b) => b.id === bookingId) ?? null))
      .catch(() => {});
  }, [bookingId]);

  if (!booking) {
    return (
      <div>
        <TopBar title="Secure Checkout" back="/explore" />
        <div className="py-20 text-center text-gray-400">Loading booking...</div>
      </div>
    );
  }

  const fee = Math.round(booking.total * 0.05);
  const total = booking.total + fee;

  const pay = async () => {
    if (method === "card" && (!card.number.trim() || !card.name.trim() || !card.expiry.trim() || !card.cvv.trim())) {
      setError("Please complete all card fields.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const { payment } = await api.checkout({ booking_id: booking.id, method });
      window.location.hash = `/success?booking=${booking.id}&tx=${payment.transactionId}`;
    } catch (e) {
      setError((e as Error).message);
      setProcessing(false);
    }
  };

  return (
    <div className="pb-32">
      <TopBar title="Secure Checkout" back="/details" right={<Icon name="lock" />} />

      {/* Summary card */}
      <div className="px-4 pt-2 mb-4">
        <div className="bg-[#2a2a2a] rounded-xl overflow-hidden border border-white/5">
          <div className="h-40 gradient-bg-deep relative flex items-center justify-center">
            <Icon name={booking.service_icon ?? "cleaning_services"} className="text-white text-[56px]" />
          </div>
          <div className="p-4">
            <p className="text-white text-lg font-bold">{booking.service_title}</p>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <Icon name="calendar_today" className="text-sm" /> {formatDateTime(booking.date, booking.start_time)}
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <Icon name="person" className="text-sm" /> {booking.vendor_name} ⭐ {booking.vendor_rating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="px-4 mb-6">
        <div className="bg-[#2a2a2a] rounded-xl p-4 border border-white/5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">{currency(booking.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Trust & Support Fee</span>
              <span className="text-white font-medium">{currency(fee)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-white font-bold">Total Due</span>
              <span className="text-white font-bold text-lg">{currency(total)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <Icon name="verified_user" className="text-emerald-400 text-[18px]" />
            <p className="text-emerald-300 text-xs font-semibold">Trust & Safety Guarantee — insured up to $1,000</p>
          </div>
        </div>
      </div>

      {/* Express checkout */}
      <h3 className="text-white text-lg font-bold px-4 pb-2 pt-2">Express Checkout</h3>
      <div className="px-4 space-y-2 mb-5">
        {[
          { id: "apple_pay", label: "Apple Pay", icon: "settings" },
          { id: "paypal", label: "PayPal", icon: "account_balance_wallet" },
          { id: "card", label: "Credit / Debit Card", icon: "credit_card" },
        ].map((m) => (
          <div
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "flex items-center gap-4 bg-[#2a2a2a] px-4 min-h-[60px] justify-between rounded-xl border transition-colors cursor-pointer",
              method === m.id ? "border-primary bg-primary/5" : "border-white/5",
            )}
          >
            <div className="flex items-center gap-3">
              <Icon name={m.icon} className="text-white text-[20px]" />
              <p className="text-white font-medium">{m.label}</p>
            </div>
            <div className={cn("size-6 rounded-full border-2 flex items-center justify-center", method === m.id ? "border-primary bg-primary" : "border-gray-600")}>
              {method === m.id && <span className="size-2.5 bg-white rounded-full"></span>}
            </div>
          </div>
        ))}
      </div>

      {/* Card form */}
      {method === "card" && (
        <>
          <h3 className="text-white text-lg font-bold px-4 pb-2 pt-2">Credit Card Information</h3>
          <div className="px-4 space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-1.5">Cardholder Name</label>
              <input
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                placeholder="John Doe"
                className="w-full h-12 rounded-lg px-4 bg-[#2a2a2a] border border-white/10 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-1.5">Card Number</label>
              <div className="relative">
                <input
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  placeholder="0000 0000 0000 0000"
                  className="w-full h-12 rounded-lg px-4 bg-[#2a2a2a] border border-white/10 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <Icon name="credit_card" className="absolute right-4 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-1.5">Expiry (MM/YY)</label>
                <input
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  placeholder="MM / YY"
                  className="w-full h-12 rounded-lg px-4 bg-[#2a2a2a] border border-white/10 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-1.5">CVV</label>
                <div className="relative">
                  <input
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    placeholder="123"
                    type="password"
                    className="w-full h-12 rounded-lg px-4 bg-[#2a2a2a] border border-white/10 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <Icon name="help_outline" className="absolute right-4 top-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Trust badges */}
      <div className="flex justify-center items-center gap-6 opacity-60 mb-8">
        <div className="flex items-center gap-1.5">
          <Icon name="verified_user" className="text-lg" />
          <span className="text-xs font-semibold">SSL ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon name="shield_with_heart" className="text-lg" />
          <span className="text-xs font-semibold">SECURE STRIPE</span>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm px-4 mb-2">{error}</p>}

      {/* Footer */}
      <footer className="sticky bottom-0 bg-black p-4 pt-2 border-t border-white/10 ios-blur z-30">
        <p className="text-center text-[10px] text-gray-500 mb-3 px-4 uppercase tracking-widest font-bold">
          By tapping confirm, you agree to the MAID 2 HUSTLE terms of service.
        </p>
        <button
          onClick={pay}
          disabled={processing}
          className="gradient-bg w-full h-14 rounded-xl text-white font-bold text-lg shadow-[0_8px_30px_rgb(168,85,247,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {processing ? "Processing..." : "Pay & Confirm Booking"}
          <Icon name="chevron_right" />
        </button>
      </footer>
    </div>
  );
}