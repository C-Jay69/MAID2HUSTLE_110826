import { Database } from "bun:sqlite";

const db = new Database("maid2hustle.db", { create: true });

db.exec(`
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  avatar TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 5.0,
  hourly_rate REAL NOT NULL DEFAULT 0,
  bio TEXT,
  photo TEXT,
  availability TEXT NOT NULL DEFAULT '{}',
  verified INTEGER NOT NULL DEFAULT 0,
  approved INTEGER NOT NULL DEFAULT 0,
  jobs_done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  base_price REAL NOT NULL DEFAULT 0,
  duration_hours REAL NOT NULL DEFAULT 2,
  image TEXT,
  icon TEXT,
  rating REAL NOT NULL DEFAULT 5.0,
  reviews INTEGER NOT NULL DEFAULT 0,
  popular INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  vendor_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  total REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL UNIQUE,
  amount REAL NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'succeeded',
  transaction_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vendor_id INTEGER NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  tags TEXT NOT NULL DEFAULT '[]',
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  friends_joined INTEGER NOT NULL DEFAULT 0,
  total_earned REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  booking_id INTEGER,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
`);

export { db };
