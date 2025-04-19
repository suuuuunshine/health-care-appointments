"use client"

import type { Appointment } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

interface AppointmentCardProps {
  appointment: Appointment
  onCancel: () => void
}

export default function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const { doctor, timeSlot, date } = appointment

  return (
    <Card className="overflow-hidden">
      <div className="bg-teal-500 p-4 text-white">
        <h3 className="font-semibold">Appointment with Dr. {doctor.name}</h3>
        <p className="text-teal-100 text-sm">{doctor.specialty}</p>
      </div>

      <CardContent className="pt-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
            <Image src={doctor.photo || "/placeholder.svg"} alt={`Dr. ${doctor.name}`} fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="text-sm">
                {timeSlot.day}, {format(date, "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center text-gray-700 mb-2">
              <Clock className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="text-sm">{timeSlot.time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="text-sm">{doctor.location}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-between">
        <Button
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button variant="outline" className="text-teal-500 border-teal-200 hover:bg-teal-50 hover:text-teal-600">
          Reschedule
        </Button>
      </CardFooter>
    </Card>
  )
}
