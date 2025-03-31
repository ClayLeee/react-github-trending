"use client"

import { forwardRef } from "react"
import { Input } from "@/app/components/ui/input"
import { cn } from "@/app/lib/utils"

export const ClientInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    className={cn(className)}
    ref={ref}
    {...props}
  />
))

ClientInput.displayName = "ClientInput"
