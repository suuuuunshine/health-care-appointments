"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Doctor, TimeSlot } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import Image from "next/image"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor
  onConfirm: (timeSlot: TimeSlot) => void
}

export default function BookingModal({ isOpen, onClose, doctor, onConfirm }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

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

  // Get available slots for the selected date
  const getAvailableSlotsForDate = () => {
    if (!date) return []

    const dayName = format(date, "EEEE")
    return slotsByDay[dayName] || []
  }

  const availableSlots = getAvailableSlotsForDate()

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot)
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Select Date
            </h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md"
              disabled={(date) => {
                // Disable dates in the past
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (date < today) return true

                // Disable dates with no available slots
                const dayName = format(date, "EEEE")
                return !slotsByDay[dayName] || slotsByDay[dayName].length === 0
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
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedSlot === slot
                        ? "bg-teal-100 border-teal-300 text-teal-700"
                        : "border-gray-200 hover:border-teal-200"
                    }`}
                    onClick={() => setSelectedSlot(slot)}
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
          <Button onClick={handleConfirm} disabled={!selectedSlot} className="bg-teal-500 hover:bg-teal-600 text-white">
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
