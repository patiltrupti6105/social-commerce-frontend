import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
}

const colorClasses = {
  primary: 'border-primary/30 border-t-primary',
  secondary: 'border-secondary/30 border-t-secondary',
  muted: 'border-muted-foreground/30 border-t-muted-foreground',
  white: 'border-white/30 border-t-white',
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  className,
  fullScreen = false,
  label = 'Loading...',
}) {
  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

// Centered spinner for page loading states
export function PageSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" label={label} />
    </div>
  )
}

// Inline spinner for buttons or small areas
export function InlineSpinner({ size = 'sm', className }) {
  return <Spinner size={size} className={className} />
}
