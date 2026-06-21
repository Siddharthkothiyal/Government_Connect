import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
}

export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-outline";
  return (
    <button className={cn(variantClass, className)} {...props}>
      {children}
    </button>
  );
}
