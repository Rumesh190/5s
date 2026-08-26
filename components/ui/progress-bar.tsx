import { cn } from "@/lib/utils"

interface ProgressBarProps {
  /** 0-100 */
  value: number
  className?: string
  barClassName?: string
}

/**
 * Minimal horizontal progress indicator. shadcn's Progress primitive isn't
 * installed in this project yet, and the value here is fully data-driven, so
 * a small inline `style` for the fill width is the pragmatic choice — there
 * is no static Tailwind class that can express an arbitrary runtime percent.
 */
function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { ProgressBar }
