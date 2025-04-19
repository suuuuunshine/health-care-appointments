"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { Appointment } from "@/lib/types"

interface AppointmentsContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: string) => void
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments)
        // Convert date strings back to Date objects
        const appointments = parsed.map((app: any) => ({
          ...app,
          date: new Date(app.date),
        }))
        setAppointments(appointments)
      } catch (error) {
        console.error("Failed to parse appointments:", error)
      }
    }
  }, [])

  // Save appointments to localStorage when they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments))
  }, [appointments])

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment])
  }

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id))
  }

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, cancelAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider")
  }
  return context
}
