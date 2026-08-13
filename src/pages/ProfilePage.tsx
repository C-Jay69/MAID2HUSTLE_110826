import { Icon } from "@/components/ui/icon";
import { TopBar } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { ProviderAvatar } from "@/components/service-card";

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24">
      <TopBar title="Profile" back="/" />

      <div className="p-5 flex flex-col items-center pt-6">
        <div className="relative">
          <div className="size-20 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-black">
            {user?.name?.[0] ?? "G"}
          </div>
          <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Icon name="check" className="text-black text-[14px]" filled />
          </div>
        </div>
        <h1 className="text-white text-2xl font-black mt-3">{user?.name ?? "Guest"}</h1>
        <p className="text-gray-400 text-sm">
          {user?.email ?? "Sign in to manage your account"} {user && `• ${user.role}`}
        </p>
        <p className="text-gray-600 text-xs mt-1">Member since 2026</p>
      </div>

      <div className="px-5 space-y-2 mt-4">
        <MenuItem icon="badge" label="Personal Information" onClick={() => {}} />
        <MenuItem icon="credit_card" label="Payment Methods" onClick={() => (window.location.hash = "/bookings")} />
        <MenuItem icon="notifications" label="Notification Settings" onClick={() => {}} />
        <MenuItem icon="help" label="Help & Support" onClick={() => (window.location.hash = "/help")} />
        <MenuItem icon="share" label="Refer a Friend" onClick={() => (window.location.hash = "/refer")} />
        {user?.role === "vendor" && (
          <MenuItem icon="work" label="Provider Dashboard" onClick={() => (window.location.hash = "/provider")} />
        )}
        {user?.role === "admin" && (
          <MenuItem icon="shield" label="Admin Dashboard" onClick={() => (window.location.hash = "/admin")} />
        )}
        {!user ? (
          <MenuItem icon="login" label="Sign In / Register" onClick={() => (window.location.hash = "/login")} />
        ) : (
          <button
            onClick={logout}
            className="w-full mt-4 h-12 rounded-xl border border-red-500/30 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
          >
            <Icon name="logout" className="text-[20px]" />
            Log Out
          </button>
        )}
      </div>

      <p className="text-center text-gray-700 text-xs mt-8">MAID 2 HUSTLE v1.0.0</p>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 bg-[#2a2a2a] px-4 py-4 rounded-xl border border-white/5 hover:border-primary/40 transition-colors text-left">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon name={icon} className="text-primary text-[20px]" />
      </div>
      <span className="flex-1 font-medium text-sm">{label}</span>
      <Icon name="chevron_right" className="text-gray-500" />
    </button>
  );
}

export function MenuPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar title="Menu" back="/" />
      <div className="p-5">
        <div className="flex items-center gap-4 bg-[#2a2a2a] rounded-2xl p-4 border border-white/5 mb-6">
          <ProviderAvatar name={user?.name ?? "G"} size="h-14 w-14" />
          <div>
            <p className="font-bold text-lg">{user?.name ?? "Guest"}</p>
            <p className="text-gray-400 text-sm">{user?.email ?? "Sign in for personalized services"}</p>
          </div>
        </div>
        <div className="space-y-2">
          <MenuItem icon="explore" label="Explore Services" onClick={() => (window.location.hash = "/explore")} />
          <MenuItem icon="calendar_today" label="My Bookings" onClick={() => (window.location.hash = "/bookings")} />
          <MenuItem icon="work" label="Become a Provider" onClick={() => (window.location.hash = "/join-provider")} />
          <MenuItem icon="share" label="Refer a Friend" onClick={() => (window.location.hash = "/refer")} />
          <MenuItem icon="menu_book" label="About Us" onClick={() => (window.location.hash = "/about")} />
          <MenuItem icon="contact_support" label="Contact" onClick={() => (window.location.hash = "/contact")} />
          <MenuItem icon="help" label="Help Center" onClick={() => (window.location.hash = "/help")} />
          <MenuItem icon="rss_feed" label="Blog" onClick={() => (window.location.hash = "/blog")} />
          {user ? (
            <MenuItem icon="person" label="Profile & Settings" onClick={() => (window.location.hash = "/profile")} />
          ) : (
            <MenuItem icon="login" label="Sign In" onClick={() => (window.location.hash = "/login")} />
          )}
        </div>
      </div>
    </div>
  );
}