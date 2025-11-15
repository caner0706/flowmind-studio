import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "error" | "warning" | "info";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-dark-800 text-foreground",
      success: "bg-green-600/20 text-green-400 border border-green-600/30",
      error: "bg-red-600/20 text-red-400 border border-red-600/30",
      warning: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
      info: "bg-blue-600/20 text-blue-400 border border-blue-600/30",
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;

