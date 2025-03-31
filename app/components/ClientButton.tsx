"use client"

import * as React from "react"
import { Button as OriginalButton } from "@/app/components/ui/button"
import { type ButtonProps } from "@/app/components/ui/button"

export function ClientButton(props: ButtonProps) {
  return <OriginalButton {...props} />
}
