// components/dashboard/bids-table.tsx
// Table showing user's submitted bids

import Link from "next/link";
import { ExternalLink, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BidWithJob } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatBudgetRange,
  getBidStatusColor,
  getJobStatusColor,
} from "@/utils";

interface BidsTableProps {
  bids: BidWithJob[];
}

export function BidsTable({ bids }: BidsTableProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium mb-1">No bids submitted yet</p>
        <p className="text-sm">
          Browse available jobs and submit your first bid
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand hover:underline"
        >
          Browse Jobs →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Job
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
              Your Bid
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
              Job Budget
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
              Submitted
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bids.map((bid) => (
            <tr
              key={bid.id}
              className="hover:bg-accent/30 transition-colors"
            >
              {/* Job info */}
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                    {bid.job.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {bid.job.company}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {bid.job.category.name}
                  </span>
                </div>
              </td>

              {/* Your bid price */}
              <td className="py-4 px-4 hidden md:table-cell">
                <span className="font-semibold text-brand">
                  {formatCurrency(bid.proposedPrice)}
                </span>
              </td>

              {/* Job budget */}
              <td className="py-4 px-4 hidden lg:table-cell text-muted-foreground">
                {formatBudgetRange(bid.job.budgetMin, bid.job.budgetMax)}
              </td>

              {/* Date */}
              <td className="py-4 px-4 hidden sm:table-cell text-muted-foreground">
                {formatDate(bid.submittedAt)}
              </td>

              {/* Status badges */}
              <td className="py-4 px-4">
                <div className="flex flex-col gap-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getBidStatusColor(bid.status)}`}
                  >
                    {bid.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getJobStatusColor(bid.job.status)}`}
                  >
                    Job: {bid.job.status}
                  </span>
                </div>
              </td>

              {/* View link */}
              <td className="py-4 px-4 text-right">
                <Link
                  href={`/jobs/${bid.job.id}`}
                  className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                >
                  View <ExternalLink className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
