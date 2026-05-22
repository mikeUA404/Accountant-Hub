// utils/index.ts
// General utility functions used throughout the app

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast } from "date-fns";

// ── Tailwind class merger ─────────────────────────────────
// Combines clsx and tailwind-merge for clean conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency formatting ───────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBudgetRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}

// ── Date formatting ───────────────────────────────────────

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isDeadlinePassed(date: Date | string): boolean {
  return isPast(new Date(date));
}

export function formatDeadline(date: Date | string): string {
  const d = new Date(date);
  if (isPast(d)) {
    return "Expired";
  }
  return formatDistanceToNow(d, { addSuffix: true });
}

// ── Skills parser ─────────────────────────────────────────
// Converts comma-separated string to array and back

export function parseSkills(skillsString: string): string[] {
  return skillsString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function stringifySkills(skills: string[]): string {
  return skills.join(", ");
}

// ── URL builder for jobs filter ───────────────────────────

export function buildJobsUrl(params: Record<string, string | number | undefined>): string {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      url.set(key, String(value));
    }
  });
  const query = url.toString();
  return query ? `/jobs?${query}` : "/jobs";
}

// ── Truncate text ─────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

// ── Status badge helpers ──────────────────────────────────

export function getJobStatusColor(status: string): string {
  switch (status) {
    case "OPEN":
      return "bg-brand/10 text-brand border-brand/20";
    case "CLOSED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

export function getBidStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "ACCEPTED":
      return "bg-brand/10 text-brand border-brand/20";
    case "REJECTED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}
