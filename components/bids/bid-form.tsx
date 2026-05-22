// components/bids/bid-form.tsx
// Bid submission form with React Hook Form + Zod validation

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Send, DollarSign, Clock, FileText, User } from "lucide-react";
import { bidSchema, BidFormInput } from "@/validations/bids";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { formatBudgetRange } from "@/utils";

interface BidFormProps {
  jobId: string;
  jobTitle: string;
  budgetMin: number;
  budgetMax: number;
  onSuccess?: () => void;
}

export function BidForm({
  jobId,
  jobTitle,
  budgetMin,
  budgetMax,
  onSuccess,
}: BidFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BidFormInput>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      jobId,
      proposedPrice: budgetMin,
    },
  });

  const onSubmit = async (data: BidFormInput) => {
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Failed to submit bid",
          description: result.message ?? "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Bid submitted! 🎉",
        description: `Your bid for "${jobTitle}" was submitted successfully.`,
        variant: "success",
      });

      reset();
      onSuccess?.();
      router.refresh(); // Refresh server components to update bid count
    } catch {
      toast({
        title: "Network error",
        description: "Could not connect. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Hidden jobId */}
      <input type="hidden" {...register("jobId")} />

      {/* Budget hint */}
      <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 text-sm text-muted-foreground">
        💡 Client budget: <span className="text-brand font-medium">
          {formatBudgetRange(budgetMin, budgetMax)}
        </span>
      </div>

      {/* Proposed Price */}
      <div className="space-y-1.5">
        <Label htmlFor="proposedPrice" className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-brand" />
          Proposed Price (USD) <span className="text-red-400">*</span>
        </Label>
        <Input
          id="proposedPrice"
          type="number"
          step="0.01"
          placeholder="e.g. 2500"
          {...register("proposedPrice", { valueAsNumber: true })}
          className={errors.proposedPrice ? "border-red-500 focus-visible:ring-red-500/50" : ""}
        />
        {errors.proposedPrice && (
          <p className="text-xs text-red-400">{errors.proposedPrice.message}</p>
        )}
      </div>

      {/* Delivery Time */}
      <div className="space-y-1.5">
        <Label htmlFor="deliveryTime" className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand" />
          Estimated Delivery Time <span className="text-red-400">*</span>
        </Label>
        <Input
          id="deliveryTime"
          placeholder="e.g. 2 weeks, 10 business days"
          {...register("deliveryTime")}
          className={errors.deliveryTime ? "border-red-500" : ""}
        />
        {errors.deliveryTime && (
          <p className="text-xs text-red-400">{errors.deliveryTime.message}</p>
        )}
      </div>

      {/* Cover Letter */}
      <div className="space-y-1.5">
        <Label htmlFor="coverLetter" className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-brand" />
          Cover Letter / Proposal <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="coverLetter"
          rows={5}
          placeholder="Describe why you're the best fit for this job. Mention your approach, relevant experience, and what makes you stand out..."
          {...register("coverLetter")}
          className={`min-h-[120px] ${errors.coverLetter ? "border-red-500" : ""}`}
        />
        {errors.coverLetter ? (
          <p className="text-xs text-red-400">{errors.coverLetter.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
        )}
      </div>

      {/* Experience Summary */}
      <div className="space-y-1.5">
        <Label htmlFor="experience" className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-brand" />
          Relevant Experience Summary <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="experience"
          rows={3}
          placeholder="Briefly describe your relevant accounting experience, certifications (CPA, CMA), and similar projects you've completed..."
          {...register("experience")}
          className={`min-h-[80px] ${errors.experience ? "border-red-500" : ""}`}
        />
        {errors.experience ? (
          <p className="text-xs text-red-400">{errors.experience.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Minimum 20 characters</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting Bid...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Bid
          </>
        )}
      </Button>
    </form>
  );
}
