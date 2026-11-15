import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/layout";
import { useRouter } from "@/lib/router";
import { BG } from "@/lib/page-images";
import { BROWSE_CATEGORIES, CATEGORY_SUBCATEGORIES, SUBCATEGORY_ICONS } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryPage() {
  const { navigate } = useRouter();
  const [openCat, setOpenCat] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHero
        image={BG.services}
        eyebrow="Every task, covered"
        title="Browse by Category"
        subtitle="Find the perfect service for your task. Browse our curated categories and select a sub-category to see available providers."
      />

      <div className="px-1 pb-6">
        <div className="grid gap-3">
          {BROWSE_CATEGORIES.map((cat) => {
            const subs = CATEGORY_SUBCATEGORIES[cat.label] ?? [];
            const isOpen = openCat === cat.label;
            return (
              <div key={cat.label} className="bg-white rounded-2xl border border-line shadow-sm">
                <button
                  onClick={() => setOpenCat(isOpen ? null : cat.label)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-primary/5 transition-colors"
                >
                  <div className="size-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Icon name={cat.icon} className="text-white text-[22px]" />
                  </div>
                  <span className="text-lg font-bold flex-1">{cat.label}</span>
                  <span className="text-xs font-semibold text-ink/40 bg-primary/10 px-2.5 py-1 rounded-full">
                    {subs.length} services
                  </span>
                  <Icon
                    name={isOpen ? "expand_less" : "expand_more"}
                    className="text-ink/40 text-[22px] shrink-0 transition-transform"
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-line">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {subs.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => navigate(`/explore?q=${encodeURIComponent(sub)}`)}
                          className={cn(
                            "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left",
                            "bg-primary/5 hover:bg-primary/10 transition-colors group",
                          )}
                        >
                          <Icon
                            name={SUBCATEGORY_ICONS[sub] ?? "circle"}
                            className="text-primary text-[18px] group-hover:text-primary transition-colors"
                          />
                          <span className="text-sm font-medium text-ink/80 group-hover:text-ink transition-colors">
                            {sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-24" />
    </div>
  );
}
