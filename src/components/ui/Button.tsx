import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  neon?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", neon = false, ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-500",
      secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
      ghost: "bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white",
      danger: "bg-red-600 text-white hover:bg-red-500",
      success: "bg-green-600 text-white hover:bg-green-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          neon && variant === "primary" && "shadow-[0_0_15px_rgba(37,99,235,0.4)]",
          neon && variant === "success" && "shadow-[0_0_15px_rgba(22,163,74,0.4)]",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
