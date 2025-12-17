
import { Group } from "@/types/group";

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Beginner Dancers",
    description: "Students new to classical dance",
    members: ["1", "2", "3", "4", "5"],
    teacherId: "t1",
    teacherName: "Priya Sharma",
    createdDate: "2025-01-10",
    updatedDate: "2025-01-15",
    status: "active"
  },
  {
    id: "2", 
    name: "Advanced Vocalists",
    description: "Experienced vocal students",
    members: ["6", "7", "8", "9"],
    teacherId: "t2",
    teacherName: "Ravi Kumar",
    createdDate: "2025-01-08",
    updatedDate: "2025-01-12",
    status: "active"
  },
  {
    id: "3",
    name: "Instrument Masters",
    description: "Multi-instrument learning group",
    members: ["10", "11", "12"],
    teacherId: "t3", 
    teacherName: "Amit Patel",
    createdDate: "2025-01-05",
    updatedDate: "2025-01-14",
    status: "active"
  }
];

export const mockTeachers = [
  { id: "t1", name: "Priya Sharma", subject: "Dance" },
  { id: "t2", name: "Ravi Kumar", subject: "Vocal" },
  { id: "t3", name: "Amit Patel", subject: "Instruments" },
  { id: "t4", name: "Meera Singh", subject: "Dance" },
  { id: "t5", name: "Rajesh Gupta", subject: "Instruments" }
];
