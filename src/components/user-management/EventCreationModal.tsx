
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: any) => void;
}

export function EventCreationModal({ isOpen, onClose, onCreateEvent }: EventCreationModalProps) {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [includeEndTime, setIncludeEndTime] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [includeCallLink, setIncludeCallLink] = useState(false);
  const [callLink, setCallLink] = useState('');
  const [allowGuests, setAllowGuests] = useState(false);

  const handleSubmit = () => {
    if (eventName.trim() && startDate && startTime) {
      onCreateEvent({
        eventName: eventName.trim(),
        description: description.trim(),
        startDate,
        startTime,
        endTime: includeEndTime ? endTime : null,
        location: location.trim(),
        callLink: includeCallLink ? callLink.trim() : null,
        allowGuests,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setEventName('');
    setDescription('');
    setStartDate('');
    setStartTime('');
    setIncludeEndTime(false);
    setEndTime('');
    setLocation('');
    setIncludeCallLink(false);
    setCallLink('');
    setAllowGuests(false);
    onClose();
  };

  const maxDescriptionLength = 200;
  const remainingChars = maxDescriptionLength - description.length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="eventName">Event name</Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, maxDescriptionLength))}
              placeholder="Add description..."
              className="mt-1 resize-none"
              rows={3}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {remainingChars} characters remaining
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeEndTime">Include end time</Label>
            <Switch
              id="includeEndTime"
              checked={includeEndTime}
              onCheckedChange={setIncludeEndTime}
            />
          </div>

          {includeEndTime && (
            <div>
              <Label htmlFor="endTime">End time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="location">Add location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeCallLink">Call link</Label>
            <Switch
              id="includeCallLink"
              checked={includeCallLink}
              onCheckedChange={setIncludeCallLink}
            />
          </div>

          {includeCallLink && (
            <div>
              <Input
                value={callLink}
                onChange={(e) => setCallLink(e.target.value)}
                placeholder="Enter call link"
                className="mt-1"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowGuests">Allow guests</Label>
              <Switch
                id="allowGuests"
                checked={allowGuests}
                onCheckedChange={setAllowGuests}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Guests can be invited to this event
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!eventName.trim() || !startDate || !startTime}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
