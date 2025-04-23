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

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children, open, onOpenChange }: any) =>
    open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }: any) => <div data-testid="alert-dialog-content">{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div data-testid="alert-dialog-header">{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div data-testid="alert-dialog-title">{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div data-testid="alert-dialog-description">{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div data-testid="alert-dialog-footer">{children}</div>,
  AlertDialogCancel: ({ children }: any) => <button data-testid="alert-dialog-cancel">{children}</button>,
  AlertDialogAction: ({ children, onClick }: any) => (
    <button data-testid="alert-dialog-action" onClick={onClick}>
      {children}
    </button>
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
        availability: [],
      },
      date: "2025-04-21",
      time: "14:00",
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
        availability: [],
      },
      date: "2025-04-22",
      time: "13:00",
    },
  ]

  let mockCancelAppointment: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCancelAppointment = vi.fn()
  })

  it("renders the page title", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
      appointments: [],
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    expect(screen.getByText("My Appointments")).toBeInTheDocument()
  })

  it("renders appointment cards when appointments exist", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
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
    ;(useAppointments as vi.Mock).mockReturnValue({
      appointments: [],
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    expect(screen.getByText("No appointments scheduled")).toBeInTheDocument()
    expect(screen.getByText("Find a Doctor")).toBeInTheDocument()
  })

  it("shows confirmation dialog when Cancel button is clicked", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
      appointments: mockAppointments,
      cancelAppointment: mockCancelAppointment,
    })

    render(<MyAppointments />)

    // Click the cancel button on the first appointment
    const cancelButtons = screen.getAllByText("Cancel Appointment")
    cancelButtons[0].click()

    // Alert dialog should be visible
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument()
    expect(screen.getByText("Cancel Appointment")).toBeInTheDocument()
  })

  it("calls cancelAppointment when confirmation is confirmed", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
      appointments: mockAppointments,
      cancelAppointment: mockCancelAppointment,
    })

    render(<MyAppointments />)

    // Click the cancel button on the first appointment
    const cancelButtons = screen.getAllByText("Cancel Appointment")
    cancelButtons[0].click()

    // Confirm the cancellation
    const confirmButton = screen.getByTestId("alert-dialog-action")
    confirmButton.click()

    expect(mockCancelAppointment).toHaveBeenCalledTimes(1)
    expect(mockCancelAppointment).toHaveBeenCalledWith(mockAppointments[0].id)
  })

  it("has a back link to the doctors page", () => {
    ;(useAppointments as vi.Mock).mockReturnValue({
      appointments: [],
      cancelAppointment: vi.fn(),
    })

    render(<MyAppointments />)

    const backLink = screen.getByText("Back to Doctors")
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest("a")).toHaveAttribute("href", "/")
  })
})
