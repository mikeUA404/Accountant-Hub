// validations/bids.ts
import { z } from "zod";

export const bidSchema = z.object({
  proposedPrice: z
    .number({ required_error: "Proposed price is required" })
    .positive("Price must be greater than 0")
    .max(1000000, "Price seems too high"),
  deliveryTime: z
    .string()
    .min(2, "Delivery time is required")
    .max(100, "Delivery time too long"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter too long (max 2000 characters)"),
  experience: z
    .string()
    .min(20, "Experience summary must be at least 20 characters")
    .max(1000, "Experience summary too long (max 1000 characters)"),
  jobId: z.string().min(1, "Job ID is required"),
});

export type BidFormInput = z.infer<typeof bidSchema>;
