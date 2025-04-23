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
    availability: [
      { date: "2025-04-21", slots: ["09:00", "11:30"] },
      { date: "2025-04-23", slots: ["14:00"] },
    ],
  }

  const mockOnBookAppointment = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppointments as vi.Mock).mockReturnValue({
      getDoctorAvailability: () => [
        { date: "2025-04-21", slots: ["09:00", "11:30"] },
        { date: "2025-04-23", slots: ["14:00"] },
      ],
      hasAvailableSlots: () => true,
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

    expect(screen.getByText("Apr 21, 2025")).toBeInTheDocument()
    expect(screen.getByText("09:00")).toBeInTheDocument()
    expect(screen.getByText("11:30")).toBeInTheDocument()
  })

  it("calls onBookAppointment when Book Appointment button is clicked", () => {
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    fireEvent.click(screen.getByText("Book Appointment"))
    expect(mockOnBookAppointment).toHaveBeenCalledTimes(1)
    expect(mockOnBookAppointment).toHaveBeenCalledWith(undefined, undefined)
  })

  it("calls onBookAppointment with date and time when a slot is clicked", () => {
    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    fireEvent.click(screen.getByText("09:00"))
    expect(mockOnBookAppointment).toHaveBeenCalledTimes(1)
    expect(mockOnBookAppointment).toHaveBeenCalledWith("2025-04-21", "09:00")
  })

  it("disables Book Appointment button when no slots are available", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
      getDoctorAvailability: () => [],
      hasAvailableSlots: () => false,
    })

    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />)

    expect(screen.getByText("Currently Unavailable")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Currently Unavailable" })).toBeDisabled()
  })
})
