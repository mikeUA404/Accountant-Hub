// app/(dashboard)/jobs/page.tsx
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { JobCard } from "@/components/jobs/job-card";
import { JobsFilter } from "@/components/jobs/jobs-filter";
import { Pagination } from "@/components/shared/pagination";
import { getJobs, getCategories } from "@/services/job.service";
import { jobsQuerySchema } from "@/validations/jobs";
import { Briefcase, SearchX } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Browse Accounting Jobs" };

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-16 bg-muted rounded-full" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
      <div className="h-5 w-3/4 bg-muted rounded" />
      <div className="h-4 w-1/2 bg-muted rounded" />
      <div className="h-12 bg-muted rounded" />
      <div className="h-4 w-24 bg-muted rounded-full" />
      <div className="grid grid-cols-3 gap-2 py-3">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
      <div className="h-9 bg-muted rounded-lg" />
    </div>
  );
}

export default async function JobsPage({ searchParams }: PageProps) {
  const rawParams = {
    page: searchParams.page ?? "1",
    limit: "9",
    search: searchParams.search,
    category: searchParams.category,
    budgetMin: searchParams.budgetMin,
    budgetMax: searchParams.budgetMax,
    sort: searchParams.sort ?? "newest",
    status: searchParams.status,
  };

  const parsed = jobsQuerySchema.safeParse(rawParams);
  const query = parsed.success ? parsed.data : { page: 1, limit: 9, sort: "newest" as const };

  const [{ jobs, pagination }, categories] = await Promise.all([
    getJobs(query),
    getCategories(),
  ]);

  const hasFilters = !!(searchParams.search || searchParams.category || searchParams.budgetMin || searchParams.budgetMax);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Accounting Jobs</h1>
          <p className="text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} job${pagination.total !== 1 ? "s" : ""} available`
              : "No jobs found"}
            {searchParams.search && (
              <span className="ml-1">
                for &quot;<span className="text-foreground">{searchParams.search}</span>&quot;
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <Suspense fallback={<div className="h-96 bg-card border border-border rounded-xl animate-pulse" />}>
                <JobsFilter categories={categories} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  {hasFilters ? <SearchX className="w-8 h-8 text-muted-foreground" /> : <Briefcase className="w-8 h-8 text-muted-foreground" />}
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {hasFilters ? "No jobs match your filters" : "No jobs available"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {hasFilters ? "Try adjusting your search or filters to find more opportunities." : "Check back soon — new accounting jobs are posted regularly."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                <Suspense>
                  <Pagination meta={pagination} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
