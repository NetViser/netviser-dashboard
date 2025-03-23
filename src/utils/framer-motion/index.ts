export const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const headerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.2 },
  },
};

export const buttonVariants = {
  hover: { scale: 1.05, rotate: 2, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};
