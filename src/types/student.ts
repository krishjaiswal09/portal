
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: StudentLevel;
  categories: string[];
  status: StudentStatus;
  enrollmentDate: string;
  avatar?: string;
  courseBadges: string[];
  totalSessions: number;
  attendedSessions: number;
  completionPercentage: number;
}

export enum StudentLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate", 
  ADVANCED = "Advanced"
}

export enum StudentStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  GRADUATED = "Graduated"
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isReserved: boolean;
}

export interface ConferenceDetails {
  platform: string;
  meetingId: string;
  password?: string;
  joinUrl: string;
}

export interface ClassSession {
  id: string;
  subject: string;
  teacher: string;
  teacherPhoto?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'live' | 'upcoming' | 'completed' | 'cancelled';
  isJoinable: boolean;
  hasRecording: boolean;
  hasMaterials: boolean;
  feedbackGiven: boolean;
  attendanceStatus: 'attended' | 'missed' | 'cancelled';
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  subject: string;
  teacher: string;
  totalSessions: number;
  completedSessions: number;
  progressPercentage: number;
  status: 'active' | 'completed' | 'paused';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  type: 'assignment' | 'notes' | 'video' | 'link';
  uploadDate: string;
  dueDate?: string;
  status: 'pending' | 'submitted' | 'reviewed';
  fileUrl?: string;
  description?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'event';
  date: string;
  isRead: boolean;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  status: 'upcoming' | 'registered' | 'closed';
  canSubmitPerformance: boolean;
  hasSubmitted: boolean;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed';
  score?: number;
  maxScore?: number;
  teacherRemarks?: string;
}

export interface Certificate {
  id: string;
  title: string;
  course: string;
  issueDate: string;
  certificateUrl: string;
}
