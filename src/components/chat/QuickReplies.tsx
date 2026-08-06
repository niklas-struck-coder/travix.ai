import { motion } from 'framer-motion'

interface QuickRepliesProps {
  options: string[]
  onSelect: (option: string) => void
}

export function QuickReplies({ options, onSelect }: QuickRepliesProps) {
  if (options.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.04 }}
          onClick={() => onSelect(option)}
          className="rounded-full border border-teal/40 bg-teal/10 px-3.5 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-teal/20"
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
}
