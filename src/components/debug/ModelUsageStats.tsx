"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Activity } from "lucide-react"

interface ModelStats {
  name: string
  displayName: string
  maxRequests: number
  currentUsage: number
  available: boolean
}

export function ModelUsageStats() {
  const [stats, setStats] = useState<ModelStats[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/model-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        console.error('Failed to fetch model stats')
      }
    } catch (error) {
      console.error('Failed to fetch model stats:', error)
      // Fallback to mock data in case of error
      const mockStats: ModelStats[] = [
        {
          name: 'googleai/gemini-2.5-flash',
          displayName: 'Gemini 2.5 Flash',
          maxRequests: 20,
          currentUsage: 0,
          available: true,
        },
        {
          name: 'googleai/gemini-2.5-flash-lite',
          displayName: 'Gemini 2.5 Flash Lite',
          maxRequests: 20,
          currentUsage: 0,
          available: true,
        },
        {
          name: 'googleai/gemini-2.5-flash-tts',
          displayName: 'Gemini 2.5 Flash TTS',
          maxRequests: 10,
          currentUsage: 0,
          available: true,
        },
        {
          name: 'googleai/gemini-3-flash',
          displayName: 'Gemini 3 Flash',
          maxRequests: 20,
          currentUsage: 0,
          available: true,
        },
      ]
      setStats(mockStats)
    }
  }

  useEffect(() => {
    if (isVisible) {
      fetchStats()
      const interval = setInterval(fetchStats, 10000) // Update every 10 seconds
      return () => clearInterval(interval)
    }
  }, [isVisible])

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-2" />
        AI Models
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">AI Model Usage</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((model) => (
          <div key={model.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{model.displayName}</span>
              <Badge variant={model.available ? "default" : "destructive"} className="text-xs">
                {model.available ? "Available" : "Rate Limited"}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  model.currentUsage >= model.maxRequests
                    ? "bg-destructive"
                    : model.currentUsage > model.maxRequests * 0.8
                    ? "bg-yellow-500"
                    : "bg-primary"
                }`}
                style={{
                  width: `${Math.min((model.currentUsage / model.maxRequests) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{model.currentUsage} / {model.maxRequests}</span>
              <span>{Math.round((model.currentUsage / model.maxRequests) * 100)}%</span>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <p>Models rotate automatically when rate limits are reached.</p>
        </div>
      </CardContent>
    </Card>
  )
}