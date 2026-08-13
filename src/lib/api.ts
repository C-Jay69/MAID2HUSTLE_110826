export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "vendor" | "admin";
  avatar?: string;
}

export interface Service {
  id: number;
  title: string;
  category: string;
  description: string;
  base_price: number;
  duration_hours: number;
  icon: string;
  rating: number;
  reviews: number;
  popular: number;
  vendors?: Vendor[];
}

export interface Vendor {
  id: number;
  user_id: number;
  name: string;
  service_type: string;
  rating: number;
  hourly_rate: number;
  bio: string;
  photo?: string;
  availability: string;
  verified: number;
  approved: number;
  jobs_done: number;
}

export interface Booking {
  id: number;
  booking_ref: string;
  user_id: number;
  vendor_id: number;
  service_id: number;
  date: string;
  start_time: string;
  end_time: string;
  address: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  total: number;
  created_at: string;
  service_title: string;
  service_icon: string;
  vendor_name: string;
  vendor_rating: number;
  customer_name?: string;
}

export interface Review {
  id: number;
  booking_id: number;
  user_id: number;
  vendor_id: number;
  rating: number;
  tags: string;
  comment?: string;
  created_at: string;
  user_name?: string;
}

export interface Referral {
  id: number;
  code: string;
  friends_joined: number;
  total_earned: number;
}

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const BASE = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("m2h_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  register: (body: { name: string; email: string; password: string; phone?: string; role?: string }) =>
    request<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<User>("/auth/me"),

  services: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<Service[]>(`/services${qs ? `?${qs}` : ""}`);
  },
  service: (id: number) => request<Service>(`/services/${id}`),
  categories: () => request<string[]>("/categories"),

  vendors: (service_type?: string) =>
    request<Vendor[]>(`/vendors${service_type ? `?service_type=${service_type}` : ""}`),
  vendor: (id: number) => request<Vendor & { reviews: Review[] }>(`/vendors/${id}`),
  applyVendor: (body: { name: string; service_type: string; hourly_rate: number; bio: string; availability: string }) =>
    request<Vendor>("/vendors", { method: "POST", body: JSON.stringify(body) }),
  myVendor: () => request<Vendor>("/vendors/me"),
  updateVendor: (body: Partial<{ name: string; service_type: string; hourly_rate: number; bio: string; availability: string }>) =>
    request<Vendor>("/vendors/me", { method: "PATCH", body: JSON.stringify(body) }),

  createBooking: (body: { service_id: number; vendor_id: number; date: string; start_time: string; end_time: string; address: string; notes?: string }) =>
    request<Booking>("/bookings", { method: "POST", body: JSON.stringify(body) }),
  bookings: () => request<Booking[]>("/bookings"),
  updateBookingStatus: (id: number, status: string) =>
    request<Booking>(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  checkout: (body: { booking_id: number; method: string }) =>
    request<{ payment: { transactionId: string; amount: number; method: string; status: string; bookingRef: string }; booking: Booking }>("/payments/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  adminStats: () =>
    request<{ bookings: number; revenue: number; pendingVendors: number; users: number; services: number; pendingBookings: number; byStatus: { status: string; n: number }[]; byCategory: { category: string; n: number }[] }>("/admin/stats"),
  adminBookings: () => request<Booking[]>("/admin/bookings"),
  adminVendors: () =>
    request<(Vendor & { user_name: string; user_email: string })[]>("/admin/vendors"),
  approveVendor: (id: number, approved: boolean) =>
    request<Vendor>(`/admin/vendors/${id}/approve`, { method: "PATCH", body: JSON.stringify({ approved }) }),

  referral: () => request<Referral>("/referral"),

  review: (body: { booking_id: number; rating: number; comment?: string; tags?: string[] }) =>
    request<{ ok: true }>("/reviews", { method: "POST", body: JSON.stringify(body) }),

  aiChat: (messages: ChatMsg[]) =>
    request<{ reply: string }>("/ai/chat", { method: "POST", body: JSON.stringify({ messages }) }),
};