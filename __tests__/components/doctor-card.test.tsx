import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import DoctorCard from "@/components/doctor-card"
import { useAppointments } from "@/hooks/use-appointments"

// Mock the useAppointments hook
vi.mock("@/hooks/use-appointments", () => ({
  useAppointments: vi.fn(),
}))

describe("DoctorCard", () => {
  const mockDoctor = {
    id: "doctor-1",
    name: "Sarah Johnson",
    photo: "/test-photo.jpg",
    specialty: "Cardiology",
    rating: 4.8,
    location: "Downtown Medical Center",
    availableSlots: [
      { day: "Monday", time: "9:00 AM" },
      { day: "Wednesday", time: "2:00 PM" },
    ],
  }

  const mockOnBookAppointment = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppointments as jest.Mock).mockReturnValue({
      isTimeSlotBooked: () => false,
    })
  })

  it("renders doctor information correctly", () => {
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    expect(screen.getByText(`Dr. ${mockDoctor.name}`)).toBeInTheDocument()
    expect(screen.getByText(mockDoctor.specialty)).toBeInTheDocument()
    expect(screen.getByText(mockDoctor.location)).toBeInTheDocument()
    expect(screen.getByText("4.8")).toBeInTheDocument()
  })

  it("displays available slots", () => {
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    expect(screen.getByText("Monday, 9:00 AM")).toBeInTheDocument()
    expect(screen.getByText("Wednesday, 2:00 PM")).toBeInTheDocument()
  })

  it("calls onBookAppointment when Book Appointment button is clicked", () => {
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    fireEvent.click(screen.getByText("Book Appointment"))
    expect(mockOnBookAppointment).toHaveBeenCalledTimes(1)
    expect(mockOnBookAppointment).toHaveBeenCalledWith()
  })

  it("calls onBookAppointment with time slot when a slot is clicked", () => {
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    fireEvent.click(screen.getByText("Monday, 9:00 AM"))
    expect(mockOnBookAppointment).toHaveBeenCalledTimes(1)
    expect(mockOnBookAppointment).toHaveBeenCalledWith(mockDoctor.availableSlots[0])
  })

  it("disables Book Appointment button when no slots are available", () => {
    const doctorWithNoSlots = { ...mockDoctor, availableSlots: [] }
    render(<DoctorCard doctor={doctorWithNoSlots} onBookAppointment={mockOnBookAppointment} />)

    expect(screen.getByText("Currently Unavailable")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Currently Unavailable" })).toBeDisabled()
  })

  it("filters out booked slots", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      isTimeSlotBooked: (doctor: any, slot: any) => slot.day === "Monday",
    })

    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    expect(screen.queryByText("Monday, 9:00 AM")).not.toBeInTheDocument()
    expect(screen.getByText("Wednesday, 2:00 PM")).toBeInTheDocument()
  })
})
