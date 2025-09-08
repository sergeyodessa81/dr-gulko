"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff } from "lucide-react"
import { toast } from "sonner"

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error("[PWA] Error checking push subscription:", error)
      }
    }
  }

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications")
      return
    }

    setLoading(true)

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        await subscribeToPush()
        toast.success("Notifications enabled! You'll receive learning reminders.")
      } else {
        toast.error("Notifications permission denied")
      }
    } catch (error) {
      console.error("[PWA] Error requesting notification permission:", error)
      toast.error("Failed to enable notifications")
    } finally {
      setLoading(false)
    }
  }

  const subscribeToPush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready

      // You would need to generate VAPID keys and add them to your environment
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!vapidPublicKey) {
        console.warn("[PWA] VAPID public key not configured")
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      })

      // Send subscription to your server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      setIsSubscribed(true)
    } catch (error) {
      console.error("[PWA] Error subscribing to push notifications:", error)
    }
  }

  const unsubscribeFromPush = async () => {
    if (!("serviceWorker" in navigator)) return

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()

        // Remove subscription from server
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })

        setIsSubscribed(false)
        toast.success("Notifications disabled")
      }
    } catch (error) {
      console.error("[PWA] Error unsubscribing from push notifications:", error)
      toast.error("Failed to disable notifications")
    } finally {
      setLoading(false)
    }
  }

  if (!("Notification" in window)) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? <Bell className="h-5 w-5 text-green-600" /> : <BellOff className="h-5 w-5 text-gray-400" />}
          Push Notifications
        </CardTitle>
        <CardDescription>Get notified about new lessons, practice reminders, and learning milestones.</CardDescription>
      </CardHeader>
      <CardContent>
        {permission === "granted" ? (
          <div className="space-y-2">
            <p className="text-sm text-green-600">✓ Notifications are {isSubscribed ? "enabled" : "available"}</p>
            {isSubscribed ? (
              <Button
                variant="outline"
                onClick={unsubscribeFromPush}
                disabled={loading}
                className="w-full bg-transparent"
              >
                <BellOff className="mr-2 h-4 w-4" />
                Disable Notifications
              </Button>
            ) : (
              <Button onClick={subscribeToPush} disabled={loading} className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Enable Notifications
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={requestPermission} disabled={loading} className="w-full">
            <Bell className="mr-2 h-4 w-4" />
            Enable Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
