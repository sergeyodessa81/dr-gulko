import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, AlertTriangle } from "lucide-react"

interface LimitBannerProps {
  resetAt: number
  limit: number
}

export function LimitBanner({ resetAt, limit }: LimitBannerProps) {
  const resetTime = new Date(resetAt)
  const now = new Date()
  const hoursUntilReset = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60))

  return (
    <Alert className="mx-4 mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <strong>Daily limit reached</strong> ({limit} messages)
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" />
            Resets in ~{hoursUntilReset}h
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
