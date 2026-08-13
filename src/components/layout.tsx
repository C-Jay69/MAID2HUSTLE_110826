import { useRouter, Link } from "@/lib/router";
import { useAuth } from "@/lib/auth";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AppShell({ children, bottomNav = "customer" }: { children: ReactNode; bottomNav?: "customer" | "provider" | "admin" | "none" }) {
  const { path } = useRouter();
  const { user } = useAuth();

  const role = user?.role === "admin" ? "admin" : bottomNav === "provider" ? "provider" : user?.role === "vendor" ? "provider" : "customer";
  const active = bottomNav === "none" ? null : role;

  return (
    <div className="min-h-screen bg-black text-white font-display">
      <div className="relative max-w-md mx-auto min-h-screen flex flex-col overflow-x-hidden border-x border-white/5 bg-black">
        {children}
        {active && (
          <CustomerBottomNav active={active === "customer" ? path : undefined} mode={active} />
        )}
      </div>
    </div>
  );
}

function NavItem({
  active,
  icon,
  label,
  onClick,
  filled,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
  filled?: boolean;
}) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-primary" : "text-gray-500")}>
      <Icon name={icon} className="text-[22px]" filled={active || filled} />
      <span className={cn("text-[10px]", active ? "font-bold" : "font-medium")}>{label}</span>
    </button>
  );
}

function CustomerBottomNav({ active, mode }: { active?: string; mode: "customer" | "provider" | "admin" }) {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (mode === "admin" || isAdmin) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 pb-8 pt-2 z-40">
        <div className="flex justify-around items-center">
          <NavItem active={active === "/admin"} icon="dashboard" label="Dashboard" onClick={() => navigate("/admin")} filled />
          <NavItem active={active === "/admin/bookings"} icon="calendar_today" label="Bookings" onClick={() => navigate("/admin/bookings")} />
          <div className="relative">
            <button
              onClick={() => navigate("/admin/services")}
              className="absolute -top-8 left-1/2 -translate-x-1/2 size-14 flex items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/40"
            >
              <Icon name="add" className="text-[30px]" />
            </button>
            <div className="w-14"></div>
          </div>
          <NavItem active={active === "/admin/vendors"} icon="groups" label="Providers" onClick={() => navigate("/admin/vendors")} />
          <NavItem active={active === "/admin/earnings"} icon="payments" label="Earnings" onClick={() => navigate("/admin/earnings")} />
        </div>
      </nav>
    );
  }

  if (mode === "provider") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/90 backdrop-blur-xl border-t border-white/10 pb-8 pt-2 px-6 flex justify-between items-center z-40">
        <NavItem active={active === "/provider"} icon="dashboard" label="Dashboard" onClick={() => navigate("/provider")} filled />
        <NavItem active={active === "/provider/jobs"} icon="assignment" label="My Jobs" onClick={() => navigate("/provider/jobs")} />
        <NavItem active={active === "/provider/schedule"} icon="calendar_month" label="Schedule" onClick={() => navigate("/provider/schedule")} />
        <NavItem active={active === "/provider/earnings"} icon="payments" label="Earnings" onClick={() => navigate("/provider/earnings")} />
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/90 backdrop-blur-xl border-t border-white/10 pb-8 pt-2 z-40">
      <div className="flex justify-around items-center">
        <NavItem active={active === "/"} icon="home" label="Home" onClick={() => navigate("/")} />
        <NavItem active={active === "/explore"} icon="explore" label="Explore" onClick={() => navigate("/explore")} />
        <div className="relative">
          <button
            onClick={() => navigate("/explore")}
            className="absolute -top-7 left-1/2 -translate-x-1/2 size-14 flex items-center justify-center rounded-full gradient-bg text-white shadow-xl shadow-primary/40"
          >
            <Icon name="add" className="text-[30px]" />
          </button>
          <div className="w-14"></div>
        </div>
        <NavItem active={active === "/bookings"} icon="calendar_today" label="Bookings" onClick={() => navigate("/bookings")} />
        <NavItem active={active === "/profile"} icon="person" label="Profile" onClick={() => navigate("/profile")} />
      </div>
    </nav>
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
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-white/10 flex items-center px-4 h-16 gap-2",
        transparent ? "bg-transparent" : "glass-header",
      )}
    >
      {back ? (
        <button onClick={() => navigate(back)} className="flex items-center justify-center size-10 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <Icon name="arrow_back_ios_new" className="text-[22px]" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="size-8 gradient-bg rounded-lg flex items-center justify-center">
            <Icon name="bolt" className="text-white text-[20px]" />
          </div>
        </div>
      )}
      <div className={cn("flex-1 min-w-0", title ? "text-center" : "")}>
        {title && <h2 className="font-bold text-base truncate">{title}</h2>}
        {subtitle && <p className="text-[10px] font-bold tracking-widest text-primary uppercase">{subtitle}</p>}
      </div>
      <div className="flex items-center justify-end min-w-10">{right}</div>
    </header>
  );
}

export function BrandHeader({ onMenu }: { onMenu?: () => void }) {
  const { navigate } = useRouter();
  return (
    <nav className="sticky top-0 z-50 glass-header border-b border-white/10">
      <div className="flex items-center justify-between px-6 h-16 max-w-md mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 gradient-bg rounded-lg flex items-center justify-center">
            <Icon name="bolt" className="text-white text-[20px]" />
          </div>
          <h2 className="text-white text-lg font-black tracking-tighter uppercase">Maid 2 Hustle</h2>
        </Link>
        <button onClick={onMenu} className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors">
          <Icon name="menu" className="text-white text-[24px]" />
        </button>
      </div>
    </nav>
  );
}