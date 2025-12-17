
export interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  emailConfig: NotificationConfig;
  whatsappConfig: NotificationConfig;
}

export interface NotificationConfig {
  receivers: ReceiverRole[];
  reminderTimes: number[]; // minutes before event
  sendToSupport: boolean;
  subject?: string; // only for email
  messageBody: string;
}

export type ReceiverRole = 'learner' | 'instructor' | 'support' | 'guest' | 'parent' | 'teacher';

export const RECEIVER_ROLES: { value: ReceiverRole; label: string }[] = [
  { value: 'learner', label: 'Learner' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'support', label: 'Support' },
  { value: 'guest', label: 'Guest' },
  { value: 'parent', label: 'Parent' },
];

export const PLACEHOLDER_OPTIONS = [
  '[first_name]',
  '[course_name]',
  '[account_name]',
  '[site_url]',
  '[date]',
  '[time]',
];
