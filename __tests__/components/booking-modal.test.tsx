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
    availability: [
      { date: "2025-04-21", slots: ["09:00", "11:30"] },
      { date: "2025-04-23", slots: ["14:00"] },
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
    ;(useAppointments as vi.Mock).mockReturnValue({
      isTimeSlotBooked: () => false,
      hasAvailableSlots: () => true,
      getAvailableSlots: () => ["09:00", "11:30"],
    })

    // Mock Date.now and new Date
    const mockDate = new Date(2025, 3, 21) // April 21, 2025
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

    // Then, select a time slot
    const timeSlot = screen.getByText("09:00")
    fireEvent.click(timeSlot)

    const confirmButton = screen.getByText("Confirm Booking")
    expect(confirmButton).not.toBeDisabled()
  })

  it("calls onConfirm with the selected date and time when Confirm is clicked", () => {
    render(<BookingModal {...mockProps} />)

    // Select a date
    const selectDateButton = screen.getByText("Select Date")
    fireEvent.click(selectDateButton)

    // Select a time slot
    const timeSlot = screen.getByText("09:00")
    fireEvent.click(timeSlot)

    // Click confirm
    const confirmButton = screen.getByText("Confirm Booking")
    fireEvent.click(confirmButton)

    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1)
    expect(mockProps.onConfirm).toHaveBeenCalledWith("2025-04-21", "09:00")
  })

  it("pre-selects a time slot when provided", () => {
    render(<BookingModal {...mockProps} preSelectedDate="2025-04-21" preSelectedTime="09:00" />)

    // The time slot should be pre-selected
    expect(screen.getByText("09:00")).toHaveClass("bg-teal-100")
  })

  it("filters out booked slots", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
      isTimeSlotBooked: (doctor: any, date: string, time: string) => time === "09:00",
      hasAvailableSlots: () => true,
      getAvailableSlots: () => ["11:30"],
    })

    render(<BookingModal {...mockProps} />)

    // Select a date
    const selectDateButton = screen.getByText("Select Date")
    fireEvent.click(selectDateButton)

    // 09:00 slot should be filtered out
    expect(screen.queryByText("09:00")).not.toBeInTheDocument()

    // 11:30 slot should be visible
    expect(screen.getByText("11:30")).toBeInTheDocument()
  })
})
