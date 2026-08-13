import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ServiceCard, CategoryChip, EmptyState } from "@/components/service-card";
import { useRouter } from "@/lib/router";
import { api, type Service } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ExplorePage() {
  const { params } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCat, setActiveCat] = useState<string>(params.category ?? "All");
  const [sort, setSort] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCat(params.category ?? "All");
  }, [params.category]);

  useEffect(() => {
    api.categories().then((c) => setCategories(["All", ...c])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p: Record<string, string> = {};
    if (activeCat !== "All") p.category = activeCat;
    if (sort) p.sort = sort;
    api
      .services(p)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [activeCat, sort]);

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <Icon name="cleaning_services" className="text-primary text-[28px]" />
            <h2 className="text-xl font-bold tracking-tight gradient-text">MAID 2 HUSTLE</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-[#2a2a2a] text-white">
              <Icon name="notifications" />
            </button>
            <button onClick={() => (window.location.hash = "/profile")} className="p-2 rounded-full bg-[#2a2a2a] text-white">
              <Icon name="person" />
            </button>
          </div>
        </div>
        {/* Category chips */}
        <div className="flex gap-3 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {categories.map((c) => (
            <CategoryChip key={c} label={c} active={activeCat === c} onClick={() => setActiveCat(c)} />
          ))}
        </div>
        {/* Sort */}
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSort(sort === "price-asc" ? "" : "price-asc")}
            className={cn(
              "flex h-8 shrink-0 items-center gap-x-2 rounded-xl px-4 border transition-colors",
              sort === "price-asc" ? "bg-primary/20 border-primary text-primary" : "bg-[#2a2a2a]/50 border-gray-700 text-gray-300",
            )}
          >
            <Icon name="payments" className="text-sm" />
            <p className="text-xs font-medium uppercase tracking-wider">Price</p>
          </button>
          <button
            onClick={() => setSort(sort === "rating" ? "" : "rating")}
            className={cn(
              "flex h-8 shrink-0 items-center gap-x-2 rounded-xl px-4 border transition-colors",
              sort === "rating" ? "bg-primary/20 border-primary text-primary" : "bg-[#2a2a2a]/50 border-gray-700 text-gray-300",
            )}
          >
            <Icon name="star" className="text-sm text-yellow-500" />
            <p className="text-xs font-medium uppercase tracking-wider">Rating</p>
          </button>
          <button
            onClick={() => setSort(sort === "price-desc" ? "" : "price-desc")}
            className="flex h-8 shrink-0 items-center gap-x-2 rounded-xl bg-[#2a2a2a]/50 border border-gray-700 px-4"
          >
            <Icon name="filter_list" className="text-sm text-primary" />
            <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">Top</p>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">{activeCat === "All" ? "Recommended for you" : activeCat}</h3>
          <span className="text-primary text-sm font-medium">{services.length} services</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : services.length === 0 ? (
          <EmptyState icon="search_off" title="No services found" subtitle="Try a different category or clear filters." />
        ) : (
          <div className="flex flex-col gap-5">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}