export interface TimeSlot {
  day: string
  time: string
}

export interface Doctor {
  id: string
  name: string
  photo: string
  specialty: string
  rating: number
  location: string
  availableSlots: TimeSlot[]
}

export interface Appointment {
  id: string
  doctor: Doctor
  timeSlot: TimeSlot
  date: Date
}
