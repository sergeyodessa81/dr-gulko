"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BillingToggleProps {
  isYearly: boolean
  onToggle: (isYearly: boolean) => void
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <Label htmlFor="billing-toggle" className={!isYearly ? "font-medium" : "text-muted-foreground"}>
        Monthly
      </Label>
      <Switch id="billing-toggle" checked={isYearly} onCheckedChange={onToggle} />
      <div className="flex items-center gap-2">
        <Label htmlFor="billing-toggle" className={isYearly ? "font-medium" : "text-muted-foreground"}>
          Yearly
        </Label>
        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">Save up to 20%</span>
      </div>
    </div>
  )
}
