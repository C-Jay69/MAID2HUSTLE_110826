import { useEffect } from "react";
import { RouterProvider, useRouter } from "@/lib/router";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout";
import { ChatWidget } from "@/components/chat-widget";
import { HomePage } from "@/pages/HomePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { SchedulePage } from "@/pages/SchedulePage";
import { BookingDetailsPage } from "@/pages/BookingDetailsPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { SuccessPage } from "@/pages/SuccessPage";
import { BookingsPage } from "@/pages/BookingsPage";
import { AuthPage } from "@/pages/AuthPage";
import { JoinProviderPage } from "@/pages/JoinProviderPage";
import { ProviderDashboardPage } from "@/pages/ProviderDashboardPage";
import { EarningsPage } from "@/pages/EarningsPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AdminVendorsPage, AdminBookingsPage, AdminServicesPage } from "@/pages/AdminPages";
import { TrackingPage } from "@/pages/TrackingPage";
import { ReferPage } from "@/pages/ReferPage";
import { RatePage } from "@/pages/RatePage";
import { ProfilePage, MenuPage } from "@/pages/ProfilePage";
import { CategoryPage } from "@/pages/CategoryPage";
import { AboutPage, ContactPage, HelpPage, BlogPage } from "@/pages/ContentPages";
import "./index.css";

function Shell() {
  const { path } = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // Pages with their own full-screen layout / no standard bottom nav
  if (path === "/login") return <AuthPage mode="login" />;
  if (path === "/register") return <AuthPage mode="register" />;
  if (path === "/success") return <SuccessPage />;
  if (path === "/tracking") return <TrackingPage />;

  const role = user?.role === "admin" ? "admin" : user?.role === "vendor" ? "provider" : "customer";

  let content: React.ReactNode;
  let bottomNav: "customer" | "provider" | "admin" | "none" = role as "customer" | "provider" | "admin";

  switch (true) {
    case path === "/":
      content = <HomePage />;
      break;
    case path.startsWith("/explore"):
      content = <ExplorePage />;
      break;
    case path.startsWith("/service/"):
      content = <ServiceDetailPage />;
      bottomNav = "none";
      break;
    case path.startsWith("/schedule"):
      content = <SchedulePage />;
      bottomNav = "none";
      break;
    case path.startsWith("/details"):
      content = <BookingDetailsPage />;
      bottomNav = "none";
      break;
    case path.startsWith("/checkout"):
      content = <CheckoutPage />;
      bottomNav = "none";
      break;
    case path.startsWith("/bookings"):
      content = <BookingsPage />;
      break;
    case path === "/join-provider":
      content = <JoinProviderPage />;
      bottomNav = "none";
      break;
    case path.startsWith("/profile"):
      content = <ProfilePage />;
      break;
    case path === "/menu":
      content = <MenuPage />;
      bottomNav = "none";
      break;
    case path.startsWith("/provider/earnings"):
      content = <EarningsPage />;
      bottomNav = "provider";
      break;
    case path.startsWith("/provider"):
      content = <ProviderDashboardPage />;
      bottomNav = "provider";
      break;
    case path === "/admin/vendors":
      content = <AdminVendorsPage />;
      bottomNav = "admin";
      break;
    case path === "/admin/bookings":
      content = <AdminBookingsPage />;
      bottomNav = "admin";
      break;
    case path === "/admin/services":
      content = <AdminServicesPage />;
      bottomNav = "admin";
      break;
    case path === "/admin/earnings":
      content = <EarningsPage />;
      bottomNav = "admin";
      break;
    case path.startsWith("/admin"):
      content = <AdminDashboardPage />;
      bottomNav = "admin";
      break;
    case path === "/refer":
      content = <ReferPage />;
      break;
    case path.startsWith("/rate"):
      content = <RatePage />;
      bottomNav = "none";
      break;
    case path === "/about":
      content = <AboutPage />;
      break;
    case path === "/categories":
      content = <CategoryPage />;
      break;
    case path === "/contact":
      content = <ContactPage />;
      break;
    case path === "/help":
      content = <HelpPage />;
      break;
    case path === "/blog":
      content = <BlogPage />;
      break;
    default:
      content = <HomePage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AppShell bottomNav={bottomNav}>
      {content}
      {path !== "/tracking" && <ChatWidget />}
    </AppShell>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;