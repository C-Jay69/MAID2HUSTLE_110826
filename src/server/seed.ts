import { db } from "./db";
import { hashPassword } from "./auth";

export const SERVICES = [
  {
    title: "Deep House Cleaning",
    category: "Cleaning",
    description:
      "Professional deep sterilization and vacuuming for every corner of your living space. Includes baseboards, inside cabinets, and heavy-duty scrubbing.",
    base_price: 89,
    duration_hours: 3,
    icon: "cleaning_services",
    rating: 4.9,
    reviews: 120,
    popular: 1,
  },
  {
    title: "Move-in / Move-out",
    category: "Cleaning",
    description:
      "Comprehensive sanitization and preparation for your new or old home. Ready for keys in a single visit.",
    base_price: 150,
    duration_hours: 4,
    icon: "local_shipping",
    rating: 4.8,
    reviews: 85,
    popular: 0,
  },
  {
    title: "Exterior Window Wash",
    category: "Cleaning",
    description:
      "Streak-free cleaning for high-rise and residential windows. Professional grade equipment and safety certified.",
    base_price: 120,
    duration_hours: 3,
    icon: "window",
    rating: 4.7,
    reviews: 42,
    popular: 0,
  },
  {
    title: "Plumbing Repair",
    category: "Plumbing",
    description:
      "Fast, licensed plumbers for leaks, clogs, faucets and pipe repairs. Parts warranty included on every job.",
    base_price: 80,
    duration_hours: 2,
    icon: "plumbing",
    rating: 4.8,
    reviews: 96,
    popular: 0,
  },
  {
    title: "Emergency Plumbing",
    category: "Plumbing",
    description:
      "24/7 emergency response for burst pipes, flooding and major leaks. Average response under 45 minutes.",
    base_price: 145,
    duration_hours: 2,
    icon: "emergency",
    rating: 4.9,
    reviews: 34,
    popular: 1,
  },
  {
    title: "Electrical Fixes & Safety Check",
    category: "Electrical",
    description:
      "Certified electricians for outlets, fixtures, breaker trips and full home safety inspections.",
    base_price: 90,
    duration_hours: 2,
    icon: "bolt",
    rating: 4.7,
    reviews: 61,
    popular: 0,
  },
  {
    title: "Landscaping & Lawn Care",
    category: "Landscaping",
    description:
      "Full-service lawn maintenance, hedge trimming, and seasonal garden refreshes from green-thumb pros.",
    base_price: 65,
    duration_hours: 2,
    icon: "park",
    rating: 4.6,
    reviews: 78,
    popular: 0,
  },
  {
    title: "HVAC Servicing & Tune-up",
    category: "HVAC",
    description:
      "Air conditioner and furnace servicing, filter replacement and efficiency tune-ups to keep you comfortable.",
    base_price: 75,
    duration_hours: 2,
    icon: "ac_unit",
    rating: 4.8,
    reviews: 53,
    popular: 0,
  },
  {
    title: "Home Moving & Heavy Lifting",
    category: "Moving",
    description:
      "Professional movers with trucks for apartments and homes. Fragile-item care and careful assembly.",
    base_price: 120,
    duration_hours: 4,
    icon: "local_shipping",
    rating: 4.7,
    reviews: 88,
    popular: 0,
  },
  {
    title: "Assembly & Handyman",
    category: "Handyman",
    description:
      "Furniture assembly, shelf mounting, door fixes and everyday repairs from a vetted handyman.",
    base_price: 55,
    duration_hours: 2,
    icon: "handyman",
    rating: 4.8,
    reviews: 142,
    popular: 1,
  },
];

export const VENDOR_SEEDS = [
  {
    name: "Sarah J.",
    service_type: "Cleaning",
    hourly_rate: 28,
    bio: "Verified cleaning specialist with 6+ years of experience and 150+ completed jobs.",
    rating: 4.9,
    jobs_done: 150,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
      tue: ["08:00-10:00", "10:00-12:00"],
      wed: ["12:00-14:00", "16:00-18:00"],
      thu: ["08:00-10:00", "10:00-12:00", "12:00-14:00"],
      fri: ["08:00-10:00", "14:00-16:00"],
    }),
  },
  {
    name: "Marcus Thompson",
    service_type: "Plumbing",
    hourly_rate: 42,
    bio: "Licensed master plumber, on-call for emergencies across the metro area.",
    rating: 4.8,
    jobs_done: 210,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"],
      tue: ["08:00-10:00", "10:00-12:00"],
      wed: ["08:00-10:00", "12:00-14:00", "14:00-16:00"],
      thu: ["10:00-12:00", "14:00-16:00", "16:00-18:00"],
      fri: ["08:00-10:00", "10:00-12:00"],
    }),
  },
  {
    name: "Elena Rodriguez",
    service_type: "Cleaning",
    hourly_rate: 25,
    bio: "Move-in/move-out specialist known for sparkling results and careful attention to detail.",
    rating: 4.8,
    jobs_done: 96,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["12:00-14:00", "16:00-18:00"],
      tue: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
      wed: ["08:00-10:00", "10:00-12:00"],
      thu: ["08:00-10:00", "12:00-14:00", "16:00-18:00"],
      fri: ["10:00-12:00", "14:00-16:00", "16:00-18:00"],
    }),
  },
  {
    name: "David Park",
    service_type: "Electrical",
    hourly_rate: 48,
    bio: "Certified residential electrician, safety-first mindset, same-week availability.",
    rating: 4.7,
    jobs_done: 132,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00"],
      tue: ["08:00-10:00", "12:00-14:00", "14:00-16:00"],
      wed: ["08:00-10:00", "10:00-12:00", "16:00-18:00"],
      thu: ["08:00-10:00", "10:00-12:00"],
      fri: ["08:00-10:00", "12:00-14:00"],
    }),
  },
  {
    name: "Grace Kim",
    service_type: "Landscaping",
    hourly_rate: 30,
    bio: "Landscape designer turning boring yards into beautiful outdoor living spaces.",
    rating: 4.6,
    jobs_done: 88,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00"],
      tue: ["08:00-10:00", "10:00-12:00", "12:00-14:00"],
      wed: ["08:00-10:00", "10:00-12:00"],
      thu: ["10:00-12:00", "14:00-16:00"],
      fri: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
    }),
  },
  {
    name: "Robert Chen",
    service_type: "Moving",
    hourly_rate: 40,
    bio: "Professional mover with a truck and team. Careful packing and on-time arrivals.",
    rating: 4.7,
    jobs_done: 175,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00", "12:00-14:00"],
      tue: ["08:00-10:00", "10:00-12:00"],
      wed: ["08:00-10:00", "14:00-16:00", "16:00-18:00"],
      thu: ["08:00-10:00", "10:00-12:00", "12:00-14:00"],
      fri: ["08:00-10:00", "10:00-12:00"],
    }),
  },
  {
    name: "Amara Osei",
    service_type: "HVAC",
    hourly_rate: 45,
    bio: "HVAC technician keeping homes cool in summer and cozy in winter. EPA certified.",
    rating: 4.8,
    jobs_done: 104,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "12:00-14:00", "14:00-16:00"],
      tue: ["08:00-10:00", "10:00-12:00"],
      wed: ["08:00-10:00", "10:00-12:00", "16:00-18:00"],
      thu: ["08:00-10:00", "12:00-14:00"],
      fri: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
    }),
  },
  {
    name: "Liam O'Brien",
    service_type: "Handyman",
    hourly_rate: 35,
    bio: "Jack of all trades — furniture, fixtures, drywall and everything in between. Same-day often available.",
    rating: 4.9,
    jobs_done: 240,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00"],
      tue: ["08:00-10:00", "10:00-12:00"],
      wed: ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"],
      thu: ["08:00-10:00", "12:00-14:00", "14:00-16:00"],
      fri: ["08:00-10:00", "10:00-12:00"],
    }),
  },
  {
    name: "Priya Sharma",
    service_type: "Plumbing",
    hourly_rate: 38,
    bio: "Friendly neighborhood plumber with top reviews for honest pricing and neat work.",
    rating: 4.8,
    jobs_done: 118,
    verified: 1,
    approved: 1,
    availability: JSON.stringify({
      mon: ["10:00-12:00", "14:00-16:00"],
      tue: ["08:00-10:00", "10:00-12:00", "16:00-18:00"],
      wed: ["08:00-10:00", "10:00-12:00"],
      thu: ["08:00-10:00", "14:00-16:00"],
      fri: ["08:00-10:00", "12:00-14:00", "16:00-18:00"],
    }),
  },
];

export function seedDatabase() {
  const existing = db.query("SELECT COUNT(*) AS n FROM services").get() as { n: number };
  if (existing.n > 0) return;

  const insertService = db.prepare(
    `INSERT INTO services (title, category, description, base_price, duration_hours, icon, rating, reviews, popular)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const s of SERVICES) {
    insertService.run(s.title, s.category, s.description, s.base_price, s.duration_hours, s.icon, s.rating, s.reviews, s.popular);
  }

  // Demo accounts: admin, provider, customer
  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
  );
  const adminId = insertUser.run("Admin", "admin@maid2hustle.com", hashPassword("admin123"), "+1 555 0100", "admin").lastInsertRowid;
  const providerId = insertUser.run("Alex Rivera", "alex@maid2hustle.com", hashPassword("provider123"), "+1 555 0101", "vendor").lastInsertRowid;
  insertUser.run("C-Jay", "customer@maid2hustle.com", hashPassword("customer123"), "+1 555 0102", "customer");

  const insertVendor = db.prepare(
    `INSERT INTO vendors (user_id, name, service_type, hourly_rate, bio, rating, jobs_done, verified, approved, availability)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  insertVendor.run(
    providerId as number,
    "Alex Rivera",
    "Cleaning",
    30,
    "Full-time cleaning pro with a 5-star record across 200+ bookings.",
    4.9,
    200,
    1,
    1,
    JSON.stringify({
      mon: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
      tue: ["08:00-10:00", "10:00-12:00"],
      wed: ["08:00-10:00", "12:00-14:00", "16:00-18:00"],
      thu: ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
      fri: ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"],
    }),
  );

  for (const v of VENDOR_SEEDS) {
    const uid = insertUser.run(v.name, `${v.name.toLowerCase().replace(/[^a-z]/g, ".")}@vendor.com`, hashPassword("vendor123"), null, "vendor").lastInsertRowid;
    insertVendor.run(uid as number, v.name, v.service_type, v.hourly_rate, v.bio, v.rating, v.jobs_done, v.verified, v.approved, v.availability);
  }

  const admin = db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as { id: number };
  const referral = db.prepare(`INSERT INTO referrals (user_id, code, friends_joined, total_earned) VALUES (?, ?, ?, ?)`);
  referral.run(admin.id, "HUSTLE2024", 18, 360);
}
