import { cn } from '@/lib/utils'

export default function Spinner({ className, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Centered spinner with optional text
export function SpinnerWithText({ text = 'Loading...', size = 'md', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Spinner size={size} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

// Full page spinner overlay
export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <SpinnerWithText size="lg" />
    </div>
  )
}
