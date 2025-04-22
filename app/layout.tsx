import type React from "react"
import "@/app/globals.css"
import { AppointmentsProvider } from "@/hooks/use-appointments"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AppointmentsProvider>{children}</AppointmentsProvider>
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
