
import { Student, StudentLevel, StudentStatus } from "@/types/student";

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1-234-567-8901",
    level: StudentLevel.BEGINNER,
    categories: ["Dance", "Vocal"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-01-15",
    courseBadges: ["Dance Beginner", "Vocal Foundation"],
    totalSessions: 20,
    attendedSessions: 18,
    completionPercentage: 65
  },
  {
    id: "2", 
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1-234-567-8902",
    level: StudentLevel.INTERMEDIATE,
    categories: ["Instrument"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-02-10",
    courseBadges: ["Piano Intermediate"],
    totalSessions: 24,
    attendedSessions: 22,
    completionPercentage: 78
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com", 
    phone: "+1-234-567-8903",
    level: StudentLevel.ADVANCED,
    categories: ["Dance", "Vocal", "Instrument"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2023-11-20",
    courseBadges: ["Dance Advanced", "Vocal Mastery", "Guitar Expert"],
    totalSessions: 48,
    attendedSessions: 46,
    completionPercentage: 92
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1-234-567-8904", 
    level: StudentLevel.INTERMEDIATE,
    categories: ["Dance"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-03-05",
    courseBadges: ["Contemporary Dance"],
    totalSessions: 16,
    attendedSessions: 14,
    completionPercentage: 55
  },
  {
    id: "5",
    name: "Emma Brown",
    email: "emma@example.com",
    phone: "+1-234-567-8905",
    level: StudentLevel.BEGINNER,
    categories: ["Vocal"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-04-12",
    courseBadges: ["Vocal Basics"],
    totalSessions: 12,
    attendedSessions: 10,
    completionPercentage: 40
  },
  {
    id: "john-doe",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-234-567-8906",
    level: StudentLevel.INTERMEDIATE,
    categories: ["Dance"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-01-10",
    courseBadges: ["Hip Hop Intermediate"],
    totalSessions: 20,
    attendedSessions: 19,
    completionPercentage: 70
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1-234-567-8907",
    level: StudentLevel.ADVANCED,
    categories: ["Vocal", "Instrument"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-02-15",
    courseBadges: ["Opera Vocal", "Violin Advanced"],
    totalSessions: 36,
    attendedSessions: 34,
    completionPercentage: 85
  },
  {
    id: "emma-johnson",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "+1-234-567-8908",
    level: StudentLevel.BEGINNER,
    categories: ["Dance", "Vocal"],
    status: StudentStatus.ACTIVE,
    enrollmentDate: "2024-03-01",
    courseBadges: ["Ballet Foundation", "Classical Vocal"],
    totalSessions: 14,
    attendedSessions: 12,
    completionPercentage: 45
  }
];

export const coursesData = [
  { id: "1", name: "Classical Ballet Fundamentals", category: "Dance" },
  { id: "2", name: "Contemporary Dance", category: "Dance" },
  { id: "3", name: "Hip Hop Basics", category: "Dance" },
  { id: "4", name: "Vocal Techniques", category: "Vocal" },
  { id: "5", name: "Opera Singing", category: "Vocal" },
  { id: "6", name: "Piano Fundamentals", category: "Instrument" },
  { id: "7", name: "Guitar Basics", category: "Instrument" },
  { id: "8", name: "Violin Intermediate", category: "Instrument" }
];
