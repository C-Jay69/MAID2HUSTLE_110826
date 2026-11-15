import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ServiceCard, CategoryChip, EmptyState } from "@/components/service-card";
import { PageHero } from "@/components/layout";
import { useRouter } from "@/lib/router";
import { BG } from "@/lib/page-images";
import { api, type Service } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ExplorePage() {
  const { params, navigate } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCat, setActiveCat] = useState<string>(params.category ?? "All");
  const [query, setQuery] = useState<string>(params.q ?? "");
  const [sort, setSort] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCat(params.category ?? "All");
    setQuery(params.q ?? "");
  }, [params.category, params.q]);

  useEffect(() => {
    api.categories().then((c) => setCategories(["All", ...c])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p: Record<string, string> = {};
    if (activeCat !== "All") p.category = activeCat;
    if (sort) p.sort = sort;
    if (query.trim()) p.q = query.trim();
    api
      .services(p)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [activeCat, sort, query]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <div>
      <PageHero
        image={BG.explore}
        eyebrow="Book in 60 seconds"
        title="Explore Services"
        subtitle={`${services.length} services${activeCat !== "All" ? ` in ${activeCat}` : ""} — background-checked pros, real-time availability and our $1,000 Trust & Safety Guarantee.`}
      >
        <form
          onSubmit={submitSearch}
          className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-4 border border-white/50 focus-within:border-primary w-full sm:w-96 shadow-xl shadow-black/20"
        >
          <Icon name="search" className="text-ink/40 text-[20px] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks & services..."
            className="flex-1 min-w-0 h-9 bg-transparent text-sm text-ink outline-none placeholder:text-gray-400"
          />
          <button type="submit" className="h-9 px-4 rounded-full gradient-bg text-xs font-bold">
            Search
          </button>
        </form>
      </PageHero>

      <div className="mb-6">
        {/* Category chips */}
        <div className="flex gap-2.5 mt-5 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((c) => (
            <CategoryChip key={c} label={c} active={activeCat === c} onClick={() => setActiveCat(c)} />
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2.5 mt-3 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSort(sort === "price-asc" ? "" : "price-asc")}
            className={cn(
              "flex h-8 shrink-0 items-center gap-x-2 rounded-full px-4 border transition-colors text-xs font-semibold",
              sort === "price-asc" ? "bg-primary/10 border-primary text-primary" : "bg-white border-line text-ink/60",
            )}
          >
            <Icon name="payments" className="text-sm" /> Price: Low → High
          </button>
          <button
            onClick={() => setSort(sort === "rating" ? "" : "rating")}
            className={cn(
              "flex h-8 shrink-0 items-center gap-x-2 rounded-full px-4 border transition-colors text-xs font-semibold",
              sort === "rating" ? "bg-primary/10 border-primary text-primary" : "bg-white border-line text-ink/60",
            )}
          >
            <Icon name="star" className="text-sm text-yellow-500" filled={sort === "rating"} /> Top Rated
          </button>
          <button
            onClick={() => setSort(sort === "price-desc" ? "" : "price-desc")}
            className={cn(
              "flex h-8 shrink-0 items-center gap-x-2 rounded-full px-4 border transition-colors text-xs font-semibold",
              sort === "price-desc" ? "bg-primary/10 border-primary text-primary" : "bg-white border-line text-ink/60",
            )}
          >
            <Icon name="filter_list" className="text-sm text-primary" /> Price: High → Low
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : services.length === 0 ? (
        <EmptyState icon="search_off" title="No services found" subtitle="Try a different search, category, or clear filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}