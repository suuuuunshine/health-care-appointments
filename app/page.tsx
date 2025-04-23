"use client"

import { useState } from "react"
import { doctors } from "@/lib/data"
import DoctorCard from "@/components/doctor-card"
import FilterBar from "@/components/filter-bar"
import BookingModal from "@/components/booking-modal"
import type { Doctor } from "@/lib/types"
import { useAppointments } from "@/hooks/use-appointments"
import Link from "next/link"
import { CalendarCheck2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function Home() {
  const [specialty, setSpecialty] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [preSelectedDate, setPreSelectedDate] = useState<string | undefined>(undefined)
  const [preSelectedTime, setPreSelectedTime] = useState<string | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addAppointment, hasAvailableSlots } = useAppointments()
  const { toast } = useToast()

  const handleBooking = (doctor: Doctor, date?: string, time?: string) => {
    // Check if doctor has any available slots before opening modal
    if (!hasAvailableSlots(doctor)) {
      toast({
        title: "No Available Slots",
        description: "This doctor has no available appointment slots.",
        variant: "destructive",
      })
      return
    }

    setSelectedDoctor(doctor)
    setPreSelectedDate(date)
    setPreSelectedTime(time)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = (date: string, time: string) => {
    if (selectedDoctor) {
      const appointment = {
        id: `appointment-${Date.now()}`,
        doctor: selectedDoctor,
        date,
        time,
      }

      const success = addAppointment(appointment)

      if (success) {
        toast({
          title: "Appointment Booked",
          description: `Your appointment with Dr. ${selectedDoctor.name} on ${format(new Date(date), "MMMM d, yyyy")} at ${time} has been confirmed.`,
        })
      } else {
        toast({
          title: "Booking Failed",
          description: "This time slot is no longer available. Please try another slot.",
          variant: "destructive",
        })
      }

      setIsModalOpen(false)
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    // Check if doctor has any available slots after considering booked appointments
    const doctorHasAvailability = hasAvailableSlots(doctor)

    const matchesSpecialty = specialty === "all" || doctor.specialty === specialty
    const matchesAvailability = availability === "all" || (availability === "available" && doctorHasAvailability)
    return matchesSpecialty && matchesAvailability
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Find a Doctor</h1>
          <p className="text-gray-600 mt-2">Book an appointment with one of our specialists</p>
        </div>
        <Link
          href="/my-appointments"
          className="flex items-center mt-4 md:mt-0 bg-white text-teal-600 px-4 py-2 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
        >
          <CalendarCheck2 className="mr-2 h-5 w-5" />
          My Appointments
        </Link>
      </div>

      <FilterBar
        specialty={specialty}
        availability={availability}
        onSpecialtyChange={setSpecialty}
        onAvailabilityChange={setAvailability}
      />

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No doctors found matching your filters. Please try different criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookAppointment={(date, time) => handleBooking(doctor, date, time)}
            />
          ))}
        </div>
      )}

      {selectedDoctor && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setPreSelectedDate(undefined)
            setPreSelectedTime(undefined)
          }}
          doctor={selectedDoctor}
          onConfirm={handleConfirmBooking}
          preSelectedDate={preSelectedDate}
          preSelectedTime={preSelectedTime}
        />
      )}
    </main>
  )
}
