import { renderHook, act } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import { AppointmentsProvider, useAppointments } from "@/hooks/use-appointments"

describe("useAppointments", () => {
  const mockAppointment = {
    id: "appointment-1",
    doctor: {
      id: "doctor-1",
      name: "Sarah Johnson",
      specialty: "Cardiology",
      photo: "/test-photo.jpg",
      rating: 4.8,
      location: "Downtown Medical Center",
      availableSlots: [],
    },
    timeSlot: { day: "Wednesday", time: "2:00 PM" },
    date: new Date(2025, 3, 21),
  }

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("should initialize with empty appointments", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    expect(result.current.appointments).toEqual([])
  })

  it("should add an appointment", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    act(() => {
      result.current.addAppointment(mockAppointment)
    })

    expect(result.current.appointments).toHaveLength(1)
    expect(result.current.appointments[0]).toEqual(mockAppointment)
  })

  it("should cancel an appointment", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    act(() => {
      result.current.addAppointment(mockAppointment)
    })

    expect(result.current.appointments).toHaveLength(1)

    act(() => {
      result.current.cancelAppointment(mockAppointment.id)
    })

    expect(result.current.appointments).toHaveLength(0)
  })

  it("should check if a time slot is booked", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    act(() => {
      result.current.addAppointment(mockAppointment)
    })

    // Same doctor, same day and time - should be booked
    expect(result.current.isTimeSlotBooked(mockAppointment.doctor, { day: "Wednesday", time: "2:00 PM" })).toBe(true)

    // Same doctor, different time - should not be booked
    expect(result.current.isTimeSlotBooked(mockAppointment.doctor, { day: "Wednesday", time: "3:00 PM" })).toBe(false)

    // Different doctor, same time - should not be booked
    expect(
      result.current.isTimeSlotBooked(
        { ...mockAppointment.doctor, id: "doctor-2" },
        { day: "Wednesday", time: "2:00 PM" },
      ),
    ).toBe(false)
  })

  it("should load appointments from localStorage", () => {
    // Setup localStorage with a saved appointment
    localStorage.setItem(
      "appointments",
      JSON.stringify([{ ...mockAppointment, date: mockAppointment.date.toISOString() }]),
    )

    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    expect(result.current.appointments).toHaveLength(1)
    expect(result.current.appointments[0].id).toBe(mockAppointment.id)
    expect(result.current.appointments[0].doctor.id).toBe(mockAppointment.doctor.id)
  })

  it("should save appointments to localStorage when they change", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    act(() => {
      result.current.addAppointment(mockAppointment)
    })

    const savedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    expect(savedAppointments).toHaveLength(1)
    expect(savedAppointments[0].id).toBe(mockAppointment.id)
  })
})
