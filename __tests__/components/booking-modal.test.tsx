"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest"
import BookingModal from "@/components/booking-modal"
import { useAppointments } from "@/hooks/use-appointments"

// Mock dependencies
vi.mock("@/hooks/use-appointments", () => ({
  useAppointments: vi.fn(),
}))

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => (open ? <div data-testid="mock-dialog">{children}</div> : null),
  DialogContent: ({ children }: any) => <div data-testid="mock-dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="mock-dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="mock-dialog-title">{children}</div>,
  DialogFooter: ({ children }: any) => <div data-testid="mock-dialog-footer">{children}</div>,
}))

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect, disabled }: any) => (
    <div data-testid="mock-calendar">
      <button onClick={() => onSelect(new Date(2025, 3, 21))}>Select Date</button>
      <span>Is Disabled: {String(!!disabled)}</span>
    </div>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="mock-button">
      {children}
    </button>
  ),
}))

describe("BookingModal", () => {
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
      { day: "Friday", time: "10:00 AM" },
    ],
  }

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    doctor: mockDoctor,
    onConfirm: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppointments as jest.Mock).mockReturnValue({
      isTimeSlotBooked: () => false,
    })

    // Mock Date.now and new Date
    const mockDate = new Date(2025, 3, 21) // April 21, 2025 (a Monday)
    vi.spyOn(global, "Date").mockImplementation(() => mockDate as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the modal when isOpen is true", () => {
    render(<BookingModal {...mockProps} />)
    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument()
    expect(screen.getByText(`Dr. ${mockDoctor.name}`)).toBeInTheDocument()
    expect(screen.getByText(mockDoctor.specialty)).toBeInTheDocument()
  })

  it("does not render the modal when isOpen is false", () => {
    render(<BookingModal {...mockProps} isOpen={false} />)
    expect(screen.queryByTestId("mock-dialog")).not.toBeInTheDocument()
  })

  it("calls onClose when the Cancel button is clicked", () => {
    render(<BookingModal {...mockProps} />)

    const cancelButton = screen.getByText("Cancel")
    fireEvent.click(cancelButton)

    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it("disables the Confirm button when no slot is selected", () => {
    render(<BookingModal {...mockProps} />)

    const confirmButton = screen.getByText("Confirm Booking")
    expect(confirmButton).toBeDisabled()
  })

  it("enables the Confirm button when a slot is selected", async () => {
    render(<BookingModal {...mockProps} />)

    // First, select a date
    const selectDateButton = screen.getByText("Select Date")
    fireEvent.click(selectDateButton)

    // Then, select a time slot (Monday is the selected date)
    const mondaySlot = screen.getByText("9:00 AM")
    fireEvent.click(mondaySlot)

    const confirmButton = screen.getByText("Confirm Booking")
    expect(confirmButton).not.toBeDisabled()
  })

  it("calls onConfirm with the selected slot when Confirm is clicked", () => {
    render(<BookingModal {...mockProps} />)

    // Select a date
    const selectDateButton = screen.getByText("Select Date")
    fireEvent.click(selectDateButton)

    // Select a time slot
    const mondaySlot = screen.getByText("9:00 AM")
    fireEvent.click(mondaySlot)

    // Click confirm
    const confirmButton = screen.getByText("Confirm Booking")
    fireEvent.click(confirmButton)

    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1)
    expect(mockProps.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        day: "Monday",
        time: "9:00 AM",
      }),
    )
  })

  it("pre-selects a time slot when provided", () => {
    const preSelectedTimeSlot = { day: "Wednesday", time: "2:00 PM" }
    render(<BookingModal {...mockProps} preSelectedTimeSlot={preSelectedTimeSlot} />)

    // The Wednesday slot should be pre-selected
    expect(screen.getByText("2:00 PM")).toHaveClass("bg-teal-100")
  })

  it("filters out booked slots", () => {
    ;(useAppointments as jest.Mock).mockReturnValue({
      isTimeSlotBooked: (doctor: any, slot: any) => slot.day === "Monday",
    })

    render(<BookingModal {...mockProps} />)

    // Select a date (Wednesday)
    const selectDateButton = screen.getByText("Select Date")
    fireEvent.click(selectDateButton)

    // Monday slot should be filtered out
    expect(screen.queryByText("9:00 AM")).not.toBeInTheDocument()

    // Wednesday slot should be visible
    expect(screen.getByText("2:00 PM")).toBeInTheDocument()
  })
})
