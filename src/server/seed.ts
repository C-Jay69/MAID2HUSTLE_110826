import { db } from "./db";
import { hashPassword } from "./auth";

type ServiceSeed = { title: string; category: string; description: string; base_price: number; duration_hours: number; icon: string; rating: number; reviews: number; popular: number; image?: string };

const CATEGORY_ICON: Record<string, string> = {
  Cleaning: "cleaning_services",
  "Home Repairs": "handyman",
  "Furniture Assembly": "chair",
  "Mounting & Installation": "tv",
  "Moving & Packing": "local_shipping",
  "Yard Work & Gardening": "yard",
  "Shopping & Delivery": "shopping_cart",
  "Holiday Help": "celebration",
  "Winter Tasks": "ac_unit",
  "Personal Assistant": "support_agent",
  Organization: "inventory_2",
  "Virtual & Online": "computer",
  "Office Services": "business_center",
  Painting: "brush",
};

const CATEGORY_TAGLINE: Record<string, string> = {
  Cleaning: "a sparkling, sanitized space from top-rated cleaning pros.",
  "Home Repairs": "fixes done right the first time by vetted craftspeople.",
  "Furniture Assembly": "fast, sturdy assembly without the frustration.",
  "Mounting & Installation": "safely mounted, perfectly installed, hassle-free.",
  "Moving & Packing": "heavy lifting and logistics handled with care.",
  "Yard Work & Gardening": "a lawn and garden you'll love coming home to.",
  "Shopping & Delivery": "errands run and deliveries handled while you focus.",
  "Holiday Help": "festive setups and take-downs handled for you.",
  "Winter Tasks": "cozy, safe, and ready for the season.",
  "Personal Assistant": "your time back, one task at a time.",
  Organization: "a calm, orderly space designed for your life.",
  "Virtual & Online": "expert help from anywhere, done online.",
  "Office Services": "a polished, productive office without the busywork.",
  Painting: "fresh, crisp, professional paintwork.",
};

const SPECIAL_ICONS: Record<string, string> = {
  "Wait in Line": "schedule",
  "TV Mounting": "tv",
  "Hang Art, Mirror & Decor": "photo_frame",
  "Grocery Shopping & Delivery": "shopping_cart",
  "Coffee Delivery": "coffee",
  "Breakfast Delivery": "bakery_dining",
  "Data Entry": "keyboard",
  "Computer Help": "computer",
  "Snow Removal": "snowing",
  "Residential Snow Removal": "snowing",
  "Sidewalk Salting": "snowing",
  "Hang Christmas Lights": "celebration",
  "Gift Wrapping Services": "redeem",
  "Holiday Decorating": "celebration",
  "Christmas Tree Delivery": "park",
  "Christmas Tree Removal": "park",
  "Pool Table Movers": "sports",
  "Pressure Washing": "water_drop",
  "Car Washing": "local_car_wash",
  "Laundry Help": "laundry",
  "Hot Tub Cleaning": "hot_tub",
  "Lawn Mowing Services": "yard",
  "Tree Trimming Service": "park",
  "Hedge Trimming Service": "content_cut",
  "Leaf Raking & Removal": "yard",
  "Install Air Conditioner": "ac_unit",
  "AC Winterization": "ac_unit",
  "Home Theater Installing": "surround_sound",
  "Smart Home Installation": "smart_button",
  "Ceiling Fan Installation": "air",
  "Heavy Lifting": "fitness_center",
  "Cabinet Installation": "kitchen",
  "Wallpapering Service": "wallpaper",
  "Drywall Repair Service": "format_paint",
  "Baby Proofing": "child_friendly",
  "Doorbell Installation": "doorbell",
  "Storage Unit Moving": "warehouse",
  "Junk Pickup": "delete",
  "Running Your Errands": "list_alt",
  "Interior Design Service": "chair",
  "Office Interior Design": "chair",
  "Office Administration": "desk",
  "Virtual Assistant": "support_agent",
  "Moving Office Furniture": "move_up",
  "Delivery Service": "local_shipping",
  "Disassemble Furniture": "handyman",
  "Toy Assembly Service": "toys",
  "One Item Movers": "local_shipping",
  "Couch Removal": "weekend",
  "Couch Assembly": "weekend",
  "Chair Assembly": "chair",
  "Desk Assembly": "desk",
  "Bed Assembly": "bed",
  "Dresser Assembly": "table_restaurant",
  "Wardrobe Assembly": "door_sliding",
  "Outdoor Party Setup": "celebration",
  "Pipe Insulation": "plumbing",
  "Window Winterization": "window",
  "Water Heater Maintenance": "water_heater",
};

const desc = (title: string, category: string) =>
  `${title} — ${CATEGORY_TAGLINE[category] ?? "professional service, booked in seconds."} Every booking is backed by our $1,000 Trust & Safety Guarantee.`;

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

// [title, category, base_price, duration_hours]
const TASKS: [string, string, number, number][] = [
  // ---- Cleaning ----
  ["Deep Cleaning", "Cleaning", 60, 2],
  ["Spring Cleaning", "Cleaning", 89, 3],
  ["House Cleaning Services", "Cleaning", 50, 2],
  ["Disinfecting Services", "Cleaning", 55, 2],
  ["Move In Cleaning", "Cleaning", 120, 3],
  ["Move Out Cleaning", "Cleaning", 140, 4],
  ["Vacation Rental Cleaning", "Cleaning", 95, 3],
  ["Carpet Cleaning Service", "Cleaning", 70, 2],
  ["Garage Cleaning", "Cleaning", 75, 2],
  ["One Time Cleaning Services", "Cleaning", 65, 2],
  ["Car Washing", "Cleaning", 35, 1],
  ["Laundry Help", "Cleaning", 30, 1],
  ["Pressure Washing", "Cleaning", 85, 2],
  ["Party Cleaning", "Cleaning", 65, 2],
  ["General Cleaning", "Cleaning", 50, 2],
  ["Exterior Window Wash", "Cleaning", 120, 3],

  // ---- Home Repairs ----
  ["Home Repairs", "Home Repairs", 55, 2],
  ["Handyman", "Home Repairs", 55, 2],
  ["Plumbing", "Home Repairs", 80, 2],
  ["Emergency Plumbing", "Home Repairs", 145, 2],
  ["Door, Cabinet & Furniture Repair", "Home Repairs", 60, 2],
  ["Appliance Installation & Repairs", "Home Repairs", 75, 2],
  ["Drywall Repair Service", "Home Repairs", 70, 2],
  ["Flooring & Tiling Help", "Home Repairs", 80, 2],
  ["Electrical Help", "Home Repairs", 90, 2],
  ["Sealing & Caulking", "Home Repairs", 45, 1],
  ["Window & Blinds Repair", "Home Repairs", 60, 2],
  ["Baby Proofing", "Home Repairs", 65, 2],
  ["Home Maintenance", "Home Repairs", 70, 2],
  ["Carpentry Services", "Home Repairs", 85, 3],
  ["Cabinet Installation", "Home Repairs", 90, 2],
  ["Wallpapering Service", "Home Repairs", 80, 3],
  ["Fence Installation & Repair Services", "Home Repairs", 120, 4],
  ["Deck Restoration Services", "Home Repairs", 150, 5],
  ["Smart Home Installation", "Home Repairs", 95, 2],
  ["AC & HVAC Tune-up", "Home Repairs", 75, 2],

  // ---- Furniture Assembly ----
  ["Furniture Assembly", "Furniture Assembly", 45, 1],
  ["Patio Furniture Assembly", "Furniture Assembly", 50, 1],
  ["Desk Assembly", "Furniture Assembly", 40, 1],
  ["Dresser Assembly", "Furniture Assembly", 45, 1],
  ["Bed Assembly", "Furniture Assembly", 55, 1],
  ["Bookshelf Assembly", "Furniture Assembly", 40, 1],
  ["Couch Assembly", "Furniture Assembly", 60, 1],
  ["Chair Assembly", "Furniture Assembly", 30, 1],
  ["Wardrobe Assembly", "Furniture Assembly", 60, 1],
  ["Table Assembly", "Furniture Assembly", 35, 1],
  ["Disassemble Furniture", "Furniture Assembly", 40, 1],
  ["Toy Assembly Service", "Furniture Assembly", 30, 1],

  // ---- Mounting & Installation ----
  ["TV Mounting", "Mounting & Installation", 65, 1],
  ["Install Shelves, Rods & Hooks", "Mounting & Installation", 50, 1],
  ["Ceiling Fan Installation", "Mounting & Installation", 65, 1],
  ["Install Blinds & Window Treatments", "Mounting & Installation", 60, 2],
  ["Hang Art, Mirror & Decor", "Mounting & Installation", 45, 1],
  ["General Mounting", "Mounting & Installation", 55, 1],
  ["Doorbell Installation", "Mounting & Installation", 55, 1],
  ["Home Theater Installing", "Mounting & Installation", 110, 3],
  ["Install Air Conditioner", "Mounting & Installation", 85, 2],

  // ---- Moving & Packing ----
  ["Help Moving", "Moving & Packing", 85, 3],
  ["Truck Assisted Help Moving", "Moving & Packing", 140, 4],
  ["Packing Services & Help", "Moving & Packing", 60, 2],
  ["Unpacking Services", "Moving & Packing", 55, 2],
  ["Heavy Lifting", "Moving & Packing", 50, 2],
  ["Local Movers", "Moving & Packing", 130, 4],
  ["Junk Pickup", "Moving & Packing", 90, 2],
  ["Furniture Movers", "Moving & Packing", 95, 2],
  ["One Item Movers", "Moving & Packing", 60, 1],
  ["Storage Unit Moving", "Moving & Packing", 110, 3],
  ["Couch Removal", "Moving & Packing", 55, 1],
  ["Mattress Pick-Up & Removal", "Moving & Packing", 45, 1],
  ["Furniture Removal", "Moving & Packing", 70, 2],
  ["Pool Table Movers", "Moving & Packing", 160, 3],
  ["Appliance Removal", "Moving & Packing", 50, 1],
  ["Heavy Furniture Moving", "Moving & Packing", 85, 2],
  ["Rearranging Furniture", "Moving & Packing", 60, 2],
  ["Full Service Help Moving", "Moving & Packing", 200, 5],
  ["In-Home Furniture Movers", "Moving & Packing", 75, 2],

  // ---- Yard Work & Gardening ----
  ["Yard Work Services", "Yard Work & Gardening", 55, 2],
  ["Gardening Services", "Yard Work & Gardening", 60, 2],
  ["Weed Removal", "Yard Work & Gardening", 45, 1],
  ["Lawn Care Services", "Yard Work & Gardening", 60, 2],
  ["Lawn Mowing Services", "Yard Work & Gardening", 50, 1],
  ["Landscaping Services", "Yard Work & Gardening", 95, 3],
  ["Gutter Cleaning", "Yard Work & Gardening", 70, 2],
  ["Tree Trimming Service", "Yard Work & Gardening", 110, 3],
  ["Vacation Plant Watering", "Yard Work & Gardening", 35, 1],
  ["Patio Cleaning", "Yard Work & Gardening", 55, 1],
  ["Hot Tub Cleaning", "Yard Work & Gardening", 75, 2],
  ["Fence Staining", "Yard Work & Gardening", 95, 3],
  ["Mulching Services", "Yard Work & Gardening", 60, 2],
  ["Lawn Fertilizer Service", "Yard Work & Gardening", 55, 1],
  ["Hedge Trimming Service", "Yard Work & Gardening", 65, 1],
  ["Outdoor Party Setup", "Yard Work & Gardening", 80, 2],
  ["Urban Gardening Service", "Yard Work & Gardening", 70, 2],
  ["Leaf Raking & Removal", "Yard Work & Gardening", 50, 2],
  ["Produce Gardening", "Yard Work & Gardening", 60, 2],
  ["Hose Installation", "Yard Work & Gardening", 45, 1],
  ["Shed Maintenance", "Yard Work & Gardening", 75, 2],

  // ---- Shopping & Delivery ----
  ["Delivery Service", "Shopping & Delivery", 35, 1],
  ["Grocery Shopping & Delivery", "Shopping & Delivery", 40, 1],
  ["Running Your Errands", "Shopping & Delivery", 45, 2],
  ["Deliver Big Piece of Furniture", "Shopping & Delivery", 70, 2],
  ["Drop Off Donations", "Shopping & Delivery", 45, 1],
  ["Contactless Delivery", "Shopping & Delivery", 35, 1],
  ["Pet Food Delivery", "Shopping & Delivery", 30, 1],
  ["Baby Food Delivery", "Shopping & Delivery", 30, 1],
  ["Return Items", "Shopping & Delivery", 35, 1],
  ["Wait for Delivery", "Shopping & Delivery", 30, 1],
  ["Shipping", "Shopping & Delivery", 45, 1],
  ["Breakfast Delivery", "Shopping & Delivery", 25, 1],
  ["Coffee Delivery", "Shopping & Delivery", 20, 1],

  // ---- Holiday Help ----
  ["Gift Wrapping Services", "Holiday Help", 35, 1],
  ["Hang Christmas Lights", "Holiday Help", 70, 2],
  ["Christmas Tree Delivery", "Holiday Help", 60, 1],
  ["Christmas Tree Removal", "Holiday Help", 45, 1],
  ["Holiday Decorating", "Holiday Help", 65, 2],

  // ---- Winter Tasks ----
  ["Snow Removal", "Winter Tasks", 70, 2],
  ["Sidewalk Salting", "Winter Tasks", 40, 1],
  ["Window Winterization", "Winter Tasks", 65, 2],
  ["Residential Snow Removal", "Winter Tasks", 95, 3],
  ["AC Winterization", "Winter Tasks", 60, 1],
  ["Winter Yardwork", "Winter Tasks", 55, 2],
  ["Pipe Insulation", "Winter Tasks", 45, 1],
  ["Storm Door Installation", "Winter Tasks", 65, 1],
  ["Winter Deck Maintenance", "Winter Tasks", 60, 1],
  ["Water Heater Maintenance", "Winter Tasks", 75, 2],

  // ---- Personal Assistant ----
  ["Personal Assistant", "Personal Assistant", 40, 2],
  ["Wait in Line", "Personal Assistant", 40, 2],

  // ---- Organization ----
  ["Organize Home", "Organization", 70, 2],
  ["Closet Organization Service", "Organization", 80, 2],
  ["Interior Design Service", "Organization", 90, 2],
  ["Organize a Room", "Organization", 65, 2],

  // ---- Virtual & Online ----
  ["Virtual Assistant", "Virtual & Online", 35, 2],
  ["Data Entry", "Virtual & Online", 30, 2],
  ["Computer Help", "Virtual & Online", 40, 1],

  // ---- Office Services ----
  ["Office Cleaning", "Office Services", 70, 2],
  ["Office Tech Setup", "Office Services", 95, 2],
  ["Office Movers", "Office Services", 150, 4],
  ["Office Supply & Snack Delivery", "Office Services", 40, 1],
  ["Office Furniture Assembly", "Office Services", 65, 2],
  ["Office Setup & Organization", "Office Services", 85, 3],
  ["Office Administration", "Office Services", 40, 2],
  ["Office Interior Design", "Office Services", 95, 2],
  ["Moving Office Furniture", "Office Services", 80, 2],
  ["Office Mounting Service", "Office Services", 60, 1],

  // ---- Painting ----
  ["Painting", "Painting", 85, 3],
];

const FEATURED = new Set([
  "Spring Cleaning",
  "Home Repairs",
  "Handyman",
  "Plumbing",
  "Door, Cabinet & Furniture Repair",
  "Appliance Installation & Repairs",
  "Drywall Repair Service",
  "Electrical Help",
  "Smart Home Installation",
  "Furniture Assembly",
  "TV Mounting",
  "Hang Art, Mirror & Decor",
  "Help Moving",
  "Heavy Lifting",
  "Yard Work Services",
  "Wait in Line",
  "Closet Organization Service",
  "Painting",
]);

export const SERVICES: ServiceSeed[] = TASKS.map(([title, category, base_price, duration_hours]) => {
  const h = hash(title);
  const imageMap: Record<string, string> = {
    "Deep Cleaning": "/deepcleaning.jpeg",
    "Emergency Plumbing": "/emergency_plumbing.jpeg",
    "Home Repairs": "/assembly&handyman.jpeg",
    "Handyman": "/assembly&handyman.jpeg",
  };
  return {
    title,
    category,
    description: desc(title, category),
    base_price,
    duration_hours,
    icon: SPECIAL_ICONS[title] ?? CATEGORY_ICON[category] ?? "cleaning_services",
    rating: 4.5 + (h % 5) / 10,
    reviews: 20 + (h % 180),
    popular: FEATURED.has(title) ? 1 : 0,
    image: imageMap[title] ?? null,
  };
});

const AVAILABILITY_POOLS = [
  ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"],
  ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
  ["10:00-12:00", "12:00-14:00", "16:00-18:00"],
  ["08:00-10:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"],
];

function mkVendor(index: number, name: string, service_type: string, hourly_rate: number, bio: string, jobs_done: number, verified = 1, approved = 1) {
  const pool = AVAILABILITY_POOLS[index % AVAILABILITY_POOLS.length];
  const weekdays = ["mon", "tue", "wed", "thu", "fri"];
  const availability: Record<string, string[]> = {};
  weekdays.forEach((d, i) => {
    availability[d] = i % 2 === 0 ? pool : pool.slice(1, 3);
  });
  return {
    name,
    service_type,
    hourly_rate,
    bio,
    rating: 4.6 + ((index * 3) % 4) / 10,
    jobs_done,
    verified,
    approved,
    availability: JSON.stringify(availability),
  };
}

export const VENDOR_SEEDS = [
  mkVendor(0, "Sarah J.", "Cleaning", 28, "Verified cleaning specialist with 6+ years of experience and 150+ completed jobs.", 150),
  mkVendor(1, "Marcus Thompson", "Home Repairs", 42, "Licensed master plumber, on-call for emergencies across the metro area.", 210),
  mkVendor(2, "Elena Rodriguez", "Cleaning", 25, "Move-in/move-out specialist known for sparkling results and careful detail.", 96),
  mkVendor(3, "David Park", "Home Repairs", 48, "Certified residential electrician with a safety-first mindset.", 132),
  mkVendor(4, "Grace Kim", "Yard Work & Gardening", 30, "Landscape designer turning boring yards into beautiful outdoor spaces.", 88),
  mkVendor(5, "Robert Chen", "Moving & Packing", 40, "Professional mover with a truck and team. Careful packing, on-time arrivals.", 175),
  mkVendor(6, "Amara Osei", "Home Repairs", 45, "HVAC technician keeping homes cool in summer and cozy in winter.", 104),
  mkVendor(7, "Liam O'Brien", "Home Repairs", 35, "Jack of all trades — furniture, fixtures, drywall and everything in between.", 240),
  mkVendor(8, "Priya Sharma", "Home Repairs", 38, "Friendly neighborhood pro with top reviews for honest pricing and neat work.", 118),
  mkVendor(9, "Tony Alvarez", "Furniture Assembly", 32, "Furniture assembly expert — IKEA master and beyond. Same-day bookings.", 165),
  mkVendor(10, "Nina Patel", "Mounting & Installation", 38, "Precision mounting specialist for TVs, shelves, art and ceiling fans.", 142),
  mkVendor(11, "Leo Martins", "Yard Work & Gardening", 34, "Full-service yard care — mowing, trimming, gutters and seasonal cleanups.", 120),
  mkVendor(12, "Jordan Reyes", "Shopping & Delivery", 22, "Fast, friendly errand runner and delivery pro. Groceries, returns, drop-offs.", 98),
  mkVendor(13, "Maya Brooks", "Holiday Help", 30, "Holiday magic maker — lights, decor, wrapping and party cleanup.", 64),
  mkVendor(14, "Derek Frost", "Winter Tasks", 36, "Winter-ready pro for snow, salting, winterization and water heaters.", 87),
  mkVendor(15, "Aisha Cole", "Personal Assistant", 28, "Your reliable personal assistant — errands, waiting in line, organization.", 76),
  mkVendor(16, "Hannah Lee", "Organization", 33, "Professional organizer who turns cluttered rooms into calm systems.", 91),
  mkVendor(17, "Sam Tran", "Virtual & Online", 26, "Virtual assistant and computer help for whatever your day needs.", 58),
  mkVendor(18, "Chris Nguyen", "Office Services", 31, "Office setup, admin, and logistics to keep your business running smooth.", 72),
  mkVendor(19, "Marco Rossi", "Painting", 39, "Crisp interior painting with meticulous prep and clean lines.", 110),
];

export function seedDatabase() {
  const existing = db.query("SELECT COUNT(*) AS n FROM services").get() as { n: number };
  if (existing.n > 0) return;

  const insertService = db.prepare(
    `INSERT INTO services (title, category, description, base_price, duration_hours, icon, rating, reviews, popular, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const s of SERVICES) {
    insertService.run(s.title, s.category, s.description, s.base_price, s.duration_hours, s.icon, s.rating, s.reviews, s.popular, s.image);
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