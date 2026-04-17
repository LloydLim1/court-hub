export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
} as const;

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
} as const;

export const hoverLift = {
  rest: { scale: 1, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.26)",
    transition: { duration: 0.3 },
  },
} as const;
