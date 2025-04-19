"use client"

import { useState } from "react"
import { doctors } from "@/lib/data"
import DoctorCard from "@/components/doctor-card"
import FilterBar from "@/components/filter-bar"
import BookingModal from "@/components/booking-modal"
import type { Doctor, TimeSlot } from "@/lib/types"
import { useAppointments } from "@/hooks/use-appointments"
import Link from "next/link"
import { CalendarCheck2 } from "lucide-react"

export default function Home() {
  const [specialty, setSpecialty] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addAppointment } = useAppointments()

  const handleBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = (timeSlot: TimeSlot) => {
    if (selectedDoctor) {
      addAppointment({
        id: `appointment-${Date.now()}`,
        doctor: selectedDoctor,
        timeSlot,
        date: new Date(),
      })
      setIsModalOpen(false)
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = specialty === "all" || doctor.specialty === specialty
    const matchesAvailability =
      availability === "all" || (availability === "available" && doctor.availableSlots.length > 0)
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
            <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={() => handleBooking(doctor)} />
          ))}
        </div>
      )}

      {selectedDoctor && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          doctor={selectedDoctor}
          onConfirm={handleConfirmBooking}
        />
      )}
    </main>
  )
}
