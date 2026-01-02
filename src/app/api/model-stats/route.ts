import { NextResponse } from 'next/server'
import { getModelUsageStats } from '@/ai/genkit'

export async function GET() {
  try {
    const stats = getModelUsageStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching model stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model statistics' },
      { status: 500 }
    )
  }
}