import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { LibraryProvider } from '@/context/LibraryContext';
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils';
import { Playfair_Display as FontHeadline } from "next/font/google"

export const metadata: Metadata = {
  title: 'Versify',
  description: 'Generate poems from images with AI',
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeadline = FontHeadline({
  subsets: ["latin"],
  variable: "--font-headline",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeadline.variable
        )}
      >
        <LibraryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LibraryProvider>
        <Toaster />
      </body>
    </html>
  );
}
