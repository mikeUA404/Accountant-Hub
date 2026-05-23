// components/dashboard/stats-cards.tsx
// Dashboard statistics overview cards

import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Bids",
      value: stats.totalBids,
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      label: "Pending",
      value: stats.pendingBids,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
    },
    {
      label: "Accepted",
      value: stats.acceptedBids,
      icon: CheckCircle,
      color: "text-brand",
      bg: "bg-brand/10",
      border: "border-brand/20",
    },
    {
      label: "Rejected",
      value: stats.rejectedBids,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-card border ${card.border} rounded-xl p-4 flex items-center gap-4`}
        >
          <div className={`${card.bg} ${card.border} border rounded-lg p-2.5 flex-shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
