import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Flex Living Reviews Dashboard",
  description: "Property management dashboard for reviewing and approving guest reviews",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} ${mono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
