import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const reducedMotionVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
}

export function PageTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={prefersReducedMotion ? reducedMotionVariants : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
