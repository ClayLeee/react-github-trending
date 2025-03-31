"use client"

import * as React from "react"
import { Badge as OriginalBadge, type BadgeProps } from "@/app/components/ui/badge"

export function ClientBadge(props: BadgeProps) {
  return <OriginalBadge {...props} />
}
