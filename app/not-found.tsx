// app/not-found.tsx
// Custom 404 page

import Link from "next/link";
import { Briefcase, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="brand" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
