"use client";

import { motion } from "framer-motion";

import { pageTransition } from "../../lib/animations";

export function AnimatedPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      animate="animate"
      className={className}
      exit="exit"
      initial="initial"
      variants={pageTransition}
    >
      {children}
    </motion.main>
  );
}
