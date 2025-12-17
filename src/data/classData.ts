
import { Class, ClassCategory, ClassType, ClassStatus } from "@/types/class";

export const mockClasses: Class[] = [
  // Current week classes - January 2025
  {
    id: "1",
    title: "Bharatanatyam Fundamentals",
    instructor: "Priya Sharma",
    category: ClassCategory.DANCE,
    type: ClassType.GROUP,
    startDate: "2025-01-13", // Monday
    startTime: "10:00",
    duration: 60,
    maxStudents: 12,
    enrolledStudents: 8,
    status: ClassStatus.SCHEDULED,
    notes: "Focus on basic postures and hand gestures",
    classCode: "CL-2025-001",
    students: ["Aarav Sharma"]
  },
  {
    id: "2",
    title: "Hindustani Vocal - Beginner",
    instructor: "Ravi Kumar",
    category: ClassCategory.VOCAL,
    type: ClassType.GROUP,
    startDate: "2025-01-13", // Monday
    startTime: "14:00",
    duration: 60,
    maxStudents: 8,
    enrolledStudents: 6,
    status: ClassStatus.SCHEDULED,
    notes: "Introduction to ragas and basic scales",
    classCode: "CL-2025-002",
    students: ["Priya Patel"]
  },
  {
    id: "3",
    title: "Sitar Private Lesson",
    instructor: "Amit Patel",
    category: ClassCategory.INSTRUMENT,
    type: ClassType.PRIVATE,
    startDate: "2025-01-14", // Tuesday
    startTime: "16:30",
    duration: 40,
    maxStudents: 1,
    enrolledStudents: 1,
    status: ClassStatus.ONGOING,
    notes: "Advanced techniques and improvisation",
    classCode: "CL-2025-003",
    students: ["Ravi Kumar"]
  },
  {
    id: "4",
    title: "Kathak Intermediate",
    instructor: "Meera Singh",
    category: ClassCategory.DANCE,
    type: ClassType.GROUP,
    startDate: "2025-01-14", // Tuesday
    startTime: "11:00",
    duration: 60,
    maxStudents: 10,
    enrolledStudents: 7,
    status: ClassStatus.SCHEDULED,
    notes: "Intermediate Kathak techniques",
    classCode: "CL-2025-004",
    students: ["Sneha Reddy"]
  },
  {
    id: "5",
    title: "Tabla Beginners",
    instructor: "Rajesh Gupta",
    category: ClassCategory.INSTRUMENT,
    type: ClassType.GROUP,
    startDate: "2025-01-15", // Wednesday
    startTime: "09:00",
    duration: 60,
    maxStudents: 8,
    enrolledStudents: 5,
    status: ClassStatus.SCHEDULED,
    notes: "Basic tabla rhythms and techniques",
    classCode: "CL-2025-005",
    students: ["Vikram Singh"]
  },
  {
    id: "6",
    title: "Carnatic Vocal Advanced",
    instructor: "Ravi Kumar",
    category: ClassCategory.VOCAL,
    type: ClassType.GROUP,
    startDate: "2025-01-15", // Wednesday
    startTime: "15:30",
    duration: 60,
    maxStudents: 10,
    enrolledStudents: 8,
    status: ClassStatus.SCHEDULED,
    notes: "Advanced compositions and improvisation",
    classCode: "CL-2025-006",
    students: ["Ananya Joshi"]
  },
  {
    id: "7",
    title: "Violin Basics",
    instructor: "Amit Patel",
    category: ClassCategory.INSTRUMENT,
    type: ClassType.PRIVATE,
    startDate: "2025-01-16", // Thursday
    startTime: "10:30",
    duration: 60,
    maxStudents: 1,
    enrolledStudents: 1,
    status: ClassStatus.SCHEDULED,
    notes: "Introduction to violin fundamentals",
    classCode: "CL-2025-007",
    students: ["Kiran Patel"]
  },
  {
    id: "8",
    title: "Contemporary Dance",
    instructor: "Priya Sharma",
    category: ClassCategory.DANCE,
    type: ClassType.GROUP,
    startDate: "2025-01-16", // Thursday
    startTime: "18:00",
    duration: 60,
    maxStudents: 15,
    enrolledStudents: 12,
    status: ClassStatus.SCHEDULED,
    notes: "Modern contemporary dance techniques",
    classCode: "CL-2025-008",
    students: ["Aditi Sharma"]
  },
  {
    id: "9",
    title: "Flute Intermediate",
    instructor: "Rajesh Gupta",
    category: ClassCategory.INSTRUMENT,
    type: ClassType.PRIVATE,
    startDate: "2025-01-17", // Friday
    startTime: "11:00",
    duration: 40,
    maxStudents: 1,
    enrolledStudents: 1,
    status: ClassStatus.SCHEDULED,
    notes: "Intermediate flute techniques and melodies",
    classCode: "CL-2025-009",
    students: ["Rohan Mehta"]
  },
  {
    id: "10",
    title: "Bharatanatyam Private",
    instructor: "Meera Singh",
    category: ClassCategory.DANCE,
    type: ClassType.PRIVATE,
    startDate: "2025-01-17", // Friday
    startTime: "16:00",
    duration: 60,
    maxStudents: 1,
    enrolledStudents: 1,
    status: ClassStatus.SCHEDULED,
    notes: "Advanced Bharatanatyam for experienced student",
    classCode: "CL-2025-010",
    students: ["Kavya Nair"]
  },
  // Next week classes
  {
    id: "11",
    title: "Bharatanatyam Fundamentals",
    instructor: "Priya Sharma",
    category: ClassCategory.DANCE,
    type: ClassType.GROUP,
    startDate: "2025-01-20", // Monday
    startTime: "10:00",
    duration: 60,
    maxStudents: 12,
    enrolledStudents: 8,
    status: ClassStatus.SCHEDULED,
    notes: "Continuing basic postures and hand gestures",
    classCode: "CL-2025-011",
    students: ["Arjun Gupta"]
  },
  {
    id: "12",
    title: "Hindustani Vocal - Beginner",
    instructor: "Ravi Kumar",
    category: ClassCategory.VOCAL,
    type: ClassType.GROUP,
    startDate: "2025-01-20", // Monday
    startTime: "14:00",
    duration: 60,
    maxStudents: 8,
    enrolledStudents: 6,
    status: ClassStatus.SCHEDULED,
    notes: "Continuing ragas and basic scales",
    classCode: "CL-2025-012",
    students: ["Ishika Rao"]
  },
  // Weekend classes
  {
    id: "13",
    title: "Weekend Kathak Workshop",
    instructor: "Meera Singh",
    category: ClassCategory.DANCE,
    type: ClassType.GROUP,
    startDate: "2025-01-18", // Saturday
    startTime: "14:00",
    duration: 60,
    maxStudents: 20,
    enrolledStudents: 15,
    status: ClassStatus.SCHEDULED,
    notes: "Intensive Kathak workshop for all levels",
    classCode: "CL-2025-013",
    students: ["Dev Sharma"]
  },
  {
    id: "14",
    title: "Sunday Vocal Recital",
    instructor: "Ravi Kumar",
    category: ClassCategory.VOCAL,
    type: ClassType.GROUP,
    startDate: "2025-01-19", // Sunday
    startTime: "16:00",
    duration: 60,
    maxStudents: 25,
    enrolledStudents: 18,
    status: ClassStatus.SCHEDULED,
    notes: "Student performance and practice session",
    classCode: "CL-2025-014",
    students: ["Nisha Singh"]
  }
];

export const instructors = [
  "Priya Sharma",
  "Ravi Kumar", 
  "Amit Patel",
  "Meera Singh",
  "Rajesh Gupta"
];
