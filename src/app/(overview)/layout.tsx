import type { Metadata } from "next"
import { Nav } from "@/components/nav"

export const metadata: Metadata = {
  title: 'Home'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Nav />
      <main className="flex min-h-screen flex-col gap-4 p-8 max-w-5xl mx-auto">
        {children}
      </main>
    </>
  )
}
