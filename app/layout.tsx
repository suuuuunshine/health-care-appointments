import type React from "react"
import "@/app/globals.css"
import { AppointmentsProvider } from "@/hooks/use-appointments"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AppointmentsProvider>{children}</AppointmentsProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
