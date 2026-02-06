import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const dotMatrixLoaderVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        grid: "grid grid-cols-3",
        bars: "flex items-end",
        dots: "flex items-center",
      },
      size: {
        sm: "gap-[2px]",
        md: "gap-1",
        lg: "gap-1.5",
      },
      color: {
        primary: "[--dot-color:var(--primary)]",
        foreground: "[--dot-color:var(--foreground)]",
        "muted-foreground": "[--dot-color:var(--muted-foreground)]",
      },
    },
    defaultVariants: {
      variant: "grid",
      size: "md",
      color: "primary",
    },
  }
)

const DOT_SIZES = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
} as const

const BAR_SIZES = {
  sm: "w-0.5 h-2",
  md: "w-1 h-3",
  lg: "w-1.5 h-4",
} as const

// Grid: 9 dots in 3x3. Center (index 4) = 0ms, cardinals (1,3,5,7) = 100ms, corners (0,2,6,8) = 200ms
const GRID_DELAYS = [200, 100, 200, 100, 0, 100, 200, 100, 200]

// Bars: 5 bars, symmetric outward from center
const BAR_DELAYS = [200, 100, 0, 100, 200]

// Dots: 3 dots, left-to-right cascade
const DOT_DELAYS = [0, 100, 200]

function DotMatrixLoader({
  className,
  variant = "grid",
  size = "md",
  color,
  ref,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dotMatrixLoaderVariants>) {
  const dots = React.useMemo(() => {
    if (variant === "grid") {
      return GRID_DELAYS.map((delay, i) => (
        <span
          key={i}
          className={cn("rounded-full bg-[var(--dot-color)]", DOT_SIZES[size!])}
          style={{ animation: `dot-matrix-pulse 0.9s ease-in-out ${delay}ms infinite` }}
        />
      ))
    }

    if (variant === "bars") {
      return BAR_DELAYS.map((delay, i) => (
        <span
          key={i}
          className={cn("rounded-full bg-[var(--dot-color)] origin-bottom", BAR_SIZES[size!])}
          style={{ animation: `dot-matrix-bar 0.9s ease-in-out ${delay}ms infinite` }}
        />
      ))
    }

    // dots variant
    return DOT_DELAYS.map((delay, i) => (
      <span
        key={i}
        className={cn("rounded-full bg-[var(--dot-color)]", DOT_SIZES[size!])}
        style={{ animation: `dot-matrix-bounce 0.9s ease-in-out ${delay}ms infinite` }}
      />
    ))
  }, [variant, size])

  return (
    <div
      data-slot="dot-matrix-loader"
      role="status"
      className={cn(dotMatrixLoaderVariants({ variant, size, color }), className)}
      ref={ref}
      {...props}
    >
      {dots}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export { DotMatrixLoader, dotMatrixLoaderVariants }
