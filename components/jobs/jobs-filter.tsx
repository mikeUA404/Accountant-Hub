// components/jobs/jobs-filter.tsx
// Filter panel for the jobs listing page

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/types";

interface JobsFilterProps {
  categories: CategoryType[];
}

export function JobsFilter({ categories }: JobsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset page when filtering
      params.set("page", "1");
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/jobs");
  };

  const hasActiveFilters =
    searchParams.get("search") ||
    searchParams.get("category") ||
    searchParams.get("budgetMin") ||
    searchParams.get("budgetMax") ||
    searchParams.get("sort");

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand" />
          <h3 className="font-semibold text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-brand flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Job title, company..."
            className="pl-9"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => {
              // Debounce search input
              const timer = setTimeout(() => updateParam("search", e.target.value), 400);
              return () => clearTimeout(timer);
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Category
        </label>
        <div className="relative">
          <Select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => updateParam("category", e.target.value)}
            className="pr-8"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat._count?.jobs ?? 0})
              </option>
            ))}
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            ▾
          </div>
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Budget Range (USD)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("budgetMin") ?? ""}
            onChange={(e) => updateParam("budgetMin", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("budgetMax") ?? ""}
            onChange={(e) => updateParam("budgetMax", e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Sort By
        </label>
        <div className="relative">
          <Select
            value={searchParams.get("sort") ?? "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="pr-8"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget_desc">Highest Budget</option>
            <option value="budget_asc">Lowest Budget</option>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            ▾
          </div>
        </div>
      </div>

      {/* Status filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Status
        </label>
        <div className="flex gap-2">
          {["", "OPEN", "CLOSED"].map((status) => (
            <button
              key={status || "all"}
              onClick={() => updateParam("status", status)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                searchParams.get("status") === status ||
                (!searchParams.get("status") && status === "")
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted-foreground hover:border-brand/30"
              }`}
            >
              {status === "" ? "All" : status === "OPEN" ? "Open" : "Closed"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
