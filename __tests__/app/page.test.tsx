"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import Home from "@/app/page"
import { useAppointments } from "@/hooks/use-appointments"
import { doctors } from "@/lib/data"

// Mock components
vi.mock("@/components/doctor-card", () => ({
  default: ({ doctor, onBookAppointment }: any) => (
    <div data-testid={`doctor-card-${doctor.id}`}>
      <h2>Dr. {doctor.name}</h2>
      <button onClick={() => onBookAppointment()}>Book</button>
      <button onClick={() => onBookAppointment("2025-04-21", "09:00")}>Book Specific Slot</button>
    </div>
  ),
}))

vi.mock("@/components/filter-bar", () => ({
  default: ({ specialty, availability, onSpecialtyChange, onAvailabilityChange }: any) => (
    <div data-testid="filter-bar">
      <select data-testid="specialty-select" value={specialty} onChange={(e) => onSpecialtyChange(e.target.value)}>
        <option value="all">All Specialties</option>
        <option value="Cardiology">Cardiology</option>
      </select>
      <select
        data-testid="availability-select"
        value={availability}
        onChange={(e) => onAvailabilityChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="available">Available</option>
      </select>
    </div>
  ),
}))

vi.mock("@/components/booking-modal", () => ({
  default: ({ isOpen, onClose, doctor, onConfirm, preSelectedDate, preSelectedTime }: any) =>
    isOpen ? (
      <div data-testid="booking-modal">
        <h2>Book with Dr. {doctor.name}</h2>
        <p>Selected Date: {preSelectedDate || "None"}</p>
        <p>Selected Time: {preSelectedTime || "None"}</p>
        <button onClick={() => onConfirm("2025-04-21", "09:00")}>Confirm</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
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

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppointments as jest.Mock).mockReturnValue({
      addAppointment: vi.fn(() => true),
      hasAvailableSlots: () => true,
    })
  })

  it("renders the page title and filter bar", () => {
    render(<Home />)

    expect(screen.getByText("Find a Doctor")).toBeInTheDocument()
    expect(screen.getByTestId("filter-bar")).toBeInTheDocument()
  })

  it("renders doctor cards", () => {
    render(<Home />)

    // Check if all doctors are rendered
    doctors.forEach((doctor) => {
      expect(screen.getByTestId(`doctor-card-${doctor.id}`)).toBeInTheDocument()
      expect(screen.getByText(`Dr. ${doctor.name}`)).toBeInTheDocument()
    })
  })

  it("opens the booking modal when a doctor card is clicked", () => {
    render(<Home />)

    // Initially, the modal should not be visible
    expect(screen.queryByTestId("booking-modal")).not.toBeInTheDocument()

    // Click on the first doctor's book button
    fireEvent.click(screen.getAllByText("Book")[0])

    // Now the modal should be visible
    expect(screen.getByTestId("booking-modal")).toBeInTheDocument()
    expect(screen.getByText(`Book with Dr. ${doctors[0].name}`)).toBeInTheDocument()
  })

  it("opens the booking modal with pre-selected date and time", () => {
    render(<Home />)

    // Click on the first doctor's specific slot button
    fireEvent.click(screen.getAllByText("Book Specific Slot")[0])

    // Modal should be visible with pre-selected date and time
    expect(screen.getByTestId("booking-modal")).toBeInTheDocument()
    expect(screen.getByText("Selected Date: 2025-04-21")).toBeInTheDocument()
    expect(screen.getByText("Selected Time: 09:00")).toBeInTheDocument()
  })

  it("closes the booking modal", () => {
    render(<Home />)

    // Open the modal
    fireEvent.click(screen.getAllByText("Book")[0])
    expect(screen.getByTestId("booking-modal")).toBeInTheDocument()

    // Close the modal
    fireEvent.click(screen.getByText("Close"))
    expect(screen.queryByTestId("booking-modal")).not.toBeInTheDocument()
  })

  it("adds an appointment when booking is confirmed", () => {
    const mockAddAppointment = vi.fn(() => true)
    ;(useAppointments as jest.Mock).mockReturnValue({
      addAppointment: mockAddAppointment,
      hasAvailableSlots: () => true,
    })

    render(<Home />)

    // Open the modal
    fireEvent.click(screen.getAllByText("Book")[0])

    // Confirm booking
    fireEvent.click(screen.getByText("Confirm"))

    // Check if addAppointment was called
    expect(mockAddAppointment).toHaveBeenCalledTimes(1)
    expect(mockAddAppointment).toHaveBeenCalledWith(
      expect.objectContaining({
        doctor: doctors[0],
        date: "2025-04-21",
        time: "09:00",
      }),
    )

    // Modal should be closed after confirmation
    expect(screen.queryByTestId("booking-modal")).not.toBeInTheDocument()
  })

  it("filters doctors by specialty", () => {
    render(<Home />)

    // Initially all doctors should be visible
    doctors.forEach((doctor) => {
      expect(screen.getByText(`Dr. ${doctor.name}`)).toBeInTheDocument()
    })

    // Filter by Cardiology
    fireEvent.change(screen.getByTestId("specialty-select"), { target: { value: "Cardiology" } })

    // Only Cardiology doctors should be visible
    const cardiologists = doctors.filter((d) => d.specialty === "Cardiology")
    const nonCardiologists = doctors.filter((d) => d.specialty !== "Cardiology")

    cardiologists.forEach((doctor) => {
      expect(screen.getByText(`Dr. ${doctor.name}`)).toBeInTheDocument()
    })

    nonCardiologists.forEach((doctor) => {
      expect(screen.queryByText(`Dr. ${doctor.name}`)).not.toBeInTheDocument()
    })
  })

  it("filters doctors by availability", () => {
    // Mock some doctors as having no available slots
    ;(useAppointments as jest.Mock).mockReturnValue({
      addAppointment: vi.fn(() => true),
      hasAvailableSlots: (doctor: any) => doctor.id !== "doctor-1",
    })

    render(<Home />)

    // Filter by available
    fireEvent.change(screen.getByTestId("availability-select"), { target: { value: "available" } })

    // Doctor-1 should not be visible (no available slots)
    expect(screen.queryByText(`Dr. ${doctors[0].name}`)).not.toBeInTheDocument()

    // Other doctors should be visible
    doctors.slice(1).forEach((doctor) => {
      expect(screen.getByText(`Dr. ${doctor.name}`)).toBeInTheDocument()
    })
  })

  it("shows a message when no doctors match the filters", () => {
    // Mock all doctors as having no available slots
    ;(useAppointments as jest.Mock).mockReturnValue({
      addAppointment: vi.fn(),
      hasAvailableSlots: () => false,
    })

    render(<Home />)

    // Filter by available
    fireEvent.change(screen.getByTestId("availability-select"), { target: { value: "available" } })

    // No doctors should be visible
    doctors.forEach((doctor) => {
      expect(screen.queryByText(`Dr. ${doctor.name}`)).not.toBeInTheDocument()
    })

    // Message should be visible
    expect(
      screen.getByText("No doctors found matching your filters. Please try different criteria."),
    ).toBeInTheDocument()
  })
})
