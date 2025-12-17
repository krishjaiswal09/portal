
export interface TimelineReportData {
  id: string;
  eventDescription: string;
  timestamp: string;
  performedBy: string;
  performedByEmail: string;
  eventType: string;
  category: 'login' | 'class' | 'course' | 'admin' | 'system' | 'payment';
  severity: 'info' | 'success' | 'warning' | 'error';
  courseName?: string;
  className?: string;
  actionButton?: {
    label: string;
    action: string;
  };
  metadata?: {
    [key: string]: any;
  };
}

export const eventTypeOptions = [
  { value: 'all', label: 'All Events' },
  
  // Authentication Events
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'password_reset', label: 'Password Reset Request' },
  { value: 'password_change', label: 'Password Changed' },
  
  // Class Events
  { value: 'join_class', label: 'Join Class' },
  { value: 'leave_class', label: 'Leave Class' },
  { value: 'class_started', label: 'Class Started' },
  { value: 'class_ended', label: 'Class Ended' },
  { value: 'class_cancelled', label: 'Class Cancelled' },
  { value: 'class_rescheduled', label: 'Class Rescheduled' },
  { value: 'class_created', label: 'Class Created' },
  
  // Course Events
  { value: 'course_enrolled', label: 'Course Enrolled' },
  { value: 'course_completed', label: 'Course Completed' },
  { value: 'course_created', label: 'Course Created' },
  { value: 'course_updated', label: 'Course Updated' },
  
  // Student Events
  { value: 'student_added', label: 'Student Added to Class' },
  { value: 'student_removed', label: 'Student Removed from Class' },
  { value: 'assignment_submitted', label: 'Assignment Submitted' },
  { value: 'feedback_given', label: 'Feedback Given' },
  
  // Recording Events
  { value: 'recording_viewed', label: 'Recording Viewed' },
  { value: 'recording_downloaded', label: 'Recording Downloaded' },
  
  // Payment Events
  { value: 'payment_made', label: 'Payment Made' },
  { value: 'credit_purchased', label: 'Credit Purchased' },
  { value: 'refund_processed', label: 'Refund Processed' },
  
  // Admin Events
  { value: 'user_created', label: 'User Created' },
  { value: 'user_updated', label: 'User Updated' },
  { value: 'user_deleted', label: 'User Deleted' },
  { value: 'settings_changed', label: 'Settings Changed' },
];

export const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'student', label: 'Student' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'parent', label: 'Parent' },
  { value: 'admin', label: 'Admin' },
  { value: 'support', label: 'Support Staff' },
];

export const mockTimelineData: TimelineReportData[] = [
  {
    id: '1',
    eventDescription: 'Megha Shinde has joined the class 26 Jun 2025, 08:00 AM – 08:30 AM(IST)',
    timestamp: '2025-06-26T08:00:00Z',
    performedBy: 'Megha Shinde',
    performedByEmail: 'megha.shinde@example.com',
    eventType: 'join_class',
    category: 'class',
    severity: 'success',
    courseName: 'Bharatanatyam Beginner',
    className: 'Morning Session',
    actionButton: {
      label: 'Join Class',
      action: 'join_class'
    }
  },
  {
    id: '2',
    eventDescription: 'Admin created new course: Advanced Kuchipudi Techniques',
    timestamp: '2025-06-26T07:45:00Z',
    performedBy: 'Admin User',
    performedByEmail: 'admin@artgharana.com',
    eventType: 'course_created',
    category: 'course',
    severity: 'info',
    courseName: 'Advanced Kuchipudi Techniques'
  },
  {
    id: '3',
    eventDescription: 'Arjun Patel requested password reset',
    timestamp: '2025-06-26T07:30:00Z',
    performedBy: 'Arjun Patel',
    performedByEmail: 'arjun.patel@example.com',
    eventType: 'password_reset',
    category: 'login',
    severity: 'warning',
    actionButton: {
      label: 'Password Reset',
      action: 'password_reset'
    }
  },
  {
    id: '4',
    eventDescription: 'Ms. Priya Sharma cancelled class due to technical issues',
    timestamp: '2025-06-26T07:15:00Z',
    performedBy: 'Ms. Priya Sharma',
    performedByEmail: 'priya.sharma@artgharana.com',
    eventType: 'class_cancelled',
    category: 'class',
    severity: 'error',
    courseName: 'Classical Dance',
    actionButton: {
      label: 'Cancel Class',
      action: 'cancel_class'
    }
  },
  {
    id: '5',
    eventDescription: 'Kavya Singh purchased 10 class credits for ₹2,500',
    timestamp: '2025-06-26T06:45:00Z',
    performedBy: 'Kavya Singh',
    performedByEmail: 'kavya.singh@example.com',
    eventType: 'credit_purchased',
    category: 'payment',
    severity: 'success',
    metadata: {
      amount: 2500,
      credits: 10
    }
  },
  {
    id: '6',
    eventDescription: 'Ravi Kumar logged into the system',
    timestamp: '2025-06-26T06:30:00Z',
    performedBy: 'Ravi Kumar',
    performedByEmail: 'ravi.kumar@example.com',
    eventType: 'login',
    category: 'login',
    severity: 'info'
  },
  {
    id: '7',
    eventDescription: 'Sneha Reddy viewed recording: Carnatic Music Fundamentals - Session 1',
    timestamp: '2025-06-26T06:00:00Z',
    performedBy: 'Sneha Reddy',
    performedByEmail: 'sneha.reddy@example.com',
    eventType: 'recording_viewed',
    category: 'class',
    severity: 'info',
    courseName: 'Carnatic Music Fundamentals'
  },
  {
    id: '8',
    eventDescription: 'Ustad Rahman started class: Hindustani Classical Music - Advanced',
    timestamp: '2025-06-26T05:30:00Z',
    performedBy: 'Ustad Rahman',
    performedByEmail: 'ustad.rahman@artgharana.com',
    eventType: 'class_started',
    category: 'class',
    severity: 'success',
    courseName: 'Hindustani Classical Music'
  }
];

export const courseOptionsForTimeline = [
  { value: 'all', label: 'All Courses' },
  { value: 'bharatanatyam-beginner', label: 'ABB – Bharatanatyam Beginner Course' },
  { value: 'kuchipudi-advanced', label: 'AKA – Advanced Kuchipudi Techniques' },
  { value: 'classical-dance', label: 'CD – Classical Dance' },
  { value: 'hindustani-classical', label: 'HCM – Hindustani Classical Music' },
  { value: 'carnatic-music', label: 'CMF – Carnatic Music Fundamentals' },
];
