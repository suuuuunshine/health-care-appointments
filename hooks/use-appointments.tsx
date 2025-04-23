"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { Appointment, Doctor } from "@/lib/types"

interface AppointmentsContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => boolean
  cancelAppointment: (id: string) => void
  isTimeSlotBooked: (doctor: Doctor, date: string, time: string) => boolean
  getDoctorAvailability: (doctor: Doctor) => { date: string; slots: string[] }[]
  hasAvailableSlots: (doctor: Doctor) => boolean
  getAvailableSlots: (doctor: Doctor, date: string) => string[]
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
        setAppointments(parsed)
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
    const isBooked = isTimeSlotBooked(appointment.doctor, appointment.date, appointment.time)
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

  // Check if a time slot is already booked
  const isTimeSlotBooked = (doctor: Doctor, date: string, time: string) => {
    return appointments.some((app) => app.doctor.id === doctor.id && app.date === date && app.time === time)
  }

  // Get all available slots for a doctor after filtering out booked ones
  const getDoctorAvailability = (doctor: Doctor) => {
    return doctor.availability
      .map((availabilitySlot) => {
        const availableSlots = availabilitySlot.slots.filter(
          (time) => !isTimeSlotBooked(doctor, availabilitySlot.date, time),
        )
        return {
          date: availabilitySlot.date,
          slots: availableSlots,
        }
      })
      .filter((slot) => slot.slots.length > 0)
  }

  // Get available slots for a specific date
  const getAvailableSlots = (doctor: Doctor, date: string) => {
    const availabilityForDate = doctor.availability.find((a) => a.date === date)
    if (!availabilityForDate) return []

    return availabilityForDate.slots.filter((time) => !isTimeSlotBooked(doctor, date, time))
  }

  // Check if a doctor has any available slots at all
  const hasAvailableSlots = (doctor: Doctor) => {
    return doctor.availability.some((availabilitySlot) =>
      availabilitySlot.slots.some((time) => !isTimeSlotBooked(doctor, availabilitySlot.date, time)),
    )
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
        getAvailableSlots,
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
