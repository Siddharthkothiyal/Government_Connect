import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("card p-5", className)} {...props}>
      {children}
    </div>
  );
}
