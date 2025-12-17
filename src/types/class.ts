
import { TimeSlot, ConferenceDetails } from "./student";

export interface Class {
  id: string;
  title: string;
  instructor: string;
  category: ClassCategory;
  type: ClassType;
  course?: string;
  startDate: string;
  startTime: string;
  duration: number; // in minutes
  maxStudents: number;
  enrolledStudents: number;
  status: ClassStatus;
  notes?: string;
  classCode: string;
  students?: string[]; // student IDs
  additionalInstructors?: string[];
  timeSlots?: TimeSlot[];
  conference?: ConferenceDetails;
  location?: string;
}

export enum ClassCategory {
  DANCE = "Dance",
  VOCAL = "Vocal", 
  INSTRUMENT = "Instrument"
}

export enum ClassType {
  PRIVATE = "Private",
  GROUP = "Group",
  TRIAL = "Trial"
}

export enum ClassStatus {
  SCHEDULED = "Scheduled",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export interface ClassFilters {
  search: string;
  instructor: string;
  category: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
}
