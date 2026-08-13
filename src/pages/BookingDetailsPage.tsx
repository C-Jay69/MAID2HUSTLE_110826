import { useEffect, useMemo, useState } from "react";
import { Icon, formatTime, addHours, currency } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useRouter } from "@/lib/router";
import { api, type Service, type Vendor } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function BookingDetailsPage() {
  const { params } = useRouter();
  const serviceId = Number(params.service);
  const vendorId = Number(params.vendor);
  const date = params.date ?? "";
  const start = params.start ?? "";
  const end = params.end ?? "";

  const [service, setService] = useState<Service | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (serviceId) api.service(serviceId).then(setService).catch(() => {});
    if (vendorId) api.vendor(vendorId).then(setVendor).catch(() => {});
  }, [serviceId, vendorId]);

  const price = useMemo(() => {
    if (!service) return 0;
    const duration = service.duration_hours || 2;
    const byService = service.base_price;
    const byVendor = (vendor?.hourly_rate ?? 30) * duration;
    return Math.round(Math.max(byService, byVendor));
  }, [service, vendor]);

  const fee = Math.round(price * 0.05);
  const total = price + fee;
  const endTime = end || addHours(start, service?.duration_hours ?? 2);

  const submit = async () => {
    if (!address.trim()) {
      setError("Please enter your service address.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const booking = await api.createBooking({
        service_id: serviceId,
        vendor_id: vendorId,
        date,
        start_time: start,
        end_time: endTime,
        address: address.trim(),
        notes: notes.trim(),
      });
      window.location.hash = `/checkout?booking=${booking.id}`;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="pb-36">
      <TopBar title="Booking Details" back={`/schedule?service=${serviceId}&vendor=${vendorId}`} right={<Icon name="lock" />} />

      {/* Progress */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-wider">Step 3 of 4</p>
            <h1 className="text-2xl font-bold leading-tight">Your Details</h1>
          </div>
          <p className="text-gray-400 text-sm font-medium">75% Complete</p>
        </div>
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: "75%" }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-500 mt-1">
          <span>Service</span>
          <span className="text-primary">Schedule</span>
          <span className="text-primary">Details</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 mb-2">
        <div className="bg-[#1e132b] rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Icon name={service?.icon ?? "cleaning_services"} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Selected Service</p>
              <p className="font-semibold">{service?.title ?? "Loading..."}</p>
            </div>
          </div>
          <button
            onClick={() => (window.location.hash = `/schedule?service=${serviceId}&vendor=${vendorId}`)}
            className="text-xs font-bold text-secondary"
          >
            CHANGE
          </button>
        </div>
      </div>

      {/* Schedule confirmation */}
      <div className="px-4 mt-4">
        <div className="bg-[#1e132b] rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="calendar_today" className="text-primary text-[20px]" />
            <div>
              <p className="text-xs text-slate-400">Scheduled</p>
              <p className="font-semibold text-sm">
                {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="schedule" className="text-primary text-[20px]" />
            <div>
              <p className="text-xs text-slate-400">Time</p>
              <p className="font-semibold text-sm">
                {formatTime(start)} • {service?.duration_hours ?? 2} hours ({formatTime(endTime)})
              </p>
            </div>
          </div>
          {vendor && (
            <div className="flex items-center gap-3 mt-3">
              <Icon name="person" className="text-primary text-[20px]" />
              <div>
                <p className="text-xs text-slate-400">Your Professional</p>
                <p className="font-semibold text-sm">{vendor.name} ⭐ {vendor.rating.toFixed(1)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="px-4 mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-400 block mb-2">Service Address *</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="1248 North Maple Ave, Apt 4B"
            className="w-full h-12 rounded-xl bg-[#111] border border-slate-800 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400 block mb-2">Notes for your pro (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Gate code, parking instructions, pets at home, etc."
            rows={3}
            className="w-full rounded-xl bg-[#111] border border-slate-800 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Price breakdown */}
        <div className="bg-[#1e132b] rounded-xl p-4 border border-slate-800 mt-2">
          <p className="text-sm font-bold text-white mb-3">Price Breakdown</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{service?.title ?? "Service"}</span>
              <span className="text-white font-medium">{currency(price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Trust & Support Fee</span>
              <span className="text-white font-medium">{currency(fee)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold text-lg">{currency(total)}</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 p-4 pb-8 bg-black/90 backdrop-blur-xl border-t border-slate-800">
        <button
          disabled={creating}
          onClick={submit}
          className="w-full py-4 rounded-xl gradient-bg text-white font-bold text-lg shadow-lg shadow-primary/40 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {creating ? "Creating booking..." : `CONTINUE TO PAYMENT`}
          <Icon name="arrow_forward" className="text-xl" />
        </button>
      </div>
    </div>
  );
}