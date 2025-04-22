"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import FilterBar from "@/components/filter-bar"

// Mock the UI components
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="mock-select" data-value={value} onClick={() => onValueChange && onValueChange("test")}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="mock-select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="mock-select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="mock-select-trigger">{children}</div>,
  SelectValue: ({ children }: any) => <div data-testid="mock-select-value">{children}</div>,
}))

describe("FilterBar", () => {
  const mockProps = {
    specialty: "all",
    availability: "all",
    onSpecialtyChange: vi.fn(),
    onAvailabilityChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders specialty and availability filters", () => {
    render(<FilterBar {...mockProps} />)

    expect(screen.getByText("Specialty")).toBeInTheDocument()
    expect(screen.getByText("Availability")).toBeInTheDocument()
  })

  it("calls onSpecialtyChange when specialty is changed", () => {
    render(<FilterBar {...mockProps} />)

    const selects = screen.getAllByTestId("mock-select")
    fireEvent.click(selects[0]) // First select is specialty

    expect(mockProps.onSpecialtyChange).toHaveBeenCalledWith("test")
  })

  it("calls onAvailabilityChange when availability is changed", () => {
    render(<FilterBar {...mockProps} />)

    const selects = screen.getAllByTestId("mock-select")
    fireEvent.click(selects[1]) // Second select is availability

    expect(mockProps.onAvailabilityChange).toHaveBeenCalledWith("test")
  })

  it("passes the current values to the selects", () => {
    const customProps = {
      ...mockProps,
      specialty: "Cardiology",
      availability: "available",
    }

    render(<FilterBar {...customProps} />)

    const selects = screen.getAllByTestId("mock-select")
    expect(selects[0]).toHaveAttribute("data-value", "Cardiology")
    expect(selects[1]).toHaveAttribute("data-value", "available")
  })
})
