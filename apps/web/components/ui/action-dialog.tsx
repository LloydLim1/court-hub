"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[32px] p-6"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-rose-500/12 p-3 text-rose-300">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
                    <Dialog.Description className="text-sm text-slate-400">
                      {description}
                    </Dialog.Description>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Dialog.Close className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                    Cancel
                  </Dialog.Close>
                  <button
                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white"
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
