// components/shared/pagination.tsx
// Reusable pagination component

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/types";
import { cn } from "@/utils";

interface PaginationProps {
  meta: PaginationMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/jobs?${params.toString()}`);
  };

  if (meta.totalPages <= 1) return null;

  // Build page numbers array with ellipsis logic
  const pages: (number | "...")[] = [];
  const { page, totalPages } = meta;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(page - 1)}
        disabled={!meta.hasPrevPage}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p as number)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                p === page
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(page + 1)}
        disabled={!meta.hasNextPage}
        className="gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
