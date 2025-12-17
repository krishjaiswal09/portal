
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationTable } from './NotificationTable';
import { NotificationEditModal } from './NotificationEditModal';
import { NotificationEvent, NotificationConfig } from '@/types/notification';
import { Mail, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { toast } from 'sonner';

interface NotificationTemplate {
  id: number;
  template_type: 'email' | 'whatsapp';
  subject: string;
  template_content: string;
  placeholders: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationSetting {
  event_id: number;
  event_name: string;
  event_display_name: string;
  supports_scheduling: boolean;
  event_is_active: boolean;
  enabled_recipients: string[];
  send_to_support: boolean;
  schedule_options: any;
  settings_id: number;
  created_at: string;
  updated_at: string;
  enabled: boolean;
  template: NotificationTemplate;
}

interface NotificationSettingsResponse {
  email: NotificationSetting[];
  whatsapp: NotificationSetting[];
}

export function NotificationSettingsContent() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<NotificationEvent | null>(null);
  const [selectedType, setSelectedType] = useState<'email' | 'whatsapp'>('email');
  const queryClient = useQueryClient();

  const { data: notificationSettings, isLoading } = useQuery<NotificationSettingsResponse>({
    queryKey: ['notification-settings'],
    queryFn: () => fetchApi({
      path: 'notifications/settings',
    }),
  });

  const toggleNotificationMutation = useMutation({
    mutationFn: ({ eventId, type }: { eventId: number; type: 'email' | 'whatsapp' }) =>
      fetchApi({
        path: `notifications/events/${eventId}/${type}/toggle`,
        method: 'POST',
      }),
    onSuccess: (data, variables) => {
      const message = variables.type === 'email'
        ? 'Email notifications toggled successfully!'
        : 'WhatsApp notifications toggled successfully!';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
    onError: () => {
      toast.error('Failed to toggle notification');
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, data }: { eventId: number; data: any }) =>
      fetchApi({
        path: `notifications/events/${eventId}`,
        method: 'PATCH',
        data,
      }),
    onSuccess: () => {
      toast.success('Event details updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
    onError: () => {
      toast.error('Failed to update event details');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ settingsId, data }: { settingsId: number; data: any }) =>
      fetchApi({
        path: `notifications/settings/${settingsId}`,
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      toast.success('Notification settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
    onError: () => {
      toast.error('Failed to update notification settings');
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ templateId, data }: { templateId: number; data: any }) =>
      fetchApi({
        path: `notifications/templates/${templateId}`,
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      toast.success('Template updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
    onError: () => {
      toast.error('Failed to update template');
    },
  });

  const transformSettingsToEvents = (settings: NotificationSettingsResponse): NotificationEvent[] => {
    if (!settings) return [];

    const eventMap = new Map<string, NotificationEvent>();

    // Process email settings
    settings.email?.forEach(setting => {
      const eventKey = setting.event_name;
      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, {
          id: eventKey,
          name: setting.event_display_name,
          description: `Notifications for ${setting.event_display_name.toLowerCase()}`,
          emailEnabled: false,
          whatsappEnabled: false,
          emailConfig: null,
          whatsappConfig: null,
        });
      }

      const event = eventMap.get(eventKey)!;
      event.emailEnabled = setting.enabled;
      event.emailConfig = {
        receivers: setting.enabled_recipients as any[],
        reminderTimes: setting.schedule_options?.map(v => v.value) || [],
        sendToSupport: setting.send_to_support,
        subject: setting.template.subject,
        messageBody: setting.template.template_content,
      };
    });

    // Process whatsapp settings
    settings.whatsapp?.forEach(setting => {
      const eventKey = setting.event_name;
      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, {
          id: eventKey,
          name: setting.event_display_name,
          description: `Notifications for ${setting.event_display_name.toLowerCase()}`,
          emailEnabled: false,
          whatsappEnabled: false,
          emailConfig: null,
          whatsappConfig: null,
        });
      }

      const event = eventMap.get(eventKey)!;
      event.whatsappEnabled = setting.enabled;
      event.whatsappConfig = {
        receivers: setting.enabled_recipients as any[],
        reminderTimes: setting.schedule_options?.map(v => v.value) || [],
        sendToSupport: setting.send_to_support,
        messageBody: setting.template.template_content,
      };
    });

    return Array.from(eventMap.values());
  };

  const events = transformSettingsToEvents(notificationSettings || { email: [], whatsapp: [] });

  const handleEditEvent = (event: NotificationEvent, type: 'email' | 'whatsapp') => {
    setSelectedEvent(event);
    setSelectedType(type);
    setEditModalOpen(true);
  };

  const handleToggleEvent = (eventId: string, type: 'email' | 'whatsapp', enabled: boolean) => {
    const setting = notificationSettings?.[type]?.find(s => s.event_name === eventId);
    if (!setting) return;

    toggleNotificationMutation.mutate({
      eventId: setting.event_id,
      type,
    });
  };

  const handleSaveConfig = (config: NotificationConfig) => {
    if (!selectedEvent) return;

    const setting = notificationSettings?.[selectedType]?.find(s => s.event_name === selectedEvent.id);
    if (!setting) return;

    const scheduleOptions = config.reminderTimes.map(minutes => {
      if (minutes >= 60) {
        const hours = minutes / 60;
        return {
          value: hours,
          unit: 'hours',
          label: `${hours} ${hours === 1 ? 'hour' : 'hours'} before class`
        };
      } else {
        return {
          value: minutes,
          unit: 'minutes',
          label: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} before class`
        };
      }
    });

    // Update settings
    updateSettingsMutation.mutate({
      settingsId: setting.settings_id,
      data: {
        enabled_recipients: config.receivers,
        schedule_options: scheduleOptions,
      },
    });

    // Update template content if messageBody is provided
    if (config.messageBody && setting.template) {
      updateTemplateMutation.mutate({
        templateId: setting.template.id,
        data: {
          template_content: config.messageBody,
        },
      });
    }

    setEditModalOpen(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading notification settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <NotificationTable
            events={events}
            type="email"
            onEdit={handleEditEvent}
            onToggle={handleToggleEvent}
          />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <NotificationTable
            events={events}
            type="whatsapp"
            onEdit={handleEditEvent}
            onToggle={handleToggleEvent}
          />
        </TabsContent>
      </Tabs>

      <NotificationEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        event={selectedEvent}
        type={selectedType}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
