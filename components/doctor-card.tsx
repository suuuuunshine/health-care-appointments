"use client"

import type { Doctor } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"

interface DoctorCardProps {
  doctor: Doctor
  onBookAppointment: () => void
}

export default function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const { name, photo, specialty, rating, location, availableSlots } = doctor

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={photo || "/placeholder.svg"}
          alt={`Dr. ${name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-6">
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
          {availableSlots.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {availableSlots.slice(0, 3).map((slot, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                  {slot.day}, {slot.time}
                </span>
              ))}
              {availableSlots.length > 3 && (
                <span className="text-xs text-gray-500">+{availableSlots.length - 3} more</span>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500 mt-2">No available slots</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <Button
          onClick={onBookAppointment}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          disabled={availableSlots.length === 0}
        >
          {availableSlots.length > 0 ? "Book Appointment" : "Currently Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  )
}
