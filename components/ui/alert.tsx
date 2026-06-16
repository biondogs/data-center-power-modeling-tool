import * as React from "react"
import { cn } from "@/lib/utils"

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "destructive" }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      data-variant={variant}
      className={cn(
        "border rounded-lg px-4 py-3 [&>[data-slot=alert-title]]:font-medium",
        variant === "destructive"
          ? "border-destructive/50 text-destructive bg-destructive/5 [&>[data-slot=alert-description]]:text-destructive/90"
          : "bg-background text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("mb-1", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
