import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { api, type Referral } from "@/lib/api";

export function ReferPage() {
  const [ref, setRef] = useState<Referral | null>(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.referral().then(setRef).catch(() => {});
  }, []);

  const code = ref?.code ?? "HUSTLE2024";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <TopBar title="Refer a Friend" back="/profile" />

      <div className="px-5 pt-4">
        <div className="text-center py-6">
          <h1 className="text-3xl font-black gradient-text mb-2">Give $20, Get $20</h1>
          <p className="text-gray-400 text-sm">Invite friends and you both get $20 in service credit.</p>
        </div>

        {/* Code */}
        <div className="bg-[#1e132b] rounded-2xl border border-primary/30 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-2xl"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Your Referral Code</p>
          <p className="text-3xl font-black tracking-[0.2em] gradient-text mb-4">{code}</p>
          <button
            onClick={copy}
            className="w-full h-12 rounded-xl gradient-bg text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Icon name={copied ? "check_circle" : "content_copy"} className="text-[20px]" filled={copied} />
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Share channels */}
        <div className="flex justify-center gap-6 my-8">
          {[
            { icon: "chat", label: "WhatsApp", color: "text-green-400" },
            { icon: "forum", label: "Messenger", color: "text-blue-400" },
            { icon: "mail", label: "Email", color: "text-amber-400" },
          ].map((s) => (
            <button key={s.label} className="flex flex-col items-center gap-2">
              <div className="size-14 rounded-full bg-[#2a2a2a] border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors">
                <Icon name={s.icon} className={`${s.color} text-[24px]`} />
              </div>
              <span className="text-xs text-gray-400">{s.label}</span>
            </button>
          ))}
        </div>

        {/* How it works */}
        <h3 className="text-ink text-lg font-bold mb-4">How it works</h3>
        <div className="space-y-4">
          {[
            { n: 1, title: "Share your code", desc: "Send your unique code to friends who need home services." },
            { n: 2, title: "They book", desc: "Your friend gets $20 off their first booking of $50+." },
            { n: 3, title: "You earn", desc: "Once they complete service, $20 lands in your credit." },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 bg-[#2a2a2a] rounded-xl p-4 border border-white/5">
              <div className="size-9 rounded-full gradient-bg flex items-center justify-center font-black shrink-0">
                {s.n}
              </div>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact */}
        <div className="mt-8 bg-[#1e132b] rounded-2xl border border-white/5 p-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs font-medium">Friends Joined</p>
            <p className="text-ink text-3xl font-black">{ref?.friends_joined ?? 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium">Total Earned</p>
            <p className="text-ink text-3xl font-black">${ref?.total_earned ?? 0}</p>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </div>
  );
}