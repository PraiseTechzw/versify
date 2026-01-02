"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

/**
 * Hook to subscribe to real-time updates for a Supabase table.
 * Automatically handles subscriptions and cleanup.
 */
export function useSupabaseCollection<T>(
  table: string,
  filter?: { column: string; value: any },
  orderBy?: { column: string; ascending?: boolean },
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const fetchData = async () => {
      try {
        let query = supabase.from(table).select("*")

        if (filter) {
          query = query.eq(filter.column, filter.value)
        }

        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false })
        }

        const { data: result, error: fetchError } = await query

        if (fetchError) throw fetchError

        // Transform snake_case to camelCase
        const transformedData = result.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          title: item.title,
          poem: item.poem,
          image: item.image,
          collection: item.collection,
          controls: item.controls,
          createdAt: item.created_at,
        }))

        setData(transformedData as T[])
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
          if (payload.eventType === "INSERT") {
            const newItem = {
              id: payload.new.id,
              userId: payload.new.user_id,
              title: payload.new.title,
              poem: payload.new.poem,
              image: payload.new.image,
              collection: payload.new.collection,
              controls: payload.new.controls,
              createdAt: payload.new.created_at,
            }
            setData((prev) => [newItem as T, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((item: any) =>
                item.id === payload.new.id
                  ? {
                      id: payload.new.id,
                      userId: payload.new.user_id,
                      title: payload.new.title,
                      poem: payload.new.poem,
                      image: payload.new.image,
                      collection: payload.new.collection,
                      controls: payload.new.controls,
                      createdAt: payload.new.created_at,
                    }
                  : item,
              ),
            )
          } else if (payload.eventType === "DELETE") {
            setData((prev) => prev.filter((item: any) => item.id !== payload.old.id))
          }
        })
        .subscribe()
    }

    fetchData()
    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, filter, orderBy]) // Updated dependencies

  return { data, loading, error }
}
