// types/index.ts
// Central type definitions for the entire application

// ─────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─────────────────────────────────────────
// USER TYPES
// ─────────────────────────────────────────
export interface UserPublic {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  skills?: string | null;
  createdAt: Date | string;
}

// ─────────────────────────────────────────
// CATEGORY TYPES
// ─────────────────────────────────────────
export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  _count?: { jobs: number };
}

// ─────────────────────────────────────────
// JOB TYPES
// ─────────────────────────────────────────
export type JobStatus = "OPEN" | "CLOSED";
export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface JobCardType {
  id: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  shortDescription: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date | string;
  deliveryTime: string;
  status: JobStatus;
  postedAt: Date | string;
  category: CategoryType;
  _count: { bids: number };
}

export interface JobType extends JobCardType {
  description: string;
  skills: string;
  attachments?: string | null;
  updatedAt: Date | string;
  categoryId: string;
  bids?: BidType[];
  userBid?: BidType | null;
}

// ─────────────────────────────────────────
// BID TYPES
// ─────────────────────────────────────────
export interface BidType {
  id: string;
  proposedPrice: number;
  deliveryTime: string;
  coverLetter: string;
  experience: string;
  status: BidStatus;
  submittedAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  jobId: string;
  user?: UserPublic;
  job?: JobCardType;
}

export interface BidWithJob extends BidType {
  job: JobCardType;
}

// ─────────────────────────────────────────
// DASHBOARD TYPES
// ─────────────────────────────────────────
export interface DashboardStats {
  totalBids: number;
  pendingBids: number;
  acceptedBids: number;
  rejectedBids: number;
}

// ─────────────────────────────────────────
// QUERY PARAMETER TYPES
// ─────────────────────────────────────────
export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  budgetMin?: number;
  budgetMax?: number;
  sort?: "newest" | "oldest" | "budget_desc" | "budget_asc";
  status?: JobStatus;
}
