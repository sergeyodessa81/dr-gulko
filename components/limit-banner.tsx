import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock } from "lucide-react"

interface LimitBannerProps {
  resetAt: number
}

export function LimitBanner({ resetAt }: LimitBannerProps) {
  const resetTime = new Date(resetAt).toLocaleTimeString()
  const resetDate = new Date(resetAt).toLocaleDateString()

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800">
      <Clock className="h-4 w-4" />
      <AlertDescription>
        You've reached your daily limit of 10 free AI responses. Your quota resets at {resetTime} on {resetDate}.
      </AlertDescription>
    </Alert>
  )
}
