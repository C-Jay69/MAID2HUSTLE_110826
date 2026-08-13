import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useRouter } from "@/lib/router";
import { api, type Booking } from "@/lib/api";
import { cn } from "@/lib/utils";

const TAGS = ["Professional", "Punctual", "Thorough", "Friendly", "Value"];

export function RatePage() {
  const { params } = useRouter();
  const bookingId = Number(params.booking);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.bookings().then((bs) => setBooking(bs.find((b) => b.id === bookingId) ?? null)).catch(() => {});
  }, [bookingId]);

  const toggleTag = (t: string) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const label = ["", "Poor", "Fair", "Good", "Very Good!", "Excellent!"][rating];

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.review({ booking_id: bookingId, rating, tags, comment });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-32">
      <TopBar title="Rate Your Service" back="/bookings" right={<Icon name="more_horiz" />} />

      <div className="px-5 pt-4">
        {/* Provider header */}
        <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-line">
          <div className="size-14 rounded-full gradient-bg flex items-center justify-center text-ink text-2xl font-black">
            {booking?.vendor_name?.[0] ?? "M"}
          </div>
          <div>
            <p className="font-bold text-lg">{booking?.vendor_name ?? "Maid 2 Hustle"}</p>
            <p className="text-gray-400 text-sm">
              {booking?.service_title ?? "Deep Cleaning"} • {booking ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
            </p>
          </div>
        </div>

        {done ? (
          <div className="text-center py-16">
            <div className="size-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5">
              <Icon name="check_circle" className="text-emerald-400 text-[44px]" filled />
            </div>
            <h2 className="text-ink text-2xl font-black mb-2">Thank you!</h2>
            <p className="text-gray-400">Your feedback helps our community hustle better.</p>
          </div>
        ) : (
          <>
            {/* Rating stars */}
            <div className="text-center py-6">
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={cn("transition-transform", n <= rating ? "scale-110" : "scale-100 opacity-40")}
                  >
                    <Icon
                      name="star"
                      className="text-[44px] text-yellow-400"
                      filled
                    />
                  </button>
                ))}
              </div>
              <p className="text-xl font-bold" style={{ color: rating >= 4 ? "#4ade80" : rating === 3 ? "#facc15" : "#f87171" }}>
                {label}
              </p>
            </div>

            {/* Tags */}
            <h3 className="text-ink font-bold mb-3">What went well?</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-semibold transition-colors",
                    tags.includes(t) ? "bg-primary/20 border-primary text-primary" : "bg-[#2a2a2a] border-white/10 text-gray-300",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Comment */}
            <h3 className="text-ink font-bold mb-3">Tell us more</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share details about your experience..."
              className="w-full rounded-xl bg-white border border-line px-4 py-3 text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </>
        )}
      </div>

      {!done && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 backdrop-blur-xl border-t border-line z-30">
          <button
            onClick={submit}
            disabled={submitting}
            className="w-full gradient-bg h-14 rounded-xl text-ink font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}