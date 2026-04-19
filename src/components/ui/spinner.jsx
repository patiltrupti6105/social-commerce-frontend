import * as React from "react"
import { cn } from "@/lib/utils"

const Spinner = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4", className)}
    role="status"
    aria-label="Loading"
    {...props}
  >
    <span className="sr-only">Loading...</span>
  </div>
))
Spinner.displayName = "Spinner"

export { Spinner }
