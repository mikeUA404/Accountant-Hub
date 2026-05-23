// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Briefcase, FileText, User, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/utils";

const navItems = [
  { label: "Dashboard",   href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Jobs", href: "/jobs",       icon: Briefcase },
  { label: "My Bids",     href: "/dashboard",  icon: FileText },
  { label: "My Profile",  href: "/profile",    icon: User },
];

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">
            Accountant<span className="text-brand">Hub</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <Link href="/profile" className="p-4 border-b border-border hover:bg-accent/30 transition-colors group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 brand-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium truncate group-hover:text-brand transition-colors">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand transition-colors" />
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-brand/10 text-brand font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive && "text-brand")} />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-brand" />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
