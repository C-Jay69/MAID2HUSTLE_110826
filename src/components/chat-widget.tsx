import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { api, type ChatMsg } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm the MAID 2 HUSTLE assistant. I can help you find a service, check prices, or start a booking. What do you need?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const { reply } = await api.aiChat(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError((e as Error).message);
      setMessages([...next, { role: "assistant", content: "Sorry, I'm having a moment. Please try again in a few seconds." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 right-4 z-50 size-14 rounded-full gradient-bg text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <Icon name="close" className="text-[26px]" /> : <Icon name="support_agent" className="text-[26px]" />}
        {!open && <span className="absolute top-0 right-0 size-3 bg-green-400 rounded-full border-2 border-black"></span>}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-40 right-4 z-50 w-[calc(100vw-2rem)] max-w-[360px] h-[480px] max-h-[60vh] rounded-2xl overflow-hidden border border-white/10 bg-[#111] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 gradient-bg">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="bolt" className="text-white text-[18px]" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-tight">MAID 2 HUSTLE Assistant</p>
                <p className="text-white/70 text-[10px] font-semibold">Powered by open-source AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user" ? "bg-primary text-white rounded-br-md" : "bg-[#2a2a2a] text-white rounded-bl-md",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
                  <span className="size-2 bg-white/40 rounded-full animate-bounce" />
                  <span className="size-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="size-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>

          <div className="p-3 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about services, prices, bookings..."
                className="flex-1 h-11 rounded-xl bg-[#2a2a2a] border border-white/10 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={send} disabled={busy || !input.trim()} className="size-11 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40">
                <Icon name="send" className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}