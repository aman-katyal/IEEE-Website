import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastVariant = "default" | "success" | "destructive" | "warning";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 3500 }: ToastOptions) => {
      const id = crypto.randomUUID();
      const newToast: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const getIcon = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-400 shrink-0" aria-hidden="true" />;
      case "destructive":
        return <AlertCircle size={18} className="text-red-400 shrink-0" aria-hidden="true" />;
      case "warning":
        return <AlertCircle size={18} className="text-[var(--cyber-gold)] shrink-0" aria-hidden="true" />;
      default:
        return <Info size={18} className="text-[var(--electric-blue)] shrink-0" aria-hidden="true" />;
    }
  };

  const getBorderColor = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return "border-emerald-500/30 bg-emerald-950/40";
      case "destructive":
        return "border-red-500/30 bg-red-950/40";
      case "warning":
        return "border-[rgba(235,211,169,0.3)] bg-amber-950/40";
      default:
        return "border-[var(--glass-border)] bg-[rgba(10,15,25,0.85)]";
    }
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="status"
              className={`pointer-events-auto backdrop-blur-md border rounded-xl p-4 shadow-2xl flex items-start gap-3 text-[var(--text-primary)] ${getBorderColor(
                t.variant || "default"
              )}`}
            >
              {getIcon(t.variant || "default")}
              <div className="flex-1 min-w-0">
                <p className="font-[family-name:var(--font-headline)] text-sm font-semibold leading-tight">
                  {t.title}
                </p>
                {t.description && (
                  <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Close notification"
                className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-[var(--cyber-gold)]"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
