
export interface Instructor {
  id: string
  // Personal Information
  fullName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender: 'Male' | 'Female' | 'Other'
  country: string
  state?: string
  city?: string
  timezone: string
  bio?: string
  avatar?: string

  // Professional Details
  languagesKnown: string[]
  artForms: string[]
  certifications: string[]
  comfortableAgeGroups: AgeGroup[]

  // Account Status
  status: 'Active' | 'Inactive'
  username?: string

  // Teaching Info
  rating?: number
  totalStudents?: number
  totalClasses?: number

  // New Toggle Fields
  canAssignDemos: boolean
  canTransferStudents: boolean
  kidFriendly: boolean

  // System fields
  createdAt: string
  updatedAt: string
}

export type AgeGroup =
  | '9 yrs and younger'
  | '10 yrs to 20 yrs'
  | '21 yrs to 35 yrs'
  | '36 yrs and older'

export interface WorkingHours {
  id: string
  instructorId: string
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  id: string
  startTime: string // "10:00"
  endTime: string   // "12:00"
  isActive: boolean
}

export interface InstructorAvailability {
  id: string
  instructorId: string
  date: string // "2024-01-15"
  timeSlots: string[] // ["09:00", "10:30", "14:00"]
  duration: 10 | 20 | 30 | 40 | 50 | 60 // minutes
  timezone: string
}

export interface InstructorVacation {
  id: string
  instructorId: string
  instructorName: string
  startDate: string
  endDate: string
  reason?: string
  status: 'Pending' | 'Approved' | 'Cancelled'
  impactedClasses: ImpactedClass[]
  createdAt: string
}

export interface ImpactedClass {
  id: string
  title: string
  studentGroup: string
  groupName: string
  studentName: string // Added student name for better display
  dateTime: string
  duration: number
}

// Filter types for Manage Instructor page
export interface InstructorFilters {
  search: string
  artForms: string[]
  countries?: string[]
  status: 'all' | 'active' | 'inactive'
  languages: string[]
  kidFriendly: 'all' | 'yes' | 'no'
  gender: 'all' | 'Male' | 'Female' | 'Other'
  certifications: string[]
}

export interface PayrollAssignment {
  id: string
  instructorId: string
  groupType: 'individual' | 'group'
  classType: any
  defaultAmount: number
  createdAt: string
  updatedAt: string
}
