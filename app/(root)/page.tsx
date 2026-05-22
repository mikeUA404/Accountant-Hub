// app/(root)/page.tsx
// Homepage / landing page

import Link from "next/link";
import { ArrowRight, Briefcase, Shield, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { getJobs, getCategories } from "@/services/job.service";
import { JobCard } from "@/components/jobs/job-card";

export default async function HomePage() {
  // Show 3 featured open jobs on homepage
  const { jobs } = await getJobs({ page: 1, limit: 3, sort: "newest", status: "OPEN" });
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero Section ─────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 text-center relative">
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 text-sm text-brand mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              {jobs.length > 0 ? `${jobs.length}+ accounting jobs available` : "New jobs posted daily"}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Find Accounting Jobs.
              <br />
              <span className="text-brand">Win More Clients.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              The specialized marketplace connecting skilled accountants with companies that need their expertise. Browse, bid, and grow your practice.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs">
                <Button size="lg" variant="brand" className="gap-2 min-w-[180px]">
                  Browse Jobs
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="min-w-[180px]">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────── */}
        <section className="py-16 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Briefcase,
                  title: "Specialized Jobs",
                  desc: "Tax, audit, bookkeeping, payroll — jobs matched to your expertise.",
                },
                {
                  icon: Shield,
                  title: "Secure Bidding",
                  desc: "Submit proposals confidently with our protected platform.",
                },
                {
                  icon: Zap,
                  title: "Fast Matching",
                  desc: "Get in front of clients faster with smart filtering and search.",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ───────────────────────────────────────── */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/jobs?category=${cat.slug}`}
                  className="group flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-brand/40 hover:bg-brand/5 transition-all"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: cat.color ?? "#019a51" }}
                  />
                  <span className="text-sm font-medium group-hover:text-brand transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({cat._count?.jobs ?? 0})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Jobs ─────────────────────────────────────── */}
        {jobs.length > 0 && (
          <section className="py-16 bg-card/50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Latest Opportunities</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Fresh accounting jobs posted recently
                  </p>
                </div>
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-lg mx-auto bg-card border border-border rounded-2xl p-10">
              <TrendingUp className="w-10 h-10 text-brand mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Ready to grow your practice?</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Join hundreds of accountants already winning clients on Accountant Hub.
              </p>
              <Link href="/register">
                <Button variant="brand" size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Accountant<span className="text-brand">Hub</span></span>
            <span className="text-muted-foreground">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/jobs" className="hover:text-brand transition-colors">Jobs</Link>
            <Link href="/login" className="hover:text-brand transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-brand transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
