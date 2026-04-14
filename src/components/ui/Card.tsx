import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
      {children}
    </div>
  );
}

function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6 pb-3", className)}>{children}</div>;
}

function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

export { Card, CardHeader, CardTitle, CardContent }
