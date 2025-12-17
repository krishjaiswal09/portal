
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, AlertTriangle } from 'lucide-react';

interface FlagActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlag: (flag: { reason: string; description: string; priority: string }) => void;
  itemId?: string;
}

export function FlagActivityModal({ isOpen, onClose, onFlag, itemId }: FlagActivityModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const flagReasons = [
    { value: 'suspicious', label: 'Suspicious Activity' },
    { value: 'policy_violation', label: 'Policy Violation' },
    { value: 'security_concern', label: 'Security Concern' },
    { value: 'inappropriate', label: 'Inappropriate Behavior' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleFlag = () => {
    if (reason && description.trim()) {
      onFlag({ reason, description: description.trim(), priority });
      setReason('');
      setDescription('');
      setPriority('medium');
      onClose();
    }
  };

  const handleClose = () => {
    setReason('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-600" />
            Flag Activity
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="flag-reason">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {flagReasons.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="flag-priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {priorities.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <div className="flex items-center gap-2">
                      {item.value === 'critical' && <AlertTriangle className="h-3 w-3 text-red-600" />}
                      {item.value === 'high' && <AlertTriangle className="h-3 w-3 text-orange-600" />}
                      {item.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="flag-description">Description</Label>
            <Textarea
              id="flag-description"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleFlag} className="bg-red-600 hover:bg-red-700">
            Flag Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
