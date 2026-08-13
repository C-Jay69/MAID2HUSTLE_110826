import { useState } from "react";
import { useRouter, Link } from "@/lib/router";
import { useAuth } from "@/lib/auth";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Role = "customer" | "provider" | "admin";

export function AppShell({
  children,
  bottomNav = "customer",
}: {
  children: ReactNode;
  bottomNav?: Role | "none";
}) {
  const { path } = useRouter();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const role: Role =
    user?.role === "admin" ? "admin" : user?.role === "vendor" || bottomNav === "provider" ? "provider" : "customer";

  const links: { to: string; label: string; active: boolean }[] = [
    { to: "/", label: "Home", active: path === "/" },
    { to: "/explore", label: "Explore Services", active: path.startsWith("/explore") || path.startsWith("/service/") },
    { to: "/bookings", label: "My Bookings", active: path.startsWith("/bookings") },
    { to: "/refer", label: "Refer & Earn", active: path === "/refer" },
    { to: "/join-provider", label: "Become a Provider", active: path === "/join-provider" },
    { to: "/about", label: "About", active: path === "/about" },
  ];

  const dashboardLink =
    role === "admin"
      ? { to: "/admin", label: "Admin Dashboard", active: path.startsWith("/admin") }
      : role === "provider"
        ? { to: "/provider", label: "Provider Dashboard", active: path.startsWith("/provider") }
        : null;

  const allLinks = dashboardLink ? [...links, dashboardLink] : links;

  return (
    <div className="min-h-screen bg-page text-ink font-display">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 glass-header border-b border-line">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="size-9 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Icon name="bolt" className="text-[22px]" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase">
                Maid <span className="gradient-text">2 Hustle</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {allLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                    l.active ? "text-primary bg-primary/10" : "text-ink/70 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <SearchBox />
              <div className="hidden sm:block">
                <AuthButtons />
              </div>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden size-10 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Icon name={menuOpen ? "close" : "menu"} className="text-[24px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-line bg-white/95">
            <nav className="mx-auto w-full max-w-7xl px-4 py-3 flex flex-col gap-1">
              {allLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-semibold",
                    l.active ? "text-primary bg-primary/10" : "hover:bg-primary/5",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="sm:hidden pt-2 border-t border-line mt-1">
                <AuthButtons />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      {/* Mobile bottom nav */}
      {bottomNav !== "none" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-line pb-[env(safe-area-inset-bottom)]">
          <MobileNav mode={role} />
        </div>
      )}

      <Footer />
    </div>
  );
}

function SearchBox() {
  const { navigate } = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
      }}
      className="hidden lg:flex items-center gap-2 h-10 px-3 rounded-full bg-white border border-line focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 w-64"
    >
      <Icon name="search" className="text-ink/40 text-[20px]" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tasks & services..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </form>
  );
}

function AuthButtons() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors"
        >
          <span className="size-8 rounded-full gradient-bg flex items-center justify-center text-sm font-black">
            {user.name?.[0]?.toUpperCase() ?? "G"}
          </span>
          <span className="text-sm font-bold hidden xl:block">{user.name.split(" ")[0]}</span>
        </button>
        <button onClick={logout} className="hidden xl:block p-2 text-ink/50 hover:text-destructive transition-colors" title="Log out">
          <Icon name="logout" className="text-[20px]" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 rounded-full text-sm font-bold text-ink hover:text-primary transition-colors"
      >
        Sign In
      </button>
      <button
        onClick={() => navigate("/register")}
        className="px-5 py-2 rounded-full gradient-bg text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
      >
        Get Started
      </button>
    </div>
  );
}

function NavItem({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn("flex flex-col items-center gap-1 py-2 flex-1 transition-colors", active ? "text-primary" : "text-ink/50")}
    >
      <Icon name={icon} className="text-[22px]" filled={active} />
      <span className={cn("text-[10px]", active ? "font-bold" : "font-medium")}>{label}</span>
    </button>
  );
}

function MobileNav({ mode }: { mode: Role }) {
  const { navigate } = useRouter();
  const { path } = useRouter();
  if (mode === "admin") {
    const items = [
      { to: "/admin", icon: "dashboard", label: "Dashboard" },
      { to: "/admin/bookings", icon: "calendar_today", label: "Bookings" },
      { to: "/admin/vendors", icon: "groups", label: "Providers" },
      { to: "/admin/earnings", icon: "payments", label: "Earnings" },
    ];
    return (
      <div className="flex items-stretch">
        {items.map((i) => (
          <NavItem key={i.to} active={path.startsWith(i.to)} icon={i.icon} label={i.label} onClick={() => navigate(i.to)} />
        ))}
      </div>
    );
  }
  if (mode === "provider") {
    const items = [
      { to: "/provider", icon: "dashboard", label: "Dashboard" },
      { to: "/provider/jobs", icon: "assignment", label: "My Jobs" },
      { to: "/provider/earnings", icon: "payments", label: "Earnings" },
      { to: "/profile", icon: "person", label: "Profile" },
    ];
    return (
      <div className="flex items-stretch">
        {items.map((i) => (
          <NavItem key={i.to} active={path.startsWith(i.to)} icon={i.icon} label={i.label} onClick={() => navigate(i.to)} />
        ))}
      </div>
    );
  }
  const items = [
    { to: "/", icon: "home", label: "Home", exact: true },
    { to: "/explore", icon: "explore", label: "Explore" },
    { to: "/bookings", icon: "calendar_today", label: "Bookings" },
    { to: "/profile", icon: "person", label: "Profile" },
  ];
  return (
    <div className="flex items-stretch">
      {items.map((i) => (
        <NavItem
          key={i.to}
          active={i.exact ? path === i.to : path.startsWith(i.to)}
          icon={i.icon}
          label={i.label}
          onClick={() => navigate(i.to)}
        />
      ))}
    </div>
  );
}

export function TopBar({
  title,
  subtitle,
  back,
  right,
  transparent,
}: {
  title?: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
  transparent?: boolean;
}) {
  const { navigate } = useRouter();
  return (
    <header className={cn("flex items-center gap-3 py-2", !transparent && "border-b border-line mb-4")}>
      {back ? (
        <button
          onClick={() => navigate(back)}
          className="flex items-center justify-center size-10 -ml-2 rounded-full hover:bg-primary/10 transition-colors"
        >
          <Icon name="arrow_back_ios_new" className="text-[20px]" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="size-8 gradient-bg rounded-lg flex items-center justify-center">
            <Icon name="bolt" className="text-[18px]" />
          </div>
        </div>
      )}
      <div className={cn("flex-1 min-w-0", title ? "text-left" : "")}>
        {title && <h2 className="font-black text-xl tracking-tight truncate">{title}</h2>}
        {subtitle && <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{subtitle}</p>}
      </div>
      <div className="flex items-center justify-end min-w-10">{right}</div>
    </header>
  );
}

export function BrandHeader() {
  const { navigate } = useRouter();
  return (
    <div className="flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="size-9 gradient-bg rounded-xl flex items-center justify-center">
          <Icon name="bolt" className="text-[22px]" />
        </div>
        <span className="text-xl font-black tracking-tight uppercase">
          Maid <span className="gradient-text">2 Hustle</span>
        </span>
      </Link>
      <button onClick={() => navigate("/menu")} className="md:hidden size-10 flex items-center justify-center rounded-lg hover:bg-primary/10">
        <Icon name="menu" className="text-[24px]" />
      </button>
    </div>
  );
}

const FOOTER_CATS = ["Cleaning", "Furniture Assembly", "Mounting & Installation", "Moving", "Yard Work", "Home Repairs", "Shopping & Delivery", "Personal Assistant"];

function Footer() {
  const { navigate } = useRouter();
  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 gradient-bg rounded-lg flex items-center justify-center">
              <Icon name="bolt" className="text-[18px]" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase">
              Maid <span className="gradient-text">2 Hustle</span>
            </span>
          </div>
          <p className="text-sm text-ink/60 leading-relaxed">
            Empowering workers to become thriving businesses. Book trusted home services in minutes — backed by our $1,000 Trust &amp; Safety Guarantee.
          </p>
        </div>
        <div>
          <p className="font-bold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm text-ink/60">
            {[
              { label: "Explore Services", to: "/explore" },
              { label: "My Bookings", to: "/bookings" },
              { label: "Become a Provider", to: "/join-provider" },
              { label: "Refer & Earn", to: "/refer" },
              { label: "Help Center", to: "/help" },
            ].map((l) => (
              <li key={l.label}>
                <button onClick={() => navigate(l.to)} className="hover:text-primary transition-colors">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold mb-3">Popular Categories</p>
          <ul className="space-y-2 text-sm text-ink/60">
            {FOOTER_CATS.map((c) => (
              <li key={c}>
                <button onClick={() => navigate(`/explore?category=${encodeURIComponent(c)}`)} className="hover:text-primary transition-colors">
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold mb-3">Get in Touch</p>
          <ul className="space-y-2 text-sm text-ink/60">
            <li className="flex items-center gap-2">
              <Icon name="mail" className="text-primary text-[18px]" /> support@maid2hustle.com
            </li>
            <li className="flex items-center gap-2">
              <Icon name="call" className="text-primary text-[18px]" /> +1 (555) 012-3456
            </li>
            <li className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary text-[18px]" /> Trust &amp; Safety Guarantee
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-sm text-ink/50">
        © 2026 MAID 2 HUSTLE. Built for the modern hustle.
      </div>
    </footer>
  );
}
