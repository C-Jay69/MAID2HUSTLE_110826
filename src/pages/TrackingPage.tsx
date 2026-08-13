import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { api, type Booking } from "@/lib/api";

export function TrackingPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    const id = Number(new URLSearchParams(window.location.hash.split("?")[1]).get("booking"));
    if (id) api.bookings().then((bs) => setBooking(bs.find((b) => b.id === id) ?? null)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 12 : p + 2)), 2500);
    return () => clearInterval(t);
  }, []);

  const minutes = Math.max(1, Math.round(22 - progress / 5));

  return (
    <div className="relative h-screen w-full max-w-3xl mx-auto bg-page overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="relative z-50 flex items-center bg-white/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-line">
        <button onClick={() => (window.location.hash = "/bookings")} className="text-ink flex size-12 shrink-0 items-center justify-start cursor-pointer">
          <Icon name="arrow_back_ios_new" />
        </button>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-ink text-base font-bold tracking-tight uppercase">Live Tracking</h2>
          <p className="text-[10px] text-primary font-bold tracking-widest uppercase">Maid 2 Hustle</p>
        </div>
        <div className="flex w-12 items-center justify-end">
          <div className="bg-primary/10 px-2 py-1 rounded-full border border-primary/30">
            <p className="text-primary text-[10px] font-bold uppercase">In Route</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c0ffff] via-[#eef6f2] to-[#fffdd0]"></div>
        {/* pseudo street grid */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="none">
          <path d="M0,120 H400 M0,260 H400 M0,400 H400 M0,540 H400 M0,680 H400" stroke="#0b241c22" strokeWidth="1" />
          <path d="M90,0 V800 M200,0 V800 M320,0 V800" stroke="#0b241c22" strokeWidth="1" />
        </svg>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(238,246,242,0.9) 0%, rgba(238,246,242,0) 30%, rgba(238,246,242,0) 70%, rgba(238,246,242,1) 100%)" }}></div>
        {/* Route */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 800">
          <defs>
            <linearGradient id="routeGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#7f13ec", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#00a34c", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M100,500 C150,450 250,400 300,300"
            fill="none"
            stroke="url(#routeGrad)"
            strokeLinecap="round"
            strokeWidth="4"
            strokeDasharray="8"
            style={{ filter: "drop-shadow(0 0 4px rgba(127,19,236,0.5))" }}
          />
          <circle cx="100" cy="500" fill="#7f13ec" r="8">
            <animate attributeName="r" dur="2s" repeatCount="indefinite" values="8;12;8" />
            <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;0.5;1" />
          </circle>
          <circle cx="100" cy="500" fill="none" r="15" stroke="#7f13ec" strokeWidth="1">
            <animate attributeName="r" dur="2s" repeatCount="indefinite" values="15;25;15" />
            <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.4;0;0.4" />
          </circle>
          <g transform="translate(300, 300)">
            <circle cx="0" cy="0" fill="#00a34c" r="6"></circle>
            <path d="M0,0 L0,-20" stroke="#00a34c" strokeWidth="2"></path>
            <circle cx="0" cy="-20" fill="#00a34c" r="4"></circle>
          </g>
        </svg>
        {/* Controls */}
        <div className="absolute right-4 bottom-64 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5 overflow-hidden rounded-lg shadow-xl">
            <button className="flex size-11 items-center justify-center bg-white text-ink hover:bg-primary/10 transition-colors">
              <Icon name="add" className="text-xl" />
            </button>
            <button className="flex size-11 items-center justify-center bg-white text-ink hover:bg-primary/10 transition-colors border-t border-line">
              <Icon name="remove" className="text-xl" />
            </button>
          </div>
          <button className="flex size-11 items-center justify-center rounded-lg gradient-bg shadow-lg shadow-primary/20">
            <Icon name="my_location" className="text-xl" />
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="relative z-20 bg-white rounded-t-2xl border-t border-line shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pb-8">
        <div className="flex w-full items-center justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-line"></div>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-16 rounded-lg gradient-bg flex items-center justify-center text-ink text-2xl font-black shrink-0">
              {booking?.vendor_name?.[0] ?? "S"}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-ink text-xl font-bold truncate">{booking?.vendor_name ?? "Sarah J."}</h3>
                <div className="flex items-center bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                  <Icon name="star" className="text-[12px] text-primary" filled />
                  <span className="text-[10px] font-bold text-primary ml-1">{booking?.vendor_rating.toFixed(1) ?? "4.9"}</span>
                </div>
              </div>
              <p className="text-ink/60 text-sm font-medium truncate">{booking?.service_title ?? "Deep Cleaning Specialist"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Arriving in</span>
            <span className="text-2xl font-black text-primary">
              {minutes} <span className="text-xs uppercase">min</span>
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="px-6 py-2">
          <div className="h-1.5 bg-line rounded-full overflow-hidden">
            <div className="h-full gradient-bg-deep transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 py-2">
          <div className="bg-page rounded-lg p-4 border border-line">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="distance" className="text-secondary text-lg" />
              <p className="text-ink/40 text-[10px] font-bold uppercase tracking-wider">Distance</p>
            </div>
            <p className="text-ink text-lg font-bold">0.8 <span className="text-xs font-normal text-ink/60">miles</span></p>
          </div>
          <div className="bg-page rounded-lg p-4 border border-line">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="schedule" className="text-primary text-lg" />
              <p className="text-ink/40 text-[10px] font-bold uppercase tracking-wider">Scheduled</p>
            </div>
            <p className="text-ink text-lg font-bold">{booking?.start_time ?? "2:30"} <span className="text-xs font-normal text-ink/60">PM</span></p>
          </div>
        </div>
        <div className="flex gap-3 px-6 pt-4 pb-2">
          <button className="flex flex-1 items-center justify-center gap-2 h-12 rounded-lg bg-page hover:bg-primary/10 text-ink font-bold border border-line">
            <Icon name="call" />
            <span>Call</span>
          </button>
          <button className="flex-[2] flex items-center justify-center gap-2 h-12 rounded-lg gradient-bg-deep text-ink font-bold shadow-lg shadow-primary/30">
            <Icon name="chat_bubble" />
            <span>Message</span>
          </button>
        </div>
        <div className="px-6 pt-4 flex items-center justify-between text-ink/40">
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Icon name="share_location" className="text-sm" />
            <span className="text-[11px] font-bold uppercase">Share Status</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Icon name="support_agent" className="text-sm" />
            <span className="text-[11px] font-bold uppercase">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}