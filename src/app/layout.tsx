import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Mona_Sans as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Contrail_One as FontHeadline } from "next/font/google"
import { LibraryProvider } from "@/context/LibraryContext"
import { ModelUsageStats } from "@/components/debug/ModelUsageStats"

export const metadata: Metadata = {
  title: "Versify - AI Poetry Generator",
  description: "Transform images into beautiful poetry with AI. Upload any image and let our advanced AI create unique poems inspired by your visual content.",
  keywords: ["AI poetry", "image to poem", "poetry generator", "artificial intelligence", "creative writing"],
  authors: [{ name: "Versify Team" }],
  creator: "Versify",
  publisher: "Versify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Versify - AI Poetry Generator",
    description: "Transform images into beautiful poetry with AI",
    url: "https://versify.app",
    siteName: "Versify",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Versify - AI Poetry Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Versify - AI Poetry Generator",
    description: "Transform images into beautiful poetry with AI",
    images: ["/icon.png"],
    creator: "@versify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        {process.env.NODE_ENV === 'development' && <ModelUsageStats />}
      </body>
    </html>
  )
}
