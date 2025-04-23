import type { Doctor } from "./types"

export const specialties = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Ophthalmology",
  "Gynecology",
]

export const doctors: Doctor[] = [
  {
    id: "doctor-1",
    name: "Sarah Johnson",
    photo:
      "https://media.istockphoto.com/id/1371998919/photo/cropped-portrait-of-an-attractive-young-female-doctor-giving-thumbs-up-while-working-in-her.jpg?s=612x612&w=0&k=20&c=5oPD2p5gc7ZQjgyjPAJui9eOGKF8sK_GG6MJpYXmA7s=",
    specialty: "Cardiology",
    rating: 4.8,
    location: "Downtown Medical Center",
    availability: [
      { date: "2025-04-21", slots: ["09:00", "11:30"] },
      { date: "2025-04-23", slots: ["14:00"] },
      { date: "2025-04-25", slots: ["10:00"] },
    ],
  },
  {
    id: "doctor-2",
    name: "Michael Chen",
    photo: "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg",
    specialty: "Dermatology",
    rating: 4.9,
    location: "Westside Health Clinic",
    availability: [
      { date: "2025-04-22", slots: ["08:30", "13:00"] },
      { date: "2025-04-24", slots: ["15:30"] },
    ],
  },
  {
    id: "doctor-3",
    name: "Emily Rodriguez",
    photo:
      "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg?semt=ais_hybrid&w=740",
    specialty: "Pediatrics",
    rating: 4.7,
    location: "Children's Medical Center",
    availability: [
      { date: "2025-04-21", slots: ["10:00"] },
      { date: "2025-04-23", slots: ["09:30", "14:30"] },
      { date: "2025-04-25", slots: ["11:00"] },
    ],
  },
  {
    id: "doctor-4",
    name: "David Wilson",
    photo: "/placeholder.svg?height=400&width=400",
    specialty: "Orthopedics",
    rating: 4.6,
    location: "Sports Medicine Clinic",
    availability: [
      { date: "2025-04-22", slots: ["11:00"] },
      { date: "2025-04-24", slots: ["09:00", "16:00"] },
    ],
  },
  {
    id: "doctor-5",
    name: "Olivia Thompson",
    photo: "/placeholder.svg?height=400&width=400",
    specialty: "Neurology",
    rating: 4.9,
    location: "Neuroscience Institute",
    availability: [
      { date: "2025-04-21", slots: ["14:00"] },
      { date: "2025-04-23", slots: ["10:30"] },
      { date: "2025-04-25", slots: ["13:30"] },
    ],
  },
  {
    id: "doctor-6",
    name: "James Parker",
    photo: "/placeholder.svg?height=400&width=400",
    specialty: "Psychiatry",
    rating: 4.7,
    location: "Behavioral Health Center",
    availability: [
      { date: "2025-04-22", slots: ["09:30", "15:00"] },
      { date: "2025-04-24", slots: ["13:00"] },
    ],
  },
  {
    id: "doctor-7",
    name: "Sophia Lee",
    photo: "/placeholder.svg?height=400&width=400",
    specialty: "Ophthalmology",
    rating: 4.8,
    location: "Vision Care Center",
    availability: [
      { date: "2025-04-21", slots: ["08:30"] },
      { date: "2025-04-23", slots: ["13:00"] },
      { date: "2025-04-25", slots: ["09:00"] },
    ],
  },
  {
    id: "doctor-8",
    name: "Robert Martinez",
    photo: "/placeholder.svg?height=400&width=400",
    specialty: "Gynecology",
    rating: 4.6,
    location: "Women's Health Clinic",
    availability: [
      { date: "2025-04-22", slots: ["10:00"] },
      { date: "2025-04-24", slots: ["14:30", "16:30"] },
    ],
  },
  {
    id: "doctor-9",
    name: "Jennifer Adams",
    photo: "/placeholder.svg?height=400&width=400",
    specialty: "Cardiology",
    rating: 4.5,
    location: "Heart & Vascular Institute",
    availability: [],
  },
]
