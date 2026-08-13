import { useEffect, useState } from "react";
import { Icon, StatusBadge, currency } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { api, type Booking, type Vendor } from "@/lib/api";

export function AdminVendorsPage() {
  const [vendors, setVendors] = useState<(Vendor & { user_name: string; user_email: string })[]>([]);

  const load = () => api.adminVendors().then(setVendors).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const approve = async (id: number, approved: boolean) => {
    await api.approveVendor(id, approved).catch(() => {});
    load();
  };

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Provider Management" back="/admin" />
      <main className="p-4 space-y-3 pb-24">
        {vendors.map((v) => (
          <div key={v.id} className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                {v.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold truncate">{v.name}</p>
                  {!!v.verified && <Icon name="verified" className="text-primary text-[15px]" filled />}
                </div>
                <p className="text-gray-400 text-xs">{v.service_type} • {currency(v.hourly_rate)}/hr</p>
                <p className="text-gray-500 text-xs truncate">{v.user_email}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  v.approved ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {v.approved ? "Approved" : "Pending"}
              </span>
            </div>
            {v.bio && <p className="text-gray-400 text-sm mt-3 line-clamp-2">{v.bio}</p>}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Icon name="star" className="text-yellow-400 text-[15px]" filled />
                <span className="font-bold">{v.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Icon name="work" className="text-[15px]" />
                {v.jobs_done} jobs
              </div>
            </div>
            {!v.approved && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => approve(v.id, true)}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-sm active:scale-[0.98] transition-transform"
                >
                  Approve
                </button>
                <button
                  onClick={() => approve(v.id, false)}
                  className="flex-1 bg-transparent border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    api.adminBookings().then(setBookings).catch(() => {});
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="All Bookings" back="/admin" />
      <main className="p-4 space-y-3 pb-24">
        {bookings.map((b) => (
          <div key={b.id} className="bg-[#1f2937] rounded-xl border border-gray-800 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{b.service_title}</p>
                <p className="text-gray-400 text-xs">
                  {b.customer_name} → {b.vendor_name}
                </p>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
              <span>{b.date} @ {b.start_time}</span>
              <span className="text-white font-bold">{currency(b.total)}</span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-center text-gray-500 py-16">No bookings yet.</p>}
      </main>
    </div>
  );
}

export function AdminServicesPage() {
  const [services, setServices] = useState<Awaited<ReturnType<typeof api.services>>>([]);
  useEffect(() => {
    api.services().then(setServices).catch(() => {});
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Services CMS" back="/admin" right={<Icon name="add" />} />
      <main className="p-4 space-y-3 pb-24">
        {services.map((s) => (
          <div key={s.id} className="bg-[#1f2937] rounded-xl border border-gray-800 p-4 flex items-center gap-3">
            <div className="size-11 rounded-lg gradient-bg flex items-center justify-center shrink-0">
              <Icon name={s.icon ?? "cleaning_services"} className="text-white text-[22px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{s.title}</p>
              <p className="text-gray-400 text-xs">{s.category} • {currency(s.base_price)} • {s.rating.toFixed(1)}★</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${s.popular ? "bg-primary/10 text-primary" : "bg-white/5 text-gray-400"}`}>
              {s.popular ? "Popular" : "Active"}
            </span>
          </div>
        ))}
      </main>
    </div>
  );
}