import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserBids, getUserDashboardStats } from "@/services/bid.service";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { BidsTable } from "@/components/dashboard/bids-table";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = session.user.id;

  // Fetch stats and bids in parallel
  const [stats, bids] = await Promise.all([
    getUserDashboardStats(userId),
    getUserBids(userId),
  ]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          userName={session.user.name ?? "Accountant"}
          userEmail={session.user.email ?? ""}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                Welcome back,{" "}
                {session.user.name?.split(" ")[0]} 👋
              </h1>

              <p className="text-sm text-muted-foreground">
                Here&apos;s an overview of your bidding activity
              </p>
            </div>

            <Link href="/jobs">
              <Button
                variant="brand"
                size="sm"
                className="gap-1.5 hidden sm:flex"
              >
                <Briefcase className="w-3.5 h-3.5" />

                Browse Jobs

                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats cards */}
          <section>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Overview
            </h2>

            <StatsCards stats={stats} />
          </section>

          {/* Bids table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                My Submitted Bids ({bids.length})
              </h2>

              {bids.length > 0 && (
                <Link
                  href="/jobs"
                  className="text-xs text-brand hover:underline flex items-center gap-1"
                >
                  Find more jobs

                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <BidsTable bids={bids} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}