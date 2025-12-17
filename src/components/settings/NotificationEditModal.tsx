
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NotificationEvent, NotificationConfig, ReceiverRole, RECEIVER_ROLES, PLACEHOLDER_OPTIONS } from '@/types/notification';
import { Plus, X, Type } from 'lucide-react';

interface NotificationEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: NotificationEvent | null;
  type: 'email' | 'whatsapp';
  onSave: (config: NotificationConfig) => void;
}

export function NotificationEditModal({ open, onOpenChange, event, type, onSave }: NotificationEditModalProps) {
  const [receivers, setReceivers] = useState<ReceiverRole[]>([]);
  const [reminderTimes, setReminderTimes] = useState<number[]>([]);
  const [sendToSupport, setSendToSupport] = useState(false);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  useEffect(() => {
    if (event) {
      const config = type === 'email' ? event.emailConfig : event.whatsappConfig;
      setReceivers(config.receivers);
      setReminderTimes(config.reminderTimes);
      setSendToSupport(config.sendToSupport);
      setSubject(config.subject || '');
      setMessageBody(config.messageBody);
    }
  }, [event, type]);

  const handleReceiverToggle = (role: ReceiverRole) => {
    setReceivers(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleAddReminderTime = () => {
    const minutes = parseInt(newReminderTime);
    if (minutes && !reminderTimes.includes(minutes)) {
      setReminderTimes(prev => [...prev, minutes].sort((a, b) => b - a));
      setNewReminderTime('');
    }
  };

  const handleRemoveReminderTime = (minutes: number) => {
    setReminderTimes(prev => prev.filter(time => time !== minutes));
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById('message-body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = messageBody.substring(0, start) + placeholder + messageBody.substring(end);
      setMessageBody(newText);

      // Set cursor position after the placeholder
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleSave = () => {
    const config: NotificationConfig = {
      receivers,
      reminderTimes,
      sendToSupport,
      messageBody,
      ...(type === 'email' && { subject })
    };
    onSave(config);
  };

  const formatReminderTime = (minutes: number) => {
    if (minutes === 0) return 'Immediately';
    if (minutes < 60) return `${minutes} minutes before`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours before`;
    return `${Math.floor(minutes / 1440)} days before`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Edit {type === 'email' ? 'Email' : 'WhatsApp'} Notification - {event?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event (Read-only) */}
          <div className="space-y-2">
            <Label>Event</Label>
            <Input value={event?.name || ''} disabled className="bg-muted" />
          </div>

          {/* Receivers */}
          <div className="space-y-3">
            <Label>Receivers</Label>
            <div className="grid grid-cols-2 gap-2">
              {RECEIVER_ROLES.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.value}
                    checked={receivers.includes(role.value)}
                    onCheckedChange={() => handleReceiverToggle(role.value)}
                  />
                  <Label htmlFor={role.value} className="text-sm font-normal">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Times */}
          <div className="space-y-3">
            <Label>Scheduled Before (in minutes)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter minutes"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                type="number"
                min="0"
              />
              <Button type="button" onClick={handleAddReminderTime} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {reminderTimes.map((minutes) => (
                <Badge key={minutes} variant="secondary" className="flex items-center gap-1">
                  {formatReminderTime(minutes)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveReminderTime(minutes)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Send to Support */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-to-support"
              checked={sendToSupport}
              onCheckedChange={(checked) => setSendToSupport(checked === true)}
            />
            <Label htmlFor="send-to-support">Send to Support</Label>
          </div>

          {/* Subject (Email only) */}
          {type === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
          )}

          {/* Message Body */}
          <div className="space-y-3">
            <Label htmlFor="message-body">Message Body</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-muted-foreground mr-2">Insert placeholders:</span>
                {PLACEHOLDER_OPTIONS.map((placeholder) => (
                  <Button
                    key={placeholder}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => handleInsertPlaceholder(placeholder)}
                  >
                    {placeholder}
                  </Button>
                ))}
              </div>
              <Textarea
                id="message-body"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Enter message body"
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
