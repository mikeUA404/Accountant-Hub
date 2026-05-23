// components/layout/navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Briefcase, LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Accountant<span className="text-brand">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse Jobs
            </Link>

            {session ? (
              <>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-7 h-7 brand-gradient rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{session.user?.name}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
                        <div className="px-3 py-2.5 border-b border-border">
                          <p className="text-xs font-medium truncate">{session.user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-1">
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-muted-foreground" /> My Profile
                          </Link>
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" /> Dashboard
                          </Link>
                          <hr className="my-1 border-border" />
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link href="/register"><Button size="sm" className="brand-gradient text-white hover:opacity-90">Get Started</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-2">
            <Link href="/jobs" className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent" onClick={() => setMobileOpen(false)}>
              <Briefcase className="w-4 h-4" /> Browse Jobs
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/profile" className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent" onClick={() => setMobileOpen(false)}>
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-red-400 rounded-md hover:bg-red-500/10 w-full" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full">Sign In</Button></Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full brand-gradient text-white">Get Started</Button></Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
