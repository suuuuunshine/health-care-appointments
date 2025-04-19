"use client"

import { useAppointments } from "@/hooks/use-appointments"
import AppointmentCard from "@/components/appointment-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MyAppointments() {
  const { appointments, cancelAppointment } = useAppointments()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-teal-600 hover:text-teal-700 transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctors
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-600 mt-2">View and manage your upcoming appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No appointments scheduled</h2>
          <p className="text-gray-500 mb-6">
            You don't have any upcoming appointments. Book an appointment with one of our specialists.
          </p>
          <Link
            href="/"
            className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => cancelAppointment(appointment.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
