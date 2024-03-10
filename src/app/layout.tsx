import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: 'Place Rating',
    template: `%s - Place Rating`,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-900`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
