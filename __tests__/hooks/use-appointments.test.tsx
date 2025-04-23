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
      availability: [
        { date: "2025-04-21", slots: ["09:00", "11:30"] },
        { date: "2025-04-23", slots: ["14:00"] },
      ],
    },
    date: "2025-04-21",
    time: "09:00",
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

    // Same doctor, same date and time - should be booked
    expect(result.current.isTimeSlotBooked(mockAppointment.doctor, "2025-04-21", "09:00")).toBe(true)

    // Same doctor, same date, different time - should not be booked
    expect(result.current.isTimeSlotBooked(mockAppointment.doctor, "2025-04-21", "11:30")).toBe(false)

    // Same doctor, different date - should not be booked
    expect(result.current.isTimeSlotBooked(mockAppointment.doctor, "2025-04-23", "14:00")).toBe(false)

    // Different doctor, same date and time - should not be booked
    expect(result.current.isTimeSlotBooked({ ...mockAppointment.doctor, id: "doctor-2" }, "2025-04-21", "09:00")).toBe(
      false,
    )
  })

  it("should get available slots for a doctor", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    act(() => {
      result.current.addAppointment(mockAppointment)
    })

    const availableDates = result.current.getDoctorAvailability(mockAppointment.doctor)

    // Should have 2 dates with available slots
    expect(availableDates).toHaveLength(2)

    // First date should have 1 slot available (11:30)
    expect(availableDates[0].date).toBe("2025-04-21")
    expect(availableDates[0].slots).toEqual(["11:30"])

    // Second date should have 1 slot available (14:00)
    expect(availableDates[1].date).toBe("2025-04-23")
    expect(availableDates[1].slots).toEqual(["14:00"])
  })

  it("should check if a doctor has any available slots", () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AppointmentsProvider,
    })

    // Initially all slots are available
    expect(result.current.hasAvailableSlots(mockAppointment.doctor)).toBe(true)

    // Book all slots
    act(() => {
      result.current.addAppointment(mockAppointment)
      result.current.addAppointment({
        ...mockAppointment,
        id: "appointment-2",
        time: "11:30",
      })
      result.current.addAppointment({
        ...mockAppointment,
        id: "appointment-3",
        date: "2025-04-23",
        time: "14:00",
      })
    })

    // Now no slots should be available
    expect(result.current.hasAvailableSlots(mockAppointment.doctor)).toBe(false)
  })

  it("should load appointments from localStorage", () => {
    // Setup localStorage with a saved appointment
    localStorage.setItem("appointments", JSON.stringify([mockAppointment]))

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
