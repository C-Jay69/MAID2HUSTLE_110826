import { db } from "./db";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Open-source model gateway.
 * Tries, in order:
 *   1. Google AI Studio (GEMINI_API_KEY)  -> gemini-2.0-flash / gemini-1.5-flash (free tier)
 *   2. Ollama (OLLAMA_BASE_URL)           -> local models (llama3, mistral, etc.)
 *   3. OpenRouter (OPENROUTER_API_KEY)    -> cheap open models
 *   4. Built-in rule-based assistant (always works, zero cost)
 */
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free";

function serviceCatalog() {
  const rows = db
    .query("SELECT title, category, base_price, rating FROM services ORDER BY popular DESC LIMIT 6")
    .all() as { title: string; category: string; base_price: number; rating: number }[];
  return rows.map((r) => `- ${r.title} (${r.category}) from $${r.base_price}, rating ${r.rating}`).join("\n");
}

function systemPrompt(): string {
  return `You are the MAID 2 HUSTLE customer assistant. You help customers book trusted home services (cleaning, plumbing, electrical, landscaping, HVAC, moving, handyman) in minutes.

Available services:
${serviceCatalog()}

Rules:
- Be friendly, concise, and helpful. Keep answers under 80 words unless asked for detail.
- Recommend the best service from the catalog based on the user's need.
- You can help with booking flow (choose service -> schedule -> checkout), cancellation, refunds, and provider questions.
- If the user wants to book, tell them the recommended service and price.
- You cannot process payments; point users to the checkout screen.
- For anything about account or security, direct users to support@maid2hustle.com.`;
}

async function tryGemini(messages: ChatMessage[]): Promise<string | null> {
  if (!GEMINI_KEY) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt() }] },
      contents,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function tryOllama(messages: ChatMessage[]): Promise<string | null> {
  const body = {
    model: OLLAMA_MODEL,
    messages: [{ role: "system", content: systemPrompt() }, ...messages],
    stream: false,
  };
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { message?: { content?: string } };
  return data.message?.content ?? null;
}

async function tryOpenRouter(messages: ChatMessage[]): Promise<string | null> {
  if (!OPENROUTER_KEY) return null;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "system", content: systemPrompt() }, ...messages],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? null;
}

function localReply(message: string): string {
  const q = message.toLowerCase();

  if (/(plumb|leak|faucet|pipe|clog|drain)/.test(q)) {
    return "For plumbing issues I'd recommend our **Plumbing Repair** ($80) or **Emergency Plumbing** ($145) for urgent leaks. A licensed pro can usually arrive same-day. Want me to set up a booking?";
  }
  if (/(electr|outlet|breaker|wiring|light switch)/.test(q)) {
    return "Our certified electricians handle outlets, fixtures, and safety checks — **Electrical Fixes & Safety Check** starts at $90. Shall we schedule an appointment?";
  }
  if (/(clean|maid|housekeep|deep clean|vacuum|tidy)/.test(q)) {
    return "Cleaning is our most popular service! **Deep House Cleaning** starts at $89, and we also offer **Move-in / Move-out** ($150) and **Exterior Window Wash** ($120). Which fits your home best?";
  }
  if (/(move|mover|heavy|lifting|relocat)/.test(q)) {
    return "**Home Moving & Heavy Lifting** starts at $120 — professional movers with a truck, careful packing included. Want me to check availability?";
  }
  if (/(handyman|assemble|furniture|mount|shelf|fix|repair)/.test(q)) {
    return "Our **Assembly & Handyman** service ($55/hr-ish) covers furniture assembly, mounting, and everyday fixes — often available same-day.";
  }
  if (/(landscap|lawn|garden|yard)/.test(q)) {
    return "**Landscaping & Lawn Care** starts at $65 for full-service lawn and garden maintenance. Green-thumb pros, 4.6 stars. Shall I book it?";
  }
  if (/(hvac|heating|cooling|air cond|furnace|ac\b)/.test(q)) {
    return "**HVAC Servicing & Tune-up** starts at $75 — filter replacement, efficiency tune-ups, and repairs by an EPA-certified tech.";
  }
  if (/(cancel|refund)/.test(q)) {
    return "You can cancel a booking free of charge up to 24 hours before the start time, right from the booking details screen. Refunds are processed back to your original payment method within 3-5 business days.";
  }
  if (/(price|cost|how much|fee)/.test(q)) {
    return `Here's what our most popular services start at:\n${serviceCatalog()}\n\nPrices are set by the provider and shown before you confirm. Want a recommendation?`;
  }
  if (/(book|schedule|appointment|reserve|hire)/.test(q)) {
    return "Booking takes under a minute: pick a service, choose a date and time slot, then confirm with payment. I can recommend the top-rated option from the catalog to get you started!";
  }
  if (/(pay|payment|stripe|card|checkout|secure)/.test(q)) {
    return "Checkout is secured with SSL and card processing is protected up to $1,000 by our Trust & Safety Guarantee. We accept credit/debit cards, Apple Pay, and PayPal.";
  }
  if (/(provider|vendor|work|job|apply|hustle)/.test(q)) {
    return "Providers keep more with our Partner Success program — standard 15%, Top Pro 10%, recurring work 8%. No lead fees, insured jobs, guaranteed payouts. You can apply from the 'Become a Provider' page!";
  }
  if (/(hello|hi|hey|help|assist)/.test(q)) {
    return "Hey! 👋 I'm the MAID 2 HUSTLE assistant. I can recommend a service, check prices, or help with booking. What does your home need today?";
  }
  return "Happy to help! You can ask me things like:\n- \"How much is deep cleaning?\"\n- \"I have a leaky faucet\"\n- \"Help me book a mover\"\n- \"Can I cancel a booking?\"\n\nOr browse our Explore page to find the perfect pro.";
}

export async function generateReply(messages: ChatMessage[]): Promise<string> {
  const last = messages[messages.length - 1]?.content ?? "";
  const attempts = [tryGemini, tryOllama, tryOpenRouter];
  for (const attempt of attempts) {
    try {
      const result = await attempt(messages);
      if (result) return result.trim();
    } catch {
      // fall through to next provider
    }
  }
  return localReply(last);
}
