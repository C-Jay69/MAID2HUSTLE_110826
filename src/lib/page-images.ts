/**
 * Central map of the photography in `public/backgrounds/`.
 *
 * The originals in `public/` are full-resolution exports; the files in
 * `public/backgrounds/` are web-optimised (~1600–1920px, progressive JPEG)
 * copies used for page backdrops and hero banners.
 */
export const BG = {
  home: "/backgrounds/home.jpg",
  explore: "/backgrounds/explore.jpg",
  providers: "/backgrounds/providers.jpg",
  cleaning: "/backgrounds/cleaning.jpg",
  plumbing: "/backgrounds/plumbing.jpg",
  assembly: "/backgrounds/assembly.jpg",
  services: "/backgrounds/services.jpg",
  support: "/backgrounds/support.jpg",
  team: "/backgrounds/team.jpg",
  mounting: "/backgrounds/mounting.jpg",
} as const;

/** Pick the photographic backdrop for a route. */
export function pageBackground(path: string): string {
  if (path === "/") return BG.home;
  if (path.startsWith("/explore") || path.startsWith("/service/")) return BG.explore;
  if (path === "/categories") return BG.services;
  if (path === "/schedule" || path.startsWith("/details")) return BG.assembly;
  if (path.startsWith("/checkout")) return BG.mounting;
  if (path.startsWith("/join-provider") || path.startsWith("/provider") || path.startsWith("/profile") || path === "/menu")
    return BG.providers;
  if (path === "/about" || path === "/contact" || path === "/blog") return BG.team;
  if (path === "/help" || path.startsWith("/admin")) return BG.cleaning;
  if (path.startsWith("/bookings") || path === "/rate" || path === "/refer") return BG.support;
  return BG.home;
}

/** Fallback photography for service cards, keyed by category. */
export const CATEGORY_IMAGES: Record<string, string> = {
  Cleaning: BG.cleaning,
  Plumbing: BG.plumbing,
  Electrical: BG.services,
  HVAC: BG.services,
  Handyman: BG.assembly,
  Landscaping: BG.home,
  Moving: BG.home,
  "Home Repairs": BG.plumbing,
  "Furniture Assembly": BG.assembly,
  "Mounting & Installation": BG.mounting,
  "Moving & Packing": BG.home,
  "Yard Work & Gardening": BG.home,
  "Shopping & Delivery": BG.support,
  "Personal Assistant": BG.team,
  Organization: BG.services,
  "Holiday Help": BG.support,
  "Winter Tasks": BG.cleaning,
  "Office Services": BG.services,
  "Virtual & Online": BG.services,
  Painting: BG.assembly,
};

export function serviceImage(service: { category?: string; image?: string | null }): string {
  // Only trust image paths that point at the optimised asset folder; older
  // rows may still contain the original filenames.
  if (service.image?.startsWith("/backgrounds/")) return service.image;
  return (service.category && CATEGORY_IMAGES[service.category]) || BG.cleaning;
}
