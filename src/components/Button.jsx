import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  cyan: 'border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-void-900 shadow-neon-cyan hover:shadow-[0_0_20px_#00f5ff,0_0_40px_#00f5ff60]',
  pink: 'border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-void-900 shadow-neon-pink hover:shadow-[0_0_20px_#ff006e,0_0_40px_#ff006e60]',
  yellow: 'border border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-void-900 shadow-neon-yellow hover:shadow-[0_0_20px_#ffbe0b]',
  green: 'border border-neon-green text-neon-green hover:bg-neon-green hover:text-void-900 shadow-neon-green',
  ghost: 'border border-white/10 text-white/50 hover:border-white/30 hover:text-white/80',
}

export const Button = forwardRef(({ className, variant = 'cyan', size = 'md', children, ...props }, ref) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  return (
    <button
      ref={ref}
      className={cn(
        'font-display font-semibold tracking-widest uppercase transition-all duration-200',
        'bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        'active:scale-95',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
