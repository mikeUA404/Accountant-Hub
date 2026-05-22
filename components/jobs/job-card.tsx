// components/jobs/job-card.tsx
// Reusable job card displayed in the jobs listing grid

import Link from "next/link";
import {
  Building2,
  Clock,
  Calendar,
  Users,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobCardType } from "@/types";
import {
  formatBudgetRange,
  formatDateRelative,
  formatDeadline,
  parseSkills,
  isDeadlinePassed,
} from "@/utils";

interface JobCardProps {
  job: JobCardType;
}

export function JobCard({ job }: JobCardProps) {
  const deadlinePassed = isDeadlinePassed(job.deadline);

  return (
    <div className="group relative bg-card border border-border rounded-xl p-5 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-200 animate-fade-in">
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <Badge
          variant={job.status === "OPEN" ? "brand" : "closed"}
          className="text-xs"
        >
          {job.status === "OPEN" ? "● Open" : "● Closed"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatDateRelative(job.postedAt)}
        </span>
      </div>

      {/* Title */}
      <Link href={`/jobs/${job.id}`}>
        <h3 className="font-semibold text-base leading-snug mb-1.5 group-hover:text-brand transition-colors line-clamp-2">
          {job.title}
        </h3>
      </Link>

      {/* Company */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{job.company}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {job.shortDescription}
      </p>

      {/* Category */}
      <div className="mb-4">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
          style={{
            backgroundColor: `${job.category.color}15`,
            color: job.category.color ?? "#019a51",
            borderColor: `${job.category.color}30`,
          }}
        >
          {job.category.name}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-border mb-4">
        {/* Budget */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-brand font-semibold text-sm">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="truncate">
              {formatBudgetRange(job.budgetMin, job.budgetMax)
                .replace("$", "")
                .split(" – ")[0]}
              <span className="text-muted-foreground">+</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Budget</div>
        </div>

        {/* Bids */}
        <div className="text-center border-x border-border">
          <div className="flex items-center justify-center gap-1 font-semibold text-sm">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{job._count.bids}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Bids</div>
        </div>

        {/* Deadline */}
        <div className="text-center">
          <div
            className={`flex items-center justify-center gap-1 font-semibold text-sm ${
              deadlinePassed ? "text-red-400" : "text-foreground"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs truncate">
              {deadlinePassed ? "Expired" : formatDeadline(job.deadline).replace(" ago", "").replace("in ", "")}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Deadline</div>
        </div>
      </div>

      {/* Delivery time */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Clock className="w-3.5 h-3.5" />
        <span>Delivery: {job.deliveryTime}</span>
      </div>

      {/* CTA */}
      <Link href={`/jobs/${job.id}`} className="block">
        <Button
          variant={job.status === "OPEN" ? "brand" : "outline"}
          size="sm"
          className="w-full group/btn"
          disabled={job.status === "CLOSED"}
        >
          {job.status === "OPEN" ? "View & Apply" : "View Job"}
          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}
