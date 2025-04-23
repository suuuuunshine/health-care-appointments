import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import AppointmentCard from "@/components/appointment-card"

describe("AppointmentCard", () => {
  const mockAppointment = {
    id: "appointment-1",
    doctor: {
      id: "doctor-1",
      name: "Sarah Johnson",
      photo: "/test-photo.jpg",
      specialty: "Cardiology",
      rating: 4.8,
      location: "Downtown Medical Center",
      availability: [],
    },
    date: "2025-04-21",
    time: "14:00",
  }

  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders appointment information correctly", () => {
    render(<AppointmentCard appointment={mockAppointment} onCancel={mockOnCancel} />)

    expect(screen.getByText(`Appointment with Dr. ${mockAppointment.doctor.name}`)).toBeInTheDocument()
    expect(screen.getByText(mockAppointment.doctor.specialty)).toBeInTheDocument()
    expect(screen.getByText("Monday, April 21, 2025")).toBeInTheDocument()
    expect(screen.getByText(mockAppointment.time)).toBeInTheDocument()
    expect(screen.getByText(mockAppointment.doctor.location)).toBeInTheDocument()
  })

  it("calls onCancel when Cancel button is clicked", () => {
    render(<AppointmentCard appointment={mockAppointment} onCancel={mockOnCancel} />)

    fireEvent.click(screen.getByText("Cancel"))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })
})
