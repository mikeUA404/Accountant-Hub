// components/ui/toaster.tsx
"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils";

// ── Types ─────────────────────────────────────────────────
interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

interface ToastContextType {
  toast: (data: Omit<ToastData, "id">) => void;
}

// ── Context ───────────────────────────────────────────────
const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

// ── Toaster (Provider + UI) ───────────────────────────────
export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-fade-in",
              t.variant === "success" && "border-brand/20 bg-card text-foreground",
              t.variant === "destructive" && "border-red-500/30 bg-card text-foreground",
              (!t.variant || t.variant === "default") && "border-border bg-card text-foreground"
            )}
          >
            {t.variant === "success" && <CheckCircle className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />}
            {t.variant === "destructive" && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
            {(!t.variant || t.variant === "default") && <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-semibold">{t.title}</p>}
              {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
