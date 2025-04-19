"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specialties } from "@/lib/data"

interface FilterBarProps {
  specialty: string
  availability: string
  onSpecialtyChange: (value: string) => void
  onAvailabilityChange: (value: string) => void
}

export default function FilterBar({
  specialty,
  availability,
  onSpecialtyChange,
  onAvailabilityChange,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="specialty-select" className="block text-sm font-medium text-gray-700 mb-1">
            Specialty
          </label>
          <Select value={specialty} onValueChange={onSpecialtyChange}>
            <SelectTrigger id="specialty-select" className="w-full">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/2">
          <label htmlFor="availability-select" className="block text-sm font-medium text-gray-700 mb-1">
            Availability
          </label>
          <Select value={availability} onValueChange={onAvailabilityChange}>
            <SelectTrigger id="availability-select" className="w-full">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available Now</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
