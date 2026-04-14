"use client";

import * as Toast from "@radix-ui/react-toast";
import { motion } from "framer-motion";

import { useUiStore } from "../../lib/ui-store";

const toneClasses: Record<string, string> = {
  info: "border-sky-400/40 bg-sky-500/12",
  success: "border-emerald-400/40 bg-emerald-500/12",
  warning: "border-amber-400/40 bg-amber-500/12",
  danger: "border-rose-400/40 bg-rose-500/12",
};

export function ToastRegion() {
  const toasts = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast.Root
          asChild
          duration={3500}
          key={toast.id}
          onOpenChange={(open) => {
            if (!open) dismissToast(toast.id);
          }}
        >
          <motion.div
            className={`glass-card fixed right-4 top-4 z-50 w-[320px] rounded-[24px] border p-4 ${
              toneClasses[toast.tone ?? "info"]
            }`}
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, y: -12 }}
          >
            <Toast.Title className="text-sm font-semibold text-white">{toast.title}</Toast.Title>
            <Toast.Description className="mt-1 text-sm text-slate-300">
              {toast.description}
            </Toast.Description>
          </motion.div>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed right-0 top-0 z-50 flex w-[360px] max-w-full flex-col gap-3 p-4" />
    </Toast.Provider>
  );
}
