"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Doctor, TimeSlot } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useAppointments } from "@/hooks/use-appointments"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor
  onConfirm: (timeSlot: TimeSlot) => void
  preSelectedTimeSlot?: TimeSlot
}

export default function BookingModal({ isOpen, onClose, doctor, onConfirm, preSelectedTimeSlot }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { isTimeSlotBooked, getDoctorAvailability } = useAppointments()

  // Get all available slots for this doctor
  const availableSlots = getDoctorAvailability(doctor)

  // Group available slots by day
  const slotsByDay = doctor.availableSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = []
      }
      acc[slot.day].push(slot)
      return acc
    },
    {} as Record<string, TimeSlot[]>,
  )

  // Find the next available date with open slots
  const findNextAvailableDate = (startingFrom: Date = new Date(), targetDay?: string) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date(startingFrom)
    today.setHours(0, 0, 0, 0)

    // If we have a target day, find the next occurrence of that day
    if (targetDay) {
      const targetDayIndex = daysOfWeek.indexOf(targetDay)
      if (targetDayIndex !== -1) {
        const currentDayIndex = today.getDay()
        const daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + daysToAdd)

        // Check if this day has available slots
        const daySlots = slotsByDay[targetDay] || []
        const availableSlots = daySlots.filter((slot) => !isTimeSlotBooked(doctor, slot))

        if (availableSlots.length > 0) {
          return targetDate
        }
      }
    }

    // Otherwise, check the next 30 days for any available slot
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() + i)

      const dayName = format(checkDate, "EEEE")
      const daySlots = slotsByDay[dayName] || []

      // Check if this day has available slots
      const availableSlots = daySlots.filter((slot) => !isTimeSlotBooked(doctor, slot))

      if (availableSlots.length > 0) {
        return checkDate
      }
    }

    // If no available slots found, return today
    return today
  }

  // Reset selected slot when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSlot(null)
      setError(null)
    } else {
      // When modal opens, find the next available date
      if (preSelectedTimeSlot) {
        // Check if the pre-selected time slot is still available
        const isSlotAvailable = !isTimeSlotBooked(doctor, preSelectedTimeSlot)

        if (isSlotAvailable) {
          // If a time slot is pre-selected and available, find the next occurrence of that day
          const nextDate = findNextAvailableDate(new Date(), preSelectedTimeSlot.day)
          setDate(nextDate)
          setSelectedSlot(preSelectedTimeSlot)
        } else {
          // If pre-selected slot is no longer available, find any next available date
          const nextDate = findNextAvailableDate()
          setDate(nextDate)
          setError("The selected time slot is no longer available. Please choose another slot.")
        }
      } else {
        // Otherwise, find the next day with any available slot
        const nextDate = findNextAvailableDate()
        setDate(nextDate)
      }
    }
  }, [isOpen, preSelectedTimeSlot, doctor])

  // Get available slots for the selected date
  const getAvailableSlotsForDate = () => {
    if (!date) return []

    const dayName = format(date, "EEEE")
    const slotsForDay = slotsByDay[dayName] || []

    // Filter out already booked slots
    return slotsForDay.filter((slot) => !isTimeSlotBooked(doctor, slot))
  }

  const slotsForSelectedDate = getAvailableSlotsForDate()

  const handleConfirm = () => {
    if (selectedSlot) {
      // Double-check that the slot is still available
      if (!isTimeSlotBooked(doctor, selectedSlot)) {
        onConfirm(selectedSlot)
        setError(null)
      } else {
        setError("This time slot was just booked. Please select another slot.")
        // Refresh available slots
        setSelectedSlot(null)
      }
    }
  }

  // Check if there are any available slots at all
  const hasAnyAvailableSlots = availableSlots.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book an Appointment</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden">
            <Image src={doctor.photo || "/placeholder.svg"} alt={`Dr. ${doctor.name}`} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium">Dr. {doctor.name}</h3>
            <p className="text-sm text-gray-500">{doctor.specialty}</p>
          </div>
        </div>

        {!hasAnyAvailableSlots ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p className="text-amber-800">This doctor has no available slots. All appointments have been booked.</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p className="text-amber-800">{error}</p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Select Date
            </h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate)
                setSelectedSlot(null) // Reset selected slot when date changes
                setError(null) // Clear any errors
              }}
              className="border rounded-md content-center"
              disabled={(date) => {
                // Disable dates in the past
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (date < today) return true

                // Disable dates with no available slots
                const dayName = format(date, "EEEE")
                const slotsForDay = slotsByDay[dayName] || []

                // Check if all slots for this day are already booked
                if (slotsForDay.length === 0) return true

                const availableSlots = slotsForDay.filter((slot) => !isTimeSlotBooked(doctor, slot))
                return availableSlots.length === 0
              }}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Available Time Slots
            </h4>
            {slotsForSelectedDate.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {slotsForSelectedDate.map((slot, index) => (
                  <button
                    key={index}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedSlot?.time === slot.time && selectedSlot?.day === slot.day
                        ? "bg-teal-100 border-teal-300 text-teal-700"
                        : "border-gray-200 hover:border-teal-200"
                    }`}
                    onClick={() => {
                      setSelectedSlot(slot)
                      setError(null) // Clear any errors when selecting a new slot
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-sm">
                  {date ? "No available slots for this date" : "Please select a date"}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSlot || !hasAnyAvailableSlots}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
