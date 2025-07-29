'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const circleVariants = {
  start: {
    y: '50%',
  },
  end: {
    y: '150%',
  },
};

const circleTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

export function Loader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="relative w-24 h-24">
        <motion.div
            variants={containerVariants}
            initial="start"
            animate="end"
            className="flex w-full h-full justify-around"
          >
            <motion.span
              variants={circleVariants}
              transition={circleTransition}
              className="block w-4 h-4 bg-primary rounded-full"
            />
            <motion.span
              variants={circleVariants}
              transition={circleTransition}
              className="block w-4 h-4 bg-primary rounded-full"
            />
            <motion.span
              variants={circleVariants}
              transition={circleTransition}
              className="block w-4 h-4 bg-primary rounded-full"
            />
          </motion.div>
    </div>
    </div>
  );
}
