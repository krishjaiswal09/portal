
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeSlot } from "@/types/student";

interface TimeSlotManagerProps {
  timeSlots: TimeSlot[];
  onTimeSlotsChange: (timeSlots: TimeSlot[]) => void;
}

export function TimeSlotManager({ timeSlots, onTimeSlotsChange }: TimeSlotManagerProps) {
  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      date: "",
      startTime: "",
      endTime: "",
      isReserved: false
    };
    onTimeSlotsChange([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    onTimeSlotsChange(timeSlots.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    onTimeSlotsChange(
      timeSlots.map(slot => 
        slot.id === id ? { ...slot, ...updates } : slot
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Time Slots</Label>
        <Button
          type="button"
          onClick={addTimeSlot}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      {timeSlots.map((slot, index) => (
        <div key={slot.id} className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Time Slot {index + 1}</span>
            {timeSlots.length > 1 && (
              <Button
                type="button"
                onClick={() => removeTimeSlot(slot.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor={`date-${slot.id}`} className="text-sm">Date</Label>
              <Input
                id={`date-${slot.id}`}
                type="date"
                value={slot.date}
                onChange={(e) => updateTimeSlot(slot.id, { date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`start-${slot.id}`} className="text-sm">Start Time</Label>
              <Input
                id={`start-${slot.id}`}
                type="time"
                value={slot.startTime}
                onChange={(e) => updateTimeSlot(slot.id, { startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`end-${slot.id}`} className="text-sm">End Time</Label>
              <Input
                id={`end-${slot.id}`}
                type="time"
                value={slot.endTime}
                onChange={(e) => updateTimeSlot(slot.id, { endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`reserve-${slot.id}`}
              checked={slot.isReserved}
              onCheckedChange={(checked) => 
                updateTimeSlot(slot.id, { isReserved: !!checked })
              }
            />
            <Label htmlFor={`reserve-${slot.id}`} className="text-sm">
              Reserve this time slot
            </Label>
          </div>
        </div>
      ))}
    </div>
  );
}
