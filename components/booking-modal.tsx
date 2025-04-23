"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Doctor } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO, isValid, isBefore, startOfDay } from "date-fns"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useAppointments } from "@/hooks/use-appointments"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor
  onConfirm: (date: string, time: string) => void
  preSelectedDate?: string
  preSelectedTime?: string
}

export default function BookingModal({
  isOpen,
  onClose,
  doctor,
  onConfirm,
  preSelectedDate,
  preSelectedTime,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { isTimeSlotBooked, hasAvailableSlots, getAvailableSlots } = useAppointments()

  // Check if doctor has any available slots
  const doctorHasAvailability = hasAvailableSlots(doctor)

  // Find the next available date
  const findNextAvailableDate = () => {
    const today = new Date()

    // If preSelectedDate is provided and valid, use it
    if (preSelectedDate) {
      const parsedDate = parseISO(preSelectedDate)
      if (isValid(parsedDate) && !isBefore(parsedDate, today)) {
        return parsedDate
      }
    }

    // Otherwise find the first available date
    for (const availabilitySlot of doctor.availability) {
      const date = parseISO(availabilitySlot.date)
      if (isValid(date) && !isBefore(date, today)) {
        const availableSlots = getAvailableSlots(doctor, availabilitySlot.date)
        if (availableSlots.length > 0) {
          return date
        }
      }
    }

    return undefined
  }

  // Reset selected slot when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTime(null)
      setError(null)
    } else {
      // When modal opens, find the next available date
      const nextDate = findNextAvailableDate()
      setSelectedDate(nextDate)

      // If preSelectedDate and preSelectedTime are provided, check if they're still available
      if (preSelectedDate && preSelectedTime) {
        const isSlotAvailable = !isTimeSlotBooked(doctor, preSelectedDate, preSelectedTime)

        if (isSlotAvailable) {
          setSelectedDate(parseISO(preSelectedDate))
          setSelectedTime(preSelectedTime)
        } else {
          setError("The selected time slot is no longer available. Please choose another slot.")
        }
      }
    }
  }, [isOpen, preSelectedDate, preSelectedTime, doctor])

  // Get available slots for the selected date
  const getAvailableSlotsForDate = () => {
    if (!selectedDate) return []

    const dateString = format(selectedDate, "yyyy-MM-dd")
    return getAvailableSlots(doctor, dateString)
  }

  const availableSlots = getAvailableSlotsForDate()

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateString = format(selectedDate, "yyyy-MM-dd")

      // Double-check that the slot is still available
      if (!isTimeSlotBooked(doctor, dateString, selectedTime)) {
        onConfirm(dateString, selectedTime)
        setError(null)
      } else {
        setError("This time slot was just booked. Please select another slot.")
        setSelectedTime(null)
      }
    }
  }

  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    return format(date, "MMMM d, yyyy")
  }

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

        {!doctorHasAvailability ? (
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
              selected={selectedDate}
              onSelect={(newDate) => {
                setSelectedDate(newDate)
                setSelectedTime(null) // Reset selected time when date changes
                setError(null) // Clear any errors
              }}
              className="border rounded-md content-center"
              disabled={(date) => {
                // Disable dates in the past
                const today = startOfDay(new Date())
                if (isBefore(date, today)) return true

                // Disable dates with no available slots
                const dateString = format(date, "yyyy-MM-dd")
                const availabilityForDate = doctor.availability.find((a) => a.date === dateString)

                // If no slots for this date, disable it
                if (!availabilityForDate) return true

                // Check if all slots for this date are already booked
                const availableSlots = availabilityForDate.slots.filter(
                  (time) => !isTimeSlotBooked(doctor, dateString, time),
                )

                return availableSlots.length === 0
              }}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Available Time Slots
            </h4>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((time, index) => (
                  <button
                    key={index}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedTime === time
                        ? "bg-teal-100 border-teal-300 text-teal-700"
                        : "border-gray-200 hover:border-teal-200"
                    }`}
                    onClick={() => {
                      setSelectedTime(time)
                      setError(null) // Clear any errors when selecting a new slot
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-sm">
                  {selectedDate ? "No available slots for this date" : "Please select a date"}
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
            disabled={!selectedTime || !selectedDate || !doctorHasAvailability}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
