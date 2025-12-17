
// ILT Report Types
export interface ILTReportData {
  id: string;
  courseName: string;
  instructorName: string;
  studentNames: string[];
  classDate: string;
  classTime: string;
  attendance: string;
  deliveryMode: 'online' | 'offline';
  status: 'scheduled' | 'completed' | 'cancelled';
  details: {
    course: string;
    dateTime: string;
    instructor: string;
    instructorAide?: string;
    recordingAvailable: boolean;
    notes: string;
    learners: {
      name: string;
      attendance: boolean;
      joinTime?: string;
      instructorRating?: {
        audio: number;
        video: number;
      };
    }[];
  };
}

// Online Class Recordings Report Types
export interface RecordingReportData {
  id: string;
  classDate: string;
  classStartTime: string;
  instructorName: string;
  courseName: string;
  studentNames: string[];
  recordingStartTime?: string;
  recordingDuration?: string;
  recordingDetails?: {
    url: string;
    classTime: string;
    meetingId: string;
    password: string;
  };
  status: 'completed' | 'cancelled';
}

// Class Credit Report Types
export interface ClassCreditReportData {
  id: string;
  studentName: string;
  courseName: string;
  startDate: string;
  classesPurchased: number;
  classesCharged: number;
  classBalance: number;
  status: 'paid' | 'overdue';
  dueDate: string;
  lastPaymentDate: string;
  transactions: {
    id: string;
    date: string;
    numberOfClasses: number;
    amountPaid: number;
    comment: string;
  }[];
  scheduledClasses: {
    id: string;
    dateTime: string;
    attendance: boolean;
    creditUsed: boolean;
  }[];
}

// Reserved Slot Report Types
export interface ReservedSlotData {
  id: string;
  studentId: string;
  studentName: string;
  instructorId: string;
  instructorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
  upcomingHolds: number;
  lastAttendedDate?: string;
  status: 'Active' | 'Released' | 'Expired';
  createdAt: string;
  releasedBy?: string;
  releaseReason?: string;
}

export interface ReservedSlotFilters {
  instructor?: string;
  student?: string;
  dayOfWeek?: string;
  status?: 'all' | 'Active' | 'Released' | 'Expired';
  searchTerm?: string;
}

export interface ReportFilters {
  deliveryMode?: 'all' | 'online' | 'offline';
  course?: string;
  instructor?: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  studentName?: string;
  datePreset?: 'today' | 'thisWeek' | 'last7Days' | 'custom';
  ignoreCancelled?: boolean;
}