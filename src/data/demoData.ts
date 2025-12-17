
export interface Demo {
  id: string;
  date: string;
  demoType: "Group" | "Private" | "One-on-One";
  startTime: string;
  endTime?: string;
  studentNames: string[];
  instructor: string;
  artForm: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
  notes?: string;
  attendanceMarked?: boolean;
  recordingUrl?: string;
}

export const mockDemos: Demo[] = [
  {
    id: "1",
    date: "2024-01-15",
    demoType: "Private",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    studentNames: ["Sarah Johnson"],
    instructor: "Priya Sharma",
    artForm: "Piano",
    status: "Scheduled",
    notes: "Beginner level demo session",
    attendanceMarked: false,
  },
  {
    id: "2",
    date: "2024-01-16",
    demoType: "Group",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    studentNames: ["Mike Chen", "Lisa Wong", "David Kim"],
    instructor: "Ravi Kumar",
    artForm: "Classical Dance",
    status: "Scheduled",
    notes: "Introduction to classical dance forms",
    attendanceMarked: false,
  },
  {
    id: "3",
    date: "2024-01-17",
    demoType: "One-on-One",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    studentNames: ["Emma Davis"],
    instructor: "Anjali Patel",
    artForm: "Guitar",
    status: "Completed",
    notes: "Acoustic guitar basics covered",
    attendanceMarked: true,
    recordingUrl: "https://example.com/recording1",
  },
  {
    id: "4",
    date: "2024-01-18",
    demoType: "Group",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    studentNames: ["John Smith", "Alice Brown"],
    instructor: "Kavya Reddy",
    artForm: "Vocal Music",
    status: "Rescheduled",
    notes: "Rescheduled due to instructor availability",
    attendanceMarked: false,
  },
  {
    id: "5",
    date: "2024-01-19",
    demoType: "Private",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    studentNames: ["Robert Wilson"],
    instructor: "Meera Joshi",
    artForm: "Violin",
    status: "Cancelled",
    notes: "Cancelled by student request",
    attendanceMarked: false,
  },
];
