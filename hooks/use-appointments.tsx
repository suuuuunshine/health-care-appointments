"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { Appointment, TimeSlot, Doctor } from "@/lib/types"

interface AppointmentsContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: string) => void
  isTimeSlotBooked: (doctor: Doctor, timeSlot: TimeSlot) => boolean
  getDoctorAvailability: (doctor: Doctor) => TimeSlot[]
  hasAvailableSlots: (doctor: Doctor) => boolean
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
    // Verify this slot isn't already booked before adding
    const isBooked = isTimeSlotBooked(appointment.doctor, appointment.timeSlot)
    if (isBooked) {
      console.error("This time slot is already booked")
      return false
    }

    setAppointments((prev) => [...prev, appointment])
    return true
  }

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id))
  }

  // Check if a time slot is already booked - only checking day and time, not specific date
  const isTimeSlotBooked = (doctor: Doctor, timeSlot: TimeSlot) => {
    return appointments.some(
      (app) => app.doctor.id === doctor.id && app.timeSlot.day === timeSlot.day && app.timeSlot.time === timeSlot.time,
    )
  }

  // Get all available slots for a doctor after filtering out booked ones
  const getDoctorAvailability = (doctor: Doctor) => {
    return doctor.availableSlots.filter((slot) => !isTimeSlotBooked(doctor, slot))
  }

  // Check if a doctor has any available slots at all
  const hasAvailableSlots = (doctor: Doctor) => {
    return doctor.availableSlots.some((slot) => !isTimeSlotBooked(doctor, slot))
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        cancelAppointment,
        isTimeSlotBooked,
        getDoctorAvailability,
        hasAvailableSlots,
      }}
    >
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
