
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { NotificationEvent, RECEIVER_ROLES } from '@/types/notification';
import { hasPermission } from '@/utils/checkPermission';

interface NotificationTableProps {
  events: NotificationEvent[];
  type: 'email' | 'whatsapp';
  onEdit: (event: NotificationEvent, type: 'email' | 'whatsapp') => void;
  onToggle: (eventId: string, type: 'email' | 'whatsapp', enabled: boolean) => void;
}

export function NotificationTable({ events, type, onEdit, onToggle }: NotificationTableProps) {
  const getReceiverLabels = (receivers: string[]) => {
    return receivers.map(receiver => {
      const role = RECEIVER_ROLES.find(r => r.value === receiver);
      return role?.label || receiver;
    }).join(', ');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead className="w-[300px]">Event</TableHead>
            <TableHead>Receiver</TableHead>
            <TableHead className="text-right">Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const config = type === 'email' ? event.emailConfig : event.whatsappConfig;
            const enabled = type === 'email' ? event.emailEnabled : event.whatsappEnabled;

            return (
              <TableRow key={`${event.id}-${type}`}>
                <TableCell>
                  <div>
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-muted-foreground">{event.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {config.receivers?.length > 0 ? (
                      config.receivers.map((receiver) => {
                        const role = RECEIVER_ROLES.find(r => r.value === receiver);
                        return (
                          <Badge key={receiver} variant="outline" className="text-xs">
                            {role?.label || receiver}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No receivers</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {hasPermission("HAS_EDIT_NOTIFICATION_SETTING") && <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event, type)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>}
                    {
                      hasPermission("HAS_EDIT_NOTIFICATION_SETTING") && <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => onToggle(event.id, type, checked)}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    }
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
