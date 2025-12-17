
import React, { useState } from 'react'
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Clock } from "lucide-react"
import { InlineLoader } from "@/components/ui/loader"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isActive: boolean
}

interface DayAvailability {
  day: string
  slots: TimeSlot[]
}

export default function Availability() {
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [isSaving, setIsSaving] = useState(false)
  const [availability, setAvailability] = useState<DayAvailability[]>([
    {
      day: "Monday",
      slots: [
        { id: "1", startTime: "10:00", endTime: "12:00", isActive: true },
        { id: "2", startTime: "14:00", endTime: "17:00", isActive: true }
      ]
    },
    {
      day: "Tuesday", 
      slots: [
        { id: "3", startTime: "09:00", endTime: "11:00", isActive: true }
      ]
    },
    {
      day: "Wednesday",
      slots: [
        { id: "4", startTime: "10:00", endTime: "12:00", isActive: false },
        { id: "5", startTime: "15:00", endTime: "18:00", isActive: true }
      ]
    },
    {
      day: "Thursday",
      slots: []
    },
    {
      day: "Friday",
      slots: [
        { id: "6", startTime: "11:00", endTime: "13:00", isActive: true }
      ]
    },
    {
      day: "Saturday",
      slots: [
        { id: "7", startTime: "09:00", endTime: "12:00", isActive: true },
        { id: "8", startTime: "14:00", endTime: "16:00", isActive: true }
      ]
    },
    {
      day: "Sunday",
      slots: []
    }
  ])

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "10:00", 
      isActive: true
    }
    
    setAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, slots: [...day.slots, newSlot] }
          : day
      )
    )
  }

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    setAvailability(prev =>
      prev.map((day, index) =>
        index === dayIndex
          ? { ...day, slots: day.slots.filter(slot => slot.id !== slotId) }
          : day
      )
    )
  }

  const updateTimeSlot = (dayIndex: number, slotId: string, field: keyof TimeSlot, value: any) => {
    setAvailability(prev =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              slots: day.slots.map(slot =>
                slot.id === slotId ? { ...slot, [field]: value } : slot
              )
            }
          : day
      )
    )
  }

  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push(timeString)
    }
  }

  return (
    <InstructorDashboardLayout title="Availability">
      <div className="space-y-6">
        {/* Timezone Selection */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timezone Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <label className="text-sm font-medium mb-2 block">Select Timezone</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Australia/Sydney (AEDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Availability */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Weekly Availability</CardTitle>
            <p className="text-sm text-gray-600">Set your available time slots for each day</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {availability.map((dayAvailability, dayIndex) => (
                <div key={dayAvailability.day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{dayAvailability.day}</h3>
                    <Button
                      onClick={() => addTimeSlot(dayIndex)}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Time Slot
                    </Button>
                  </div>
                  
                  {dayAvailability.slots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
                      No time slots available. Click "Add Time Slot" to add availability.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayAvailability.slots.map((slot) => (
                        <div key={slot.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Select
                              value={slot.startTime}
                              onValueChange={(value) => updateTimeSlot(dayIndex, slot.id, 'startTime', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <span className="text-gray-500">to</span>
                            
                            <Select
                              value={slot.endTime}
                              onValueChange={(value) => updateTimeSlot(dayIndex, slot.id, 'endTime', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={slot.isActive}
                              onCheckedChange={(checked) => updateTimeSlot(dayIndex, slot.id, 'isActive', checked)}
                            />
                            <Badge variant={slot.isActive ? "default" : "secondary"}>
                              {slot.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          
                          <Button
                            onClick={() => removeTimeSlot(dayIndex, slot.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
              <Button variant="outline">Reset to Default</Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                disabled={isSaving}
                onClick={() => {
                  setIsSaving(true)
                  setTimeout(() => setIsSaving(false), 2000)
                }}
              >
                {isSaving ? <InlineLoader size="sm" /> : null}
                {isSaving ? "Saving..." : "Save Availability"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  )
}
