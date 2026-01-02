import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Mona_Sans as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Contrail_One as FontHeadline } from "next/font/google"
import { LibraryProvider } from "@/context/LibraryContext"

export const metadata: Metadata = {
  title: "Versify",
  description: "Generate poems from images with AI",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeadline = FontHeadline({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: "400",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontHeadline.variable)}
      >
        <LibraryProvider>{children}</LibraryProvider>
        <Toaster />
      </body>
    </html>
  )
}
