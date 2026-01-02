"use client"

import { useEffect, useState } from "react"
import type { Notification } from "@/lib/upstash/notifications"
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/upstash/notifications"
import { useSupabaseUser } from "./use-supabase-user"

/**
 * Hook to manage user notifications with Redis backend.
 */
export function useNotifications() {
  const { user } = useSupabaseUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        const userNotifications = await getUserNotifications(user.id)
        setNotifications(userNotifications)
        setUnreadCount(userNotifications.filter((n) => !n.read).length)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [user])

  const markAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      await markNotificationAsRead(user.id, notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await markAllNotificationsAsRead(user.id)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}
