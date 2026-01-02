import { createRedisClient, CacheKeys, CacheTTL } from "./redis"

export interface Notification {
  id: string
  userId: string
  type: "daily_inspiration" | "holiday_event" | "poem_milestone" | "general"
  title: string
  message: string
  read: boolean
  createdAt: string
}

/**
 * Store a notification for a user in Redis.
 */
export async function addNotification(notification: Notification) {
  const redis = createRedisClient()
  const key = CacheKeys.userNotifications(notification.userId)

  // Get existing notifications
  const existing = await redis.get(key)
  const notifications: Notification[] = existing ? JSON.parse(existing as string) : []

  // Add new notification at the beginning
  notifications.unshift(notification)

  // Keep only the last 50 notifications
  const trimmed = notifications.slice(0, 50)

  // Store back with 7-day expiration
  await redis.setex(key, CacheTTL.DAY * 7, JSON.stringify(trimmed))

  // Publish to real-time channel
  await redis.publish(`notifications:${notification.userId}`, JSON.stringify(notification))
}

/**
 * Get all notifications for a user.
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const redis = createRedisClient()
  const key = CacheKeys.userNotifications(userId)

  const cached = await redis.get(key)
  return cached ? (JSON.parse(cached as string) as Notification[]) : []
}

/**
 * Mark a notification as read.
 */
export async function markNotificationAsRead(userId: string, notificationId: string) {
  const redis = createRedisClient()
  const key = CacheKeys.userNotifications(userId)

  const existing = await redis.get(key)
  if (!existing) return

  const notifications: Notification[] = JSON.parse(existing as string)
  const updated = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))

  await redis.setex(key, CacheTTL.DAY * 7, JSON.stringify(updated))
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllNotificationsAsRead(userId: string) {
  const redis = createRedisClient()
  const key = CacheKeys.userNotifications(userId)

  const existing = await redis.get(key)
  if (!existing) return

  const notifications: Notification[] = JSON.parse(existing as string)
  const updated = notifications.map((n) => ({ ...n, read: true }))

  await redis.setex(key, CacheTTL.DAY * 7, JSON.stringify(updated))
}

/**
 * Clear old notifications (older than 30 days).
 */
export async function clearOldNotifications(userId: string) {
  const redis = createRedisClient()
  const key = CacheKeys.userNotifications(userId)

  const existing = await redis.get(key)
  if (!existing) return

  const notifications: Notification[] = JSON.parse(existing as string)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const filtered = notifications.filter((n) => new Date(n.createdAt) > thirtyDaysAgo)

  if (filtered.length > 0) {
    await redis.setex(key, CacheTTL.DAY * 7, JSON.stringify(filtered))
  } else {
    await redis.del(key)
  }
}
