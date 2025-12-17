import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const loaderVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-12 h-12", // 48px container
        md: "w-18 h-18", // 72px container  
        lg: "w-24 h-24", // 96px container
        full: "w-48 h-48", // 192px container
      },
      variant: {
        default: "",
        overlay: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        progress: "",
        inline: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

const logoVariants = cva(
  "relative z-10 animate-pulse-logo",
  {
    variants: {
      size: {
        sm: "w-8 h-8", // 32px logo
        md: "w-16 h-16", // 48px logo
        lg: "w-16 h-16", // 64px logo  
        full: "w-32 h-32", // 128px logo
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const ringVariants = cva(
  "absolute inset-0 rounded-full border-4 border-transparent animate-spin-ring",
  {
    variants: {
      size: {
        sm: "border-2",
        md: "border-3",
        lg: "border-4",
        full: "border-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface LoaderProps extends VariantProps<typeof loaderVariants> {
  text?: string
  className?: string
  progress?: number // 0-100 for progress variants
  showProgress?: boolean
}

export function Loader({ size, variant, text, className, progress = 0, showProgress = false }: LoaderProps) {
  const actualSize = variant === "overlay" ? "full" : "md"

  const LoaderContent = () => (
    <div className={cn(loaderVariants({ size: actualSize }), "flex-col gap-4")}>
      {/* Animated Ring Container */}
      <div className="relative w-32 h-32">
        {
          variant !== "inline" && (
            <div
              className={cn(
                ringVariants({ size: actualSize }),
                `bg-gradient-conic from-orange-400 via-pink-500 to-purple-600 animate-spin ${variant === "overlay" ? "w-[9rem] ml-[-7px]" : "w-[4rem] h-[5rem] ml-[31px] mt-[24px]"}`
              )}
              style={{
                background: 'conic-gradient(from 0deg, hsl(25 95% 53%), hsl(330 81% 60%), hsl(262 83% 58%), hsl(25 95% 53%))',
                WebkitMask: 'radial-gradient(circle, transparent 70%, black 72%)',
                mask: 'radial-gradient(circle, transparent 70%, black 72%)',
              }}
            />
          )
        }

        {/* Logo */}
        {
          variant !== "inline" && (
            <img
              src="/loader.png"
              alt="Art Gharana"
              className={cn(
                logoVariants({ size: actualSize }),
                "absolute inset-0 m-auto object-contain z-10"
              )}
            />
          )
        }

      </div>

      {/* Loading Text */}
      {text && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground animate-fade-in font-medium w-80">
            {text}
          </p>
        </div>
      )}
    </div>
  )

  if (variant === "overlay") {
    return (
      <div className={cn(loaderVariants({ variant }), className)}>
        <LoaderContent />
      </div>
    )
  }

  return (
    <div className={cn(loaderVariants({ size, variant }), className)}>
      <LoaderContent />
    </div>
  )
}

// Pre-configured loader components for common use cases
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return <Loader variant="overlay" text={text} />
}

export function SectionLoader({ text, size = "lg" }: { text?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader size={size} text={text} />
    </div>
  )
}

export function InlineLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  return <Loader variant="inline" size={size} />
}