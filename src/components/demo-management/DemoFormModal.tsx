
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Demo } from '@/data/demoData';

interface DemoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (demoData: Omit<Demo, 'id'>) => void;
  demo?: Demo;
}

export function DemoFormModal({ isOpen, onClose, onSubmit, demo }: DemoFormModalProps) {
  const [formData, setFormData] = useState({
    studentNames: demo?.studentNames.join(', ') || '',
    instructor: demo?.instructor || '',
    artForm: demo?.artForm || '',
    demoType: demo?.demoType || '',
    date: demo?.date || '',
    startTime: demo?.startTime || '',
    endTime: demo?.endTime || '',
    notes: demo?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const demoData: Omit<Demo, 'id'> = {
      studentNames: formData.studentNames.split(',').map(name => name.trim()),
      instructor: formData.instructor,
      artForm: formData.artForm,
      demoType: formData.demoType as Demo['demoType'],
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || undefined,
      notes: formData.notes || undefined,
      status: 'Scheduled',
      attendanceMarked: false,
    };

    onSubmit(demoData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const instructors = ['Priya Sharma', 'Ravi Kumar', 'Anjali Patel', 'Kavya Reddy', 'Meera Joshi'];
  const artForms = ['Piano', 'Guitar', 'Violin', 'Classical Dance', 'Vocal Music', 'Drums'];
  const demoTypes = ['Group', 'Private', 'One-on-One'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{demo ? 'Edit Demo' : 'Create New Demo'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="studentNames">Student(s) *</Label>
            <Input
              id="studentNames"
              value={formData.studentNames}
              onChange={(e) => handleInputChange('studentNames', e.target.value)}
              placeholder="Enter student names separated by commas"
              required
            />
          </div>

          <div>
            <Label htmlFor="instructor">Instructor *</Label>
            <Select value={formData.instructor} onValueChange={(value) => handleInputChange('instructor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor} value={instructor}>
                    {instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="artForm">Art Form *</Label>
            <Select value={formData.artForm} onValueChange={(value) => handleInputChange('artForm', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select art form" />
              </SelectTrigger>
              <SelectContent>
                {artForms.map((artForm) => (
                  <SelectItem key={artForm} value={artForm}>
                    {artForm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="demoType">Demo Type *</Label>
            <Select value={formData.demoType} onValueChange={(value) => handleInputChange('demoType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select demo type" />
              </SelectTrigger>
              <SelectContent>
                {demoTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Optional notes for the demo session"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {demo ? 'Update Demo' : 'Create Demo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
