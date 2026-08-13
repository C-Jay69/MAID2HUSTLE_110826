import { useEffect, useMemo, useState } from "react";
import { Icon, formatTime } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useRouter } from "@/lib/router";
import { api, type Service, type Vendor } from "@/lib/api";
import { cn } from "@/lib/utils";
import { addHours } from "@/components/ui/icon";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOT_GROUPS = [
  { label: "Morning", icon: "light_mode", slots: ["08:00-10:00", "10:00-12:00"] },
  { label: "Afternoon", icon: "wb_sunny", slots: ["12:00-14:00", "14:00-16:00"] },
  { label: "Evening", icon: "dark_mode", slots: ["16:00-18:00"] },
];

export function SchedulePage() {
  const { params } = useRouter();
  const serviceId = Number(params.service);
  const vendorId = Number(params.vendor);

  const [service, setService] = useState<Service | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  useEffect(() => {
    if (serviceId) api.service(serviceId).then(setService).catch(() => {});
    if (vendorId) api.vendor(vendorId).then((v) => setVendor(v)).catch(() => {});
  }, [serviceId, vendorId]);

  // initialize selected date to today
  useEffect(() => {
    if (!selectedDate) setSelectedDate(todayISO());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const firstDow = base.getDay();

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    );
  }

  const today = todayISO();

  const availableSlots = useMemo(() => {
    if (!vendor) return SLOT_GROUPS;
    const availability = JSON.parse(vendor.availability || "{}");
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const day = selectedDate ? dayNames[new Date(`${selectedDate}T00:00:00`).getDay()] : "mon";
    const daySlots = (availability[day] as string[] | undefined) ?? [];
    if (daySlots.length === 0) return SLOT_GROUPS.map((g) => ({ ...g, slots: [] }));
    return SLOT_GROUPS.map((g) => ({
      ...g,
      slots: g.slots.filter((s) => {
        const start = s.split("-")[0];
        return daySlots.some((ds) => start >= ds.split("-")[0] && start < ds.split("-")[1]);
      }),
    }));
  }, [vendor, selectedDate]);

  const endTime = selectedSlot ? addHours(selectedSlot.split("-")[0]!, service?.duration_hours ?? 2) : "";
  const price = service ? Math.round(service.base_price) : 0;

  const canContinue = !!selectedDate && !!selectedSlot;

  const continueBooking = () => {
    const query = `?service=${serviceId}&vendor=${vendorId}&date=${selectedDate}&start=${selectedSlot.split("-")[0]}&end=${endTime}`;
    window.location.hash = `/details${query}`;
  };

  return (
    <div className="pb-36">
      <TopBar title="MAID 2 HUSTLE" back="/explore" right={<Icon name="chat_bubble" />} />

      {/* Progress */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-wider">Step 2 of 4</p>
            <h1 className="text-2xl font-bold leading-tight">Schedule Service</h1>
          </div>
          <p className="text-gray-400 text-sm font-medium">50% Complete</p>
        </div>
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: "50%" }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-500 mt-1">
          <span>Service</span>
          <span className="text-primary">Schedule</span>
          <span>Details</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Selected service context */}
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
          <button onClick={() => (window.location.hash = "/explore")} className="text-xs font-bold text-secondary">
            CHANGE
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="mt-4">
        <h3 className="text-lg font-bold px-4 mb-2">Select a Date</h3>
        <div className="bg-[#1e132b] mx-4 rounded-2xl shadow-sm border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonthOffset((m) => m - 1)} className="p-2 hover:bg-white/5 rounded-full">
              <Icon name="chevron_left" className="text-xl" />
            </button>
            <p className="text-base font-bold">
              {base.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </p>
            <button onClick={() => setMonthOffset((m) => m + 1)} className="p-2 hover:bg-white/5 rounded-full">
              <Icon name="chevron_right" className="text-xl" />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((d) => (
              <p key={d} className="text-slate-400 text-[11px] font-bold text-center uppercase">
                {d}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`e${i}`} />;
              const dayNum = Number(date.slice(-2));
              const isPast = date < today;
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot("");
                  }}
                  className={cn(
                    "h-10 w-full text-sm font-medium rounded-lg transition-colors",
                    isPast && "opacity-30 cursor-not-allowed",
                    isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-white/5",
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arrival window */}
      <div className="mt-8">
        <h3 className="text-lg font-bold px-4 mb-2">Select Arrival Window</h3>
        <p className="px-4 text-xs text-slate-400 mb-4 flex items-center gap-1">
          <Icon name="info" className="text-sm" />
          Your professional will arrive within this 2-hour window.
        </p>
        <div className="flex flex-col gap-6 px-4">
          {availableSlots.map((group) => (
            <div key={group.label}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name={group.icon} className="text-base" /> {group.label}
              </h4>
              {group.slots.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No availability</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {group.slots.map((slot) => {
                    const [start, end] = slot.split("-");
                    const active = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "p-4 rounded-xl flex flex-col items-center justify-center transition-all",
                          active
                            ? "border-2 border-primary bg-primary/10"
                            : "border border-slate-800 hover:border-primary/50 bg-[#1e132b]",
                        )}
                      >
                        <span className={cn("text-sm font-medium", active && "font-bold")}>
                          {formatTime(start!)} - {formatTime(end!)}
                        </span>
                        {active && <span className="text-[10px] text-primary font-bold">SELECTED</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 p-4 pb-8 bg-black/90 backdrop-blur-xl border-t border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.hash = `/service/${serviceId}`)}
            className="w-1/3 py-4 rounded-xl border border-slate-700 font-bold text-sm tracking-tight active:scale-95 transition-transform"
          >
            BACK
          </button>
          <button
            disabled={!canContinue}
            onClick={continueBooking}
            className="w-2/3 py-4 rounded-xl bg-primary text-white font-bold text-sm tracking-tight shadow-lg shadow-primary/40 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            CONTINUE TO DETAILS
            <Icon name="arrow_forward" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}