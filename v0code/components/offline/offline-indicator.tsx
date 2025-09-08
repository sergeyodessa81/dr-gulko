"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        setShowIndicator(true)
      } else {
        // Hide indicator after a delay when coming back online
        setTimeout(() => setShowIndicator(false), 3000)
      }
    }

    // Set initial status
    updateOnlineStatus()

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card
        className={`transition-all duration-300 ${isOnline ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{isOnline ? "Back Online" : "You're Offline"}</span>
                <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
                  {isOnline ? "Connected" : "No Internet"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isOnline
                  ? "Your connection has been restored"
                  : "Some features may be limited. Saved content is still available."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
