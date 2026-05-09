"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  images: string[];
  slug: string;
  category: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  "yen-tinh-che": "Yến tinh chế",
  "yen-tho": "Yến thô",
  "nuoc-yen": "Nước yến",
};

export function ShopFilter({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(cats);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchQuery =
        !query || p.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, query, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm sản phẩm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-muted"
              }`}
            >
              {CATEGORY_LABEL[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <>
          {(query || activeCategory !== "all") && (
            <p className="text-sm text-muted-foreground">{filtered.length} sản phẩm</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={Number(p.price)}
                image={(p.images as string[])?.[0] ?? ""}
                slug={p.slug}
                stock={p.stock}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
