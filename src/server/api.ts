import { db } from "./db";
import { hashPassword, verifyPassword, signToken, getUserFromToken, publicUser } from "./auth";
import { generateReply } from "./ai";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function err(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function authUser(req: Request) {
  return getUserFromToken(req.headers.get("Authorization"));
}

function requireAuth(req: Request) {
  const user = authUser(req);
  if (!user) return { error: err("Unauthorized", 401) };
  return { user };
}

function requireRole(req: Request, roles: string[]) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked;
  const { user } = checked;
  if (!roles.includes(user.role as string)) return { error: err("Forbidden", 403) };
  return { user };
}

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function weekdayFor(dateStr: string): string {
  return DAYS[new Date(dateStr + "T00:00:00").getDay()] ?? "mon";
}

function normalizeSlot(slot: string): { start: string; end: string } {
  const [start, end] = slot.split("-");
  return { start: start ?? "08:00", end: end ?? "10:00" };
}

function hasConflict(vendorId: number, date: string, start: string, end: string, excludeBookingId?: number) {
  const rows = db
    .query(
      `SELECT id, start_time, end_time FROM bookings
       WHERE vendor_id = ? AND date = ? AND status != 'cancelled'`,
    )
    .all(vendorId, date) as { id: number; start_time: string; end_time: string }[];

  return rows.some((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false;
    return start < b.end_time && b.start_time < end;
  });
}

// ---------- Handlers ----------

async function register(req: Request) {
  const body = (await req.json()) as { name?: string; email?: string; password?: string; phone?: string; role?: string };
  if (!body.name || !body.email || !body.password) return err("Name, email and password are required");
  const role = ["customer", "vendor", "admin"].includes(body.role ?? "") ? body.role : "customer";

  const existing = db.query("SELECT id FROM users WHERE email = ?").get(body.email);
  if (existing) return err("An account with that email already exists", 409);

  const result = db
    .query("INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)")
    .run(body.name, body.email, hashPassword(body.password), body.phone ?? null, role);

  const id = result.lastInsertRowid as number;
  const user = db.query("SELECT * FROM users WHERE id = ?").get(id) as Record<string, unknown>;
  const token = signToken({ sub: id, role, name: body.name });
  return json({ token, user: publicUser(user) }, 201);
}

async function login(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string };
  if (!body.email || !body.password) return err("Email and password are required");
  const user = db.query("SELECT * FROM users WHERE email = ?").get(body.email) as Record<string, unknown> | undefined;
  if (!user || !verifyPassword(body.password, user.password_hash as string)) {
    return err("Invalid email or password", 401);
  }
  const token = signToken({ sub: user.id as number, role: user.role as string, name: user.name as string });
  return json({ token, user: publicUser(user) });
}

function listServices(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q")?.toLowerCase();
  const sort = url.searchParams.get("sort");

  let sql = "SELECT * FROM services WHERE 1=1";
  const params: (string | number)[] = [];
  if (category && category !== "All") {
    sql += " AND category = ?";
    params.push(category);
  }
  if (q) {
    sql += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  if (sort === "price-asc") sql += " ORDER BY base_price ASC";
  else if (sort === "price-desc") sql += " ORDER BY base_price DESC";
  else if (sort === "rating") sql += " ORDER BY rating DESC";
  else sql += " ORDER BY popular DESC, rating DESC";

  return json(db.query(sql).all(...params));
}

function getService(req: Request, id: number) {
  const service = db.query("SELECT * FROM services WHERE id = ?").get(id);
  if (!service) return err("Service not found", 404);
  const vendors = db
    .query(
      `SELECT v.*, u.name AS user_name FROM vendors v
       JOIN users u ON u.id = v.user_id
       JOIN services s ON s.category = v.service_type
       WHERE s.id = ? AND v.approved = 1`,
    )
    .all(id);
  return json({ ...service, vendors });
}

function listVendors(req: Request) {
  const url = new URL(req.url);
  const serviceType = url.searchParams.get("service_type");
  let sql = "SELECT * FROM vendors WHERE approved = 1";
  const params: string[] = [];
  if (serviceType) {
    sql += " AND service_type = ?";
    params.push(serviceType);
  }
  sql += " ORDER BY rating DESC";
  return json(db.query(sql).all(...params));
}

function getVendor(id: number) {
  const vendor = db.query("SELECT * FROM vendors WHERE id = ?").get(id);
  if (!vendor) return err("Provider not found", 404);
  const reviews = db
    .query(
      `SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.vendor_id = ? ORDER BY r.created_at DESC LIMIT 10`,
    )
    .all(id);
  return json({ ...vendor, reviews });
}

async function applyVendor(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;

  const body = (await req.json()) as {
    name?: string;
    service_type?: string;
    hourly_rate?: number;
    bio?: string;
    availability?: string;
  };
  if (!body.name || !body.service_type) return err("Name and service type are required");

  const existing = db.query("SELECT id FROM vendors WHERE user_id = ?").get(user.id);
  if (existing) return err("You already have a provider application", 409);

  db.query(
    `INSERT INTO vendors (user_id, name, service_type, hourly_rate, bio, availability)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    user.id,
    body.name,
    body.service_type,
    body.hourly_rate ?? 30,
    body.bio ?? "",
    body.availability ?? "{}",
  );

  // vendor role upgrade
  db.query("UPDATE users SET role = 'vendor' WHERE id = ?").run(user.id);
  const vendor = db.query("SELECT * FROM vendors WHERE user_id = ?").get(user.id);
  return json(vendor, 201);
}

function myVendor(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;
  const vendor = db.query("SELECT * FROM vendors WHERE user_id = ?").get(user.id);
  if (!vendor) return err("No provider profile", 404);
  return json(vendor);
}

async function updateMyVendor(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;

  const vendor = db.query("SELECT * FROM vendors WHERE user_id = ?").get(user.id);
  if (!vendor) return err("No provider profile", 404);

  const body = (await req.json()) as {
    name?: string;
    service_type?: string;
    hourly_rate?: number;
    bio?: string;
    availability?: string;
  };

  db.query(
    `UPDATE vendors SET
       name = COALESCE(?, name),
       service_type = COALESCE(?, service_type),
       hourly_rate = COALESCE(?, hourly_rate),
       bio = COALESCE(?, bio),
       availability = COALESCE(?, availability)
     WHERE id = ?`,
  ).run(body.name ?? null, body.service_type ?? null, body.hourly_rate ?? null, body.bio ?? null, body.availability ?? null, vendor.id);

  const updated = db.query("SELECT * FROM vendors WHERE id = ?").get(vendor.id);
  return json(updated);
}

async function createBooking(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;

  const body = (await req.json()) as {
    service_id?: number;
    vendor_id?: number;
    date?: string;
    start_time?: string;
    end_time?: string;
    address?: string;
    notes?: string;
  };

  if (!body.service_id || !body.vendor_id || !body.date || !body.start_time) {
    return err("service_id, vendor_id, date and start_time are required");
  }

  const vendor = db.query("SELECT * FROM vendors WHERE id = ?").get(body.vendor_id) as Record<string, unknown> | undefined;
  if (!vendor || (vendor.approved as number) !== 1) return err("Provider unavailable", 404);

  const service = db.query("SELECT * FROM services WHERE id = ?").get(body.service_id) as Record<string, unknown> | undefined;
  if (!service) return err("Service not found", 404);

  const end = body.end_time ?? addHours(body.start_time, (service.duration_hours as number) || 2);

  // conflict detection
  if (hasConflict(body.vendor_id, body.date, body.start_time, end)) {
    return err("That time slot just got booked. Please pick another time.", 409);
  }

  // check availability window (slot = 2h arrival window; start must fall within one)
  const availability = JSON.parse((vendor.availability as string) || "{}");
  const day = weekdayFor(body.date);
  const slots = (availability[day] as string[] | undefined) ?? [];
  const inWindow = slots.some((slot) => {
    const { start, end: slotEnd } = normalizeSlot(slot);
    return body.start_time >= start && body.start_time < slotEnd;
  });
  if (slots.length > 0 && !inWindow) {
    return err("That time isn't within this provider's availability.", 400);
  }

  const total = Math.max(service.base_price as number, (vendor.hourly_rate as number) * (service.duration_hours as number));

  const bookingRef = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
  const result = db
    .query(
      `INSERT INTO bookings (booking_ref, user_id, vendor_id, service_id, date, start_time, end_time, address, notes, status, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .run(bookingRef, user.id, body.vendor_id, body.service_id, body.date, body.start_time, end, body.address ?? "", body.notes ?? "", total);

  const booking = db
    .query(
      `SELECT b.*, s.title AS service_title, s.icon AS service_icon, v.name AS vendor_name, v.rating AS vendor_rating
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN vendors v ON v.id = b.vendor_id
       WHERE b.id = ?`,
    )
    .get(result.lastInsertRowid as number);

  return json(booking, 201);
}

function listMyBookings(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;

  const rows = db
    .query(
      `SELECT b.*, s.title AS service_title, s.icon AS service_icon, v.name AS vendor_name, v.rating AS vendor_rating, v.service_type
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN vendors v ON v.id = b.vendor_id
       WHERE b.user_id = ?
       ORDER BY b.date DESC, b.start_time DESC`,
    )
    .all(user.id);
  return json(rows);
}

function listVendorBookings(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;
  const vendor = db.query("SELECT id FROM vendors WHERE user_id = ?").get(user.id);
  if (!vendor) return json([]);
  const rows = db
    .query(
      `SELECT b.*, s.title AS service_title, s.icon AS service_icon, u.name AS customer_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN users u ON u.id = b.user_id
       WHERE b.vendor_id = ?
       ORDER BY b.date ASC, b.start_time ASC`,
    )
    .all(vendor.id);
  return json(rows);
}

async function updateBookingStatus(req: Request, id: number) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;
  const body = (await req.json()) as { status?: string };
  const status = body.status;

  const booking = db.query("SELECT * FROM bookings WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!booking) return err("Booking not found", 404);

  const isOwner = booking.user_id === user.id;
  const vendor = db.query("SELECT id FROM vendors WHERE user_id = ?").get(user.id) as { id: number } | undefined;
  const isVendor = vendor?.id === booking.vendor_id;

  if (!isOwner && !isVendor && user.role !== "admin") return err("Forbidden", 403);

  const allowed: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };
  const transitions = allowed[(booking.status as string) ?? "pending"];
  if (!status || !transitions.includes(status)) {
    return err(`Cannot change status from ${booking.status} to ${status ?? "none"}`, 400);
  }

  db.query("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
  if (status === "completed") {
    db.query("UPDATE vendors SET jobs_done = jobs_done + 1 WHERE id = ?").run(booking.vendor_id);
  }
  const updated = db.query("SELECT * FROM bookings WHERE id = ?").get(id);
  return json(updated);
}

async function checkout(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;

  const body = (await req.json()) as { booking_id?: number; method?: string };
  if (!body.booking_id) return err("booking_id is required");

  const booking = db.query("SELECT * FROM bookings WHERE id = ?").get(body.booking_id) as Record<string, unknown> | undefined;
  if (!booking) return err("Booking not found", 404);
  if (booking.user_id !== user.id) return err("Forbidden", 403);

  const existing = db.query("SELECT id FROM payments WHERE booking_id = ?").get(body.booking_id);
  if (existing) return err("Already paid", 409);

  const method = ["card", "apple_pay", "paypal"].includes(body.method ?? "") ? body.method : "card";
  const transactionId = `pi_${Math.random().toString(36).slice(2, 12)}`;

  db.query("INSERT INTO payments (booking_id, amount, method, status, transaction_id) VALUES (?, ?, ?, 'succeeded', ?)").run(
    body.booking_id,
    booking.total,
    method,
    transactionId,
  );
  db.query("UPDATE bookings SET status = 'confirmed' WHERE id = ?").run(body.booking_id);

  return json({
    payment: {
      transactionId,
      amount: booking.total,
      method,
      status: "succeeded",
      bookingRef: booking.booking_ref,
    },
    booking,
  });
}

function adminStats(req: Request) {
  const checked = requireRole(req, ["admin"]);
  if ("error" in checked) return checked.error;

  const bookings = (db.query("SELECT COUNT(*) AS n FROM bookings").get() as { n: number }).n;
  const revenue = (db.query("SELECT COALESCE(SUM(amount), 0) AS n FROM payments").get() as { n: number }).n;
  const pendingVendors = (db.query("SELECT COUNT(*) AS n FROM vendors WHERE approved = 0").get() as { n: number }).n;
  const users = (db.query("SELECT COUNT(*) AS n FROM users").get() as { n: number }).n;
  const services = (db.query("SELECT COUNT(*) AS n FROM services").get() as { n: number }).n;
  const pendingBookings = (db.query("SELECT COUNT(*) AS n FROM bookings WHERE status = 'pending'").get() as { n: number }).n;

  const byStatus = db
    .query("SELECT status, COUNT(*) AS n FROM bookings GROUP BY status")
    .all() as { status: string; n: number }[];
  const byCategory = db
    .query(
      `SELECT s.category, COUNT(*) AS n FROM bookings b JOIN services s ON s.id = b.service_id GROUP BY s.category ORDER BY n DESC`,
    )
    .all() as { category: string; n: number }[];

  return json({ bookings, revenue, pendingVendors, users, services, pendingBookings, byStatus, byCategory });
}

function adminBookings(req: Request) {
  const checked = requireRole(req, ["admin"]);
  if ("error" in checked) return checked.error;
  const rows = db
    .query(
      `SELECT b.*, s.title AS service_title, v.name AS vendor_name, u.name AS customer_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN vendors v ON v.id = b.vendor_id
       JOIN users u ON u.id = b.user_id
       ORDER BY b.created_at DESC LIMIT 50`,
    )
    .all();
  return json(rows);
}

function adminVendors(req: Request) {
  const checked = requireRole(req, ["admin"]);
  if ("error" in checked) return checked.error;
  const rows = db
    .query(
      `SELECT v.*, u.name AS user_name, u.email AS user_email
       FROM vendors v JOIN users u ON u.id = v.user_id
       ORDER BY v.approved ASC, v.created_at DESC`,
    )
    .all();
  return json(rows);
}

async function adminApproveVendor(req: Request, id: number) {
  const checked = requireRole(req, ["admin"]);
  if ("error" in checked) return checked.error;
  const body = (await req.json()) as { approved?: boolean };
  db.query("UPDATE vendors SET approved = ?, verified = ? WHERE id = ?").run(body.approved ? 1 : 0, body.approved ? 1 : 0, id);
  const vendor = db.query("SELECT * FROM vendors WHERE id = ?").get(id);
  return json(vendor);
}

function myReferral(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;
  let ref = db.query("SELECT * FROM referrals WHERE user_id = ?").get(user.id) as Record<string, unknown> | undefined;
  if (!ref) {
    const code = "HUSTLE" + Math.floor(1000 + Math.random() * 9000);
    const r = db.query("INSERT INTO referrals (user_id, code) VALUES (?, ?)").run(user.id, code);
    ref = db.query("SELECT * FROM referrals WHERE id = ?").get(r.lastInsertRowid as number) as Record<string, unknown>;
  }
  return json(ref);
}

async function createReview(req: Request) {
  const checked = requireAuth(req);
  if ("error" in checked) return checked.error;
  const { user } = checked;
  const body = (await req.json()) as { booking_id?: number; rating?: number; comment?: string; tags?: string[] };
  if (!body.booking_id || !body.rating) return err("booking_id and rating are required");

  const booking = db.query("SELECT * FROM bookings WHERE id = ?").get(body.booking_id) as Record<string, unknown> | undefined;
  if (!booking) return err("Booking not found", 404);
  if (booking.user_id !== user.id) return err("Forbidden", 403);

  db.query("INSERT INTO reviews (booking_id, user_id, vendor_id, rating, tags, comment) VALUES (?, ?, ?, ?, ?, ?)").run(
    body.booking_id,
    user.id,
    booking.vendor_id,
    Math.min(5, Math.max(1, Math.round(body.rating))),
    JSON.stringify(body.tags ?? []),
    body.comment ?? "",
  );

  const avg = db.query("SELECT AVG(rating) AS avg FROM reviews WHERE vendor_id = ?").get(booking.vendor_id) as { avg: number };
  db.query("UPDATE vendors SET rating = ? WHERE id = ?").run(Math.round(avg.avg * 10) / 10, booking.vendor_id);
  return json({ ok: true }, 201);
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + Math.round(hours * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function listCategories() {
  const rows = db.query("SELECT DISTINCT category FROM services ORDER BY category").all() as { category: string }[];
  return json(rows.map((r) => r.category));
}

export async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "");
  const method = req.method;

  // Auth
  if (path === "/auth/register" && method === "POST") return register(req);
  if (path === "/auth/login" && method === "POST") return login(req);
  if (path === "/auth/me" && method === "GET") {
    const user = authUser(req);
    return user ? json(user) : err("Unauthorized", 401);
  }

  // Services
  if (path === "/services" && method === "GET") return listServices(req);
  if (path === "/categories" && method === "GET") return listCategories();
  const serviceMatch = path.match(/^\/services\/(\d+)$/);
  if (serviceMatch && method === "GET") return getService(req, Number(serviceMatch[1]));

  // Vendors
  if (path === "/vendors" && method === "GET") return listVendors(req);
  if (path === "/vendors" && method === "POST") return applyVendor(req);
  if (path === "/vendors/me" && method === "GET") return myVendor(req);
  if (path === "/vendors/me" && method === "PATCH") return updateMyVendor(req);
  const vendorMatch = path.match(/^\/vendors\/(\d+)$/);
  if (vendorMatch && method === "GET") return getVendor(Number(vendorMatch[1]));

  // Bookings
  if (path === "/bookings" && method === "POST") return createBooking(req);
  if (path === "/bookings" && method === "GET") {
    const user = authUser(req);
    if (!user) return err("Unauthorized", 401);
    if (user.role === "vendor") return listVendorBookings(req);
    return listMyBookings(req);
  }
  const bookingStatusMatch = path.match(/^\/bookings\/(\d+)\/status$/);
  if (bookingStatusMatch && method === "PATCH") return updateBookingStatus(req, Number(bookingStatusMatch[1]));

  // Payments
  if (path === "/payments/checkout" && method === "POST") return checkout(req);

  // Admin
  if (path === "/admin/stats" && method === "GET") return adminStats(req);
  if (path === "/admin/bookings" && method === "GET") return adminBookings(req);
  if (path === "/admin/vendors" && method === "GET") return adminVendors(req);
  const approveMatch = path.match(/^\/admin\/vendors\/(\d+)\/approve$/);
  if (approveMatch && method === "PATCH") return adminApproveVendor(req, Number(approveMatch[1]));

  // Referral
  if (path === "/referral" && method === "GET") return myReferral(req);

  // Reviews
  if (path === "/reviews" && method === "POST") return createReview(req);

  // AI chat
  if (path === "/ai/chat" && method === "POST") {
    const body = (await req.json()) as { messages?: { role: "user" | "assistant" | "system"; content: string }[] };
    if (!body.messages?.length) return err("messages are required");
    const reply = await generateReply(body.messages);
    return json({ reply });
  }

  return err(`Not found: ${method} ${path}`, 404);
}
