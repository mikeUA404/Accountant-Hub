// app/(dashboard)/jobs/[id]/page.tsx
// Job detail page — full description, company info, skills, and bid form

import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getJobById } from "@/services/job.service";
import { Navbar } from "@/components/layout/navbar";
import { BidForm } from "@/components/bids/bid-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Tag,
  CheckCircle2,
  Paperclip,
  ArrowLeft,
  Lock,
  AlertCircle,
} from "lucide-react";
import {
  formatBudgetRange,
  formatDate,
  formatDeadline,
  formatDateRelative,
  parseSkills,
  isDeadlinePassed,
} from "@/utils";
import type { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getJobById(params.id);
  if (!result) return { title: "Job Not Found" };
  return { title: `${result.title} at ${result.company}` };
}

export default async function JobDetailPage({ params }: PageProps) {
  const session = await auth();
  const job = await getJobById(params.id, session?.user?.id);

  if (!job) notFound();

  const skills = parseSkills(job.skills);
  const deadlinePassed = isDeadlinePassed(job.deadline);
  const isClosed = job.status === "CLOSED";
  const userBid = (job as any).userBid;
  const bidCount = job._count?.bids ?? 0;
  const canBid = !isClosed && !deadlinePassed && session && !userBid;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={isClosed ? "closed" : "brand"}>
                      {isClosed ? "● Closed" : "● Open"}
                    </Badge>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: `${job.category.color}15`,
                        color: job.category.color ?? "#019a51",
                        borderColor: `${job.category.color}30`,
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      {job.category.name}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold leading-snug mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium text-foreground">{job.company}</span>
                    <span className="text-muted-foreground text-sm">
                      · Posted {formatDateRelative(job.postedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="flex items-center gap-1.5 text-brand font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatBudgetRange(job.budgetMin, job.budgetMax)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Budget Range</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{bidCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Bids Received</p>
                </div>
                <div>
                  <div
                    className={`flex items-center gap-1.5 font-semibold ${
                      deadlinePassed ? "text-red-400" : ""
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(job.deadline)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {deadlinePassed ? "Expired" : formatDeadline(job.deadline)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{job.deliveryTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Delivery Time</p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Job Description</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                {job.description.split("\n").map((line, i) => (
                  <p key={i} className={`text-muted-foreground leading-relaxed ${line === "" ? "mb-4" : "mb-2"}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 border border-brand/20 text-brand rounded-lg text-sm font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Attachments Placeholder */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
                Attachments
              </h2>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Paperclip className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No attachments provided for this job
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-5">
            {/* Company Info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">About the Client</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{job.company}</p>
                  <p className="text-xs text-muted-foreground">Verified Client</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="text-foreground">{job.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Posted</span>
                  <span className="text-foreground">{formatDate(job.postedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline</span>
                  <span className={deadlinePassed ? "text-red-400" : "text-foreground"}>
                    {formatDate(job.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bid / Apply Section */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">
                {userBid ? "Your Bid" : "Submit a Bid"}
              </h3>

              {/* Already bid */}
              {userBid && (
                <div className="bg-brand/10 border border-brand/20 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-brand mx-auto mb-2" />
                  <p className="font-medium text-sm mb-1">Bid Submitted!</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    You already submitted a bid for this job.
                  </p>
                  <Link href="/dashboard">
                    <Button variant="brand" size="sm" className="w-full">
                      View in Dashboard
                    </Button>
                  </Link>
                </div>
              )}

              {/* Job closed */}
              {!userBid && isClosed && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-sm mb-1">Job Closed</p>
                  <p className="text-xs text-muted-foreground">
                    This job is no longer accepting bids.
                  </p>
                </div>
              )}

              {/* Deadline passed */}
              {!userBid && !isClosed && deadlinePassed && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="font-medium text-sm mb-1 text-red-400">Deadline Passed</p>
                  <p className="text-xs text-muted-foreground">
                    The deadline for this job has expired.
                  </p>
                </div>
              )}

              {/* Not logged in */}
              {!userBid && !isClosed && !deadlinePassed && !session && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to be logged in to submit a bid.
                  </p>
                  <Link href={`/login?callbackUrl=/jobs/${job.id}`}>
                    <Button variant="brand" className="w-full mb-2">
                      Sign In to Apply
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}

              {/* Bid form — logged in, open job */}
              {canBid && (
                <BidForm
                  jobId={job.id}
                  jobTitle={job.title}
                  budgetMin={job.budgetMin}
                  budgetMax={job.budgetMax}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
