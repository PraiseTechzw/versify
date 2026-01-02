import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { LibraryProvider } from '@/context/LibraryContext';

export const metadata: Metadata = {
  title: 'Versify',
  description: 'Generate poems from images with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
