export function Icon({
  name,
  className = "text-[24px]",
  filled = false,
  onClick,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  onClick?: () => void;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24` }}
      onClick={onClick}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function StarRating({ rating, className = "text-primary" }: { rating: number; className?: string }) {
  return (
    <span className="flex items-center gap-1">
      <Icon name="star" className="text-[16px] text-yellow-400" filled />
      <span className={`font-bold ${className}`}>{rating.toFixed(1)}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border border-red-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}

export function currency(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = (h ?? 0) >= 12 ? "PM" : "AM";
  const hh = (h ?? 0) % 12 || 12;
  return `${hh}:${String(m ?? 0).padStart(2, "0")} ${ampm}`;
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} @ ${formatTime(time)}`;
}

export function timeTo12h(t: string): string {
  return formatTime(t);
}

export function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + Math.round(hours * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}