export interface TimeSlot {
  time: string
}

export interface AvailabilitySlot {
  date: string
  slots: string[]
}

export interface Doctor {
  id: string
  name: string
  photo: string
  specialty: string
  rating: number
  location: string
  availability: AvailabilitySlot[]
}

export interface Appointment {
  id: string
  doctor: Doctor
  date: string
  time: string
}
