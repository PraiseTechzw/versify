import { NextRequest, NextResponse } from 'next/server'
import { generatePoemFromImage } from '@/ai/flows/generate-poem-from-image'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different types of Genkit flow requests
    if (body.flow === 'generatePoemFromImageFlow' || body.input?.photoDataUri) {
      const result = await generatePoemFromImage(body.input || body)
      return NextResponse.json(result)
    }
    
    // Handle other potential flow types here
    return NextResponse.json({ error: 'Unknown flow type' }, { status: 400 })
    
  } catch (error: any) {
    console.error('Pipeline API error:', error)
    
    // Handle specific error types
    if (error?.code === 429 || error?.status === 'RESOURCE_EXHAUSTED') {
      return NextResponse.json(
        { error: 'Service temporarily busy', message: 'AI service is experiencing high demand. Please try again in a few moments.' },
        { status: 429 }
      )
    }
    
    if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit reached', message: 'Please wait a moment before generating another poem.' },
        { status: 429 }
      )
    }
    
    if (error?.message?.includes('All models exhausted')) {
      return NextResponse.json(
        { error: 'Service unavailable', message: 'All AI models are currently busy. Please try again later.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}