"use client"

import type { Doctor } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import { useAppointments } from "@/hooks/use-appointments"
import { format, parseISO } from "date-fns"

interface DoctorCardProps {
  doctor: Doctor
  onBookAppointment: (preSelectedDate?: string, preSelectedTime?: string) => void
}

export default function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const { name, photo, specialty, rating, location } = doctor
  const { getDoctorAvailability, hasAvailableSlots } = useAppointments()

  // Get available slots after filtering out booked ones
  const availableDates = getDoctorAvailability(doctor)

  // Check if this doctor has any available slots
  const doctorHasAvailability = hasAvailableSlots(doctor)

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, "MMM d, yyyy")
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-64 w-full bg-gray-100">
        <Image
          src={photo || "/placeholder.svg"}
          alt={`Dr. ${name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-6 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Dr. {name}</h2>
            <p className="text-teal-600 font-medium">{specialty}</p>
          </div>
          <div className="flex items-center bg-teal-50 px-2 py-1 rounded-md">
            <Star className="h-4 w-4 text-yellow-500 mr-1" aria-hidden="true" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center mt-3 text-gray-500">
          <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Availability:</p>
          {availableDates.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {availableDates.slice(0, 3).map((availabilitySlot, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-600">
                    {formatDateForDisplay(availabilitySlot.date)}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {availabilitySlot.slots.slice(0, 2).map((time, timeIndex) => (
                      <button
                        key={timeIndex}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onBookAppointment(availabilitySlot.date, time)
                        }}
                      >
                        {time}
                      </button>
                    ))}
                    {availabilitySlot.slots.length > 2 && (
                      <span className="text-xs text-gray-500">+{availabilitySlot.slots.length - 2} more</span>
                    )}
                  </div>
                </div>
              ))}
              {availableDates.length > 3 && (
                <span className="text-xs text-gray-500 self-center">+{availableDates.length - 3} more dates</span>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500 mt-2">No available slots</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <Button
          onClick={() => onBookAppointment()}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          disabled={!doctorHasAvailability}
        >
          {doctorHasAvailability ? "Book Appointment" : "Currently Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  )
}
