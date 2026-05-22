// app/(dashboard)/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  User, Mail, FileText, Tag, Lock, Save,
  Loader2, CheckCircle2, AlertCircle, ArrowLeft,
  Eye, EyeOff, Briefcase,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { parseSkills } from "@/utils";

// ── Validation schemas ─────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  bio: z.string().max(500, "Max 500 characters").optional().or(z.literal("")),
  skills: z.string().max(300, "Max 300 characters").optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must have uppercase, lowercase & number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ── Skill tag component ────────────────────────────────
function SkillTag({ skill, onRemove }: { skill: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand/10 border border-brand/20 text-brand rounded-lg text-xs font-medium">
      {skill}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-400 transition-colors font-bold leading-none"
        aria-label={`Remove ${skill}`}
      >
        ×
      </button>
    </span>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [loading, setLoading] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", bio: "", skills: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Load profile on mount
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          profileForm.reset({
            name: res.data.name ?? "",
            bio: res.data.bio ?? "",
            skills: res.data.skills ?? "",
          });
          setSkills(parseSkills(res.data.skills ?? ""));
        }
      })
      .catch(() => toast({ title: "Failed to load profile", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [status]);

  // ── Add skill tag ────────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 15) return;
    const updated = [...skills, trimmed];
    setSkills(updated);
    profileForm.setValue("skills", updated.join(","));
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    const updated = skills.filter((x) => x !== s);
    setSkills(updated);
    profileForm.setValue("skills", updated.join(","));
  };

  // ── Submit profile update ────────────────────────────
  const onProfileSubmit = async (data: ProfileForm) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, skills: skills.join(",") }),
    });
    const result = await res.json();
    if (result.success) {
      toast({ title: "Profile updated!", variant: "success" });
    } else {
      toast({ title: result.message ?? "Update failed", variant: "destructive" });
    }
  };

  // ── Submit password change ───────────────────────────
  const onPasswordSubmit = async (data: PasswordForm) => {
    const res = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      toast({ title: "Password changed successfully!", variant: "success" });
      passwordForm.reset();
    } else {
      toast({ title: result.message ?? "Failed to change password", variant: "destructive" });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          userName={session?.user?.name ?? "Accountant"}
          userEmail={session?.user?.email ?? ""}
        />
      </div>

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-muted-foreground hover:text-brand transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account information</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-6">
          {/* Avatar card */}
          <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5">
            <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{session?.user?.name}</h2>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                <span className="text-xs text-brand font-medium">Verified Accountant</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-muted/40 p-1 rounded-xl border border-border">
            {(["profile", "password"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "profile" ? "Profile Info" : "Change Password"}
              </button>
            ))}
          </div>

          {/* ── Profile Tab ─────────────────────────────── */}
          {activeTab === "profile" && (
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-5">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <User className="w-4 h-4 text-brand" /> Personal Information
              </h3>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
                </Label>
                <Input
                  id="name"
                  {...profileForm.register("name")}
                  className={profileForm.formState.errors.name ? "border-red-500" : ""}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-red-400">{profileForm.formState.errors.name.message}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                </Label>
                <Input
                  value={session?.user?.email ?? ""}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Bio
                </Label>
                <Textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell clients about yourself — your experience, specializations, and what makes you stand out..."
                  {...profileForm.register("bio")}
                  className={`min-h-[80px] ${profileForm.formState.errors.bio ? "border-red-500" : ""}`}
                />
                {profileForm.formState.errors.bio && (
                  <p className="text-xs text-red-400">{profileForm.formState.errors.bio.message}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">
                  {profileForm.watch("bio")?.length ?? 0}/500
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" /> Skills & Expertise
                </Label>

                {/* Skill tags display */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border border-border min-h-[44px]">
                    {skills.map((s) => (
                      <SkillTag key={s} skill={s} onRemove={() => removeSkill(s)} />
                    ))}
                  </div>
                )}

                {/* Skill input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. QuickBooks, CPA, GAAP..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addSkill} disabled={!skillInput.trim()}>
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter or click Add. {skills.length}/15 skills added.
                </p>
              </div>

              <Button
                type="submit"
                variant="brand"
                className="w-full gap-2"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><Save className="w-4 h-4" /> Save Profile</>
                }
              </Button>
            </form>
          )}

          {/* ── Password Tab ─────────────────────────────── */}
          {activeTab === "password" && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-5">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand" /> Change Password
              </h3>

              <div className="bg-muted/30 border border-border rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-brand mt-0.5 flex-shrink-0" />
                Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number.
              </div>

              {/* Current Password */}
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    {...passwordForm.register("currentPassword")}
                    className={`pr-10 ${passwordForm.formState.errors.currentPassword ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-red-400">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    {...passwordForm.register("newPassword")}
                    className={`pr-10 ${passwordForm.formState.errors.newPassword ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-400">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  {...passwordForm.register("confirmPassword")}
                  className={passwordForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-400">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="brand"
                className="w-full gap-2"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing...</>
                  : <><Lock className="w-4 h-4" /> Change Password</>
                }
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
