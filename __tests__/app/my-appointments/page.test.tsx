"use client"

import { render, screen } from "@testing-library/react"
import { vi, describe, beforeEach, it } from "vitest"
import MyAppointments from "@/app/my-appointments/page"
import { useAppointments } from "@/hooks/use-appointments"

// Mock components
vi.mock("@/components/appointment-card", () => ({
  default: ({ appointment, onCancel }: any) => (
    <div data-testid={`appointment-card-${appointment.id}`}>
      <h2>Appointment with Dr. {appointment.doctor.name}</h2>
      <button onClick={onCancel}>Cancel Appointment</button>
    </div>
  ),
}))

vi.mock("@/hooks/use-appointments", () => ({
  useAppointments: vi.fn(),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}))

describe("MyAppointments Page", () => {
  const mockAppointments = [
    {
      id: "appointment-1",
      doctor: {
        id: "doctor-1",
        name: "Sarah Johnson",
        photo: "/test-photo.jpg",
        specialty: "Cardiology",
        rating: 4.8,
        location: "Downtown Medical Center",
        availableSlots: [],
      },
      timeSlot: { day: "Wednesday", time: "2:00 PM" },
      date: new Date(2025, 3, 21),
    },
    {
      id: "appointment-2",
      doctor: {
        id: "doctor-2",
        name: "Michael Chen",
        photo: "/test-photo.jpg",
        specialty: "Dermatology",
        rating: 4.9,
        location: "Westside Health Clinic",
        availableSlots: [],
      },
      timeSlot: { day: "Tuesday", time: "1:00 PM" },
      date: new Date(2025, 3, 20),
    },
  ]

  let mockCancelAppointment: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCancelAppointment = vi.fn()
  })

  it("renders the page title", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      appointments: [],
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    expect(screen.getByText("My Appointments")).toBeInTheDocument()
  })

  it("renders appointment cards when appointments exist", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointments,
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    // Check if all appointments are rendered
    mockAppointments.forEach((appointment) => {
      expect(screen.getByTestId(`appointment-card-${appointment.id}`)).toBeInTheDocument()
      expect(screen.getByText(`Appointment with Dr. ${appointment.doctor.name}`)).toBeInTheDocument()
    })
  })

  it("renders empty state when no appointments exist", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      appointments: [],
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    expect(screen.getByText("No appointments scheduled")).toBeInTheDocument()
    expect(screen.getByText("Find a Doctor")).toBeInTheDocument()
  })

  it("calls cancelAppointment when Cancel button is clicked", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointments,
      cancelAppointment: mockCancelAppointment,
    })

    render(<MyAppointments />)

    // Click the cancel button on the first appointment
    const cancelButtons = screen.getAllByText("Cancel Appointment")
    cancelButtons[0].click()

    expect(mockCancelAppointment).toHaveBeenCalledTimes(1)
    expect(mockCancelAppointment).toHaveBeenCalledWith(mockAppointments[0].id)
  })

  it("has a back link to the doctors page", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      appointments: [],
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    const backLink = screen.getByText("Back to Doctors")
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest("a")).toHaveAttribute("href", "/")
  })
})
