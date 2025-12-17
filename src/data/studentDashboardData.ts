import { Facebook, Instagram, Youtube, Search, Users, MoreHorizontal } from "lucide-react"

// Enhanced Class Session Interface
export interface EnhancedClassSession {
  id: string
  subject: string
  time: string
  startTime: string
  endTime: string
  instructor: string
  teacher: string
  teacherPhoto: string
  type: 'individual' | 'group'
  status: 'upcoming' | 'completed' | 'cancelled' | 'scheduled'
  attendees?: number
  maxAttendees?: number
  feedbackGiven?: boolean
  date: string
  timezone: string
  duration: string
  courseTitle: string
  artFormTag: string
  attendanceStatus?: 'attended' | 'missed'
  hasRecording?: boolean
  recordingUrl?: string
  canJoin?: boolean
  class_recording?: string
  isJoinable?: boolean
  canReschedule: boolean
  canCancel: boolean
  reminderSet?: boolean
  classDescription?: string
  instructorNotes?: string
  hasMaterials?: boolean
  meetingLink?: string
  reschedule_reason_text?: string
  cancelation_reason_text?: string
}

// Mock data for student profile
export const mockStudent = {
  id: '1',
  name: 'Anika Sharma',
  email: 'anika.sharma@example.com',
  profileImage: '/placeholder-profile-image.jpg',
  credits: 50,
  level: 'Beginner',
  interests: ['Watercolor Painting', 'Classical Dance', 'Pottery'],
  lastLogin: '2 days ago',
  attendedSessions: 24,
  totalSessions: 30,
  courseBadges: [
    'Watercolor Beginner',
    'Perfect Attendance',
    'Early Bird',
    'Art Explorer'
  ]
}

// Mock data for credit balance
export const mockCreditBalance = {
  current: 50,
  lastUpdated: 'Yesterday',
  history: [
    { id: '1', date: '2023-08-01', description: 'Initial Credits', amount: 50 },
    { id: '2', date: '2023-08-15', description: 'Class Booking', amount: -5 },
    { id: '3', date: '2023-09-01', description: 'Referral Bonus', amount: 10 }
  ]
}

// Mock data for upcoming classes
export const mockUpcomingClasses = [
  {
    id: '1',
    subject: 'Watercolor Painting',
    time: '10:00 AM - 11:00 AM',
    instructor: 'Priya Sharma',
    type: 'individual' as const,
    status: 'scheduled' as const
  },
  {
    id: '2',
    subject: 'Classical Dance',
    time: '2:00 PM - 3:00 PM',
    instructor: 'Anjali Rao',
    type: 'group' as const,
    status: 'scheduled' as const,
    attendees: 8,
    maxAttendees: 10
  },
  {
    id: '3',
    subject: 'Pottery Basics',
    time: '4:00 PM - 5:00 PM',
    instructor: 'Arjun Patel',
    type: 'individual' as const,
    status: 'scheduled' as const
  }
]

// Mock data for recent class recordings
export const mockRecentRecordings = [
  {
    id: '1',
    subject: 'Advanced Watercolor Techniques',
    teacher: 'Priya Sharma',
    date: '2 days ago',
    url: '/recording1.mp4'
  },
  {
    id: '2',
    subject: 'Bollywood Dance Choreography',
    teacher: 'Vikram Kapoor',
    date: '1 week ago',
    url: '/recording2.mp4'
  }
]

// Fixed mock data for notifications with correct field names
export const mockNotifications = [
  {
    id: '1',
    title: 'New Class Scheduled',
    message: 'Your Watercolor Painting class with Priya Sharma is confirmed for tomorrow at 10:00 AM.',
    timestamp: '2024-01-14T16:00:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Referral Bonus',
    message: 'You received 10 credits for referring a friend!',
    timestamp: '2024-01-07T10:00:00Z',
    read: true
  },
  {
    id: '3',
    title: 'New Recording Available',
    message: 'The recording for Bollywood Dance Choreography is now available.',
    timestamp: '2024-01-01T14:00:00Z',
    read: true
  }
]

// Mock data for course progress with all required properties
export const mockCourseProgress = [
  {
    courseId: '1',
    courseName: 'Watercolor Painting for Beginners',
    progressPercentage: 75,
    completedSessions: 6,
    totalSessions: 8,
    status: 'active',
    teacher: 'Priya Sharma',
    subject: 'Watercolor Painting'
  },
  {
    courseId: '2',
    courseName: 'Classical Dance Fundamentals',
    progressPercentage: 50,
    completedSessions: 4,
    totalSessions: 8,
    status: 'active',
    teacher: 'Anjali Rao',
    subject: 'Classical Dance'
  }
]

// Mock data for admin banners
export const mockBannerData = [
  {
    id: '1',
    imageUrl: '/placeholder-banner.jpg',
    title: 'Welcome to the Art Gharana!',
    description: 'Explore our wide range of art classes and unleash your creativity.',
    ctaText: 'Explore Classes',
    ctaLink: '/classes'
  }
]

// Updated instructor interface
export interface Instructor {
  id: string
  name: string
  expertise: string
  specialization: string
  rating: number
  imageUrl: string
  description: string
  studentsCount: number
  experience: string
}

// Mock data for best instructors with all required properties
export const mockBestInstructors: Instructor[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    expertise: 'Watercolor Painting',
    specialization: 'Traditional Watercolor Techniques',
    rating: 4.9,
    imageUrl: '/placeholder-instructor1.jpg',
    description: 'Priya is a renowned watercolor artist with over 10 years of teaching experience.',
    studentsCount: 245,
    experience: '10+ years'
  },
  {
    id: '2',
    name: 'Vikram Kapoor',
    expertise: 'Bollywood Dance',
    specialization: 'Contemporary Bollywood',
    rating: 4.8,
    imageUrl: '/placeholder-instructor2.jpg',
    description: 'Vikram is a dynamic dance instructor specializing in Bollywood and contemporary styles.',
    studentsCount: 189,
    experience: '8+ years'
  }
]

// Mock data for featured courses
export const mockFeaturedCourses = [
  {
    id: '1',
    name: 'Guitar Fundamentals',
    category: 'Musical Instrument',
    image: '/lovable-uploads/31e03d8a-83a8-426e-b8f5-7f887066b1fe.png',
    rating: 4.8,
    students: 324,
    price: '₹3,499'
  },
  {
    id: '2',
    name: 'Piano Mastery',
    category: 'Musical Instrument',
    image: '/lovable-uploads/d6611337-cc02-4c75-aa6b-b072423de40d.png',
    rating: 4.9,
    students: 287,
    price: '₹4,999'
  },
  {
    id: '3',
    name: 'Bollywood Dance',
    category: 'Dance',
    image: '/lovable-uploads/31e03d8a-83a8-426e-b8f5-7f887066b1fe.png',
    rating: 4.7,
    students: 456,
    price: '₹2,999'
  },
  {
    id: '4',
    name: 'Kathak Classical Dance',
    category: 'Dance',
    image: '/lovable-uploads/d6611337-cc02-4c75-aa6b-b072423de40d.png',
    rating: 4.8,
    students: 198,
    price: '₹3,799'
  },
  {
    id: '5',
    name: 'Hindustani Vocals',
    category: 'Vocal',
    image: '/lovable-uploads/31e03d8a-83a8-426e-b8f5-7f887066b1fe.png',
    rating: 4.9,
    students: 267,
    price: '₹3,299'
  },
  {
    id: '6',
    name: 'Carnatic Vocals',
    category: 'Vocal',
    image: '/lovable-uploads/d6611337-cc02-4c75-aa6b-b072423de40d.png',
    rating: 4.8,
    students: 189,
    price: '₹3,599'
  },
  {
    id: '7',
    name: 'Bharatnatyam',
    category: 'Dance',
    image: '/lovable-uploads/31e03d8a-83a8-426e-b8f5-7f887066b1fe.png',
    rating: 4.9,
    students: 234,
    price: '₹4,199'
  }
]

// Enhanced mock data for today's classes with proper status alignment and instructor notes
export const mockTodaysClassesEnhanced: EnhancedClassSession[] = [
  {
    id: '1',
    subject: 'Watercolor Painting',
    time: '10:00 AM - 11:00 AM',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    instructor: 'Priya Sharma',
    teacher: 'Priya Sharma',
    teacherPhoto: '/placeholder-instructor1.jpg',
    type: 'individual',
    status: 'scheduled',
    feedbackGiven: false,
    date: new Date().toISOString(),
    timezone: 'IST',
    duration: '1 hour',
    courseTitle: 'Watercolor Painting for Beginners',
    artFormTag: 'Painting',
    attendanceStatus: 'attended',
    hasRecording: false,
    canJoin: true,
    canReschedule: true,
    canCancel: true,
    reminderSet: false
  },
  {
    id: '2',
    subject: 'Classical Dance',
    time: '2:00 PM - 3:00 PM',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    instructor: 'Anjali Rao',
    teacher: 'Anjali Rao',
    teacherPhoto: '/placeholder-instructor2.jpg',
    type: 'group',
    status: 'completed',
    attendees: 8,
    maxAttendees: 10,
    feedbackGiven: false,
    date: new Date().toISOString(),
    timezone: 'IST',
    duration: '1 hour',
    courseTitle: 'Classical Dance Fundamentals',
    artFormTag: 'Dance',
    attendanceStatus: 'attended',
    hasRecording: true,
    recordingUrl: '/recording1.mp4',
    canJoin: false,
    canReschedule: false,
    canCancel: false,
    reminderSet: false,
    instructorNotes: 'Great progress today! Student showed excellent understanding of basic steps. Focus on posture and hand movements in next class.'
  }
]

// Enhanced upcoming classes with proper status alignment and instructor notes
export const mockUpcomingClassesEnhanced: EnhancedClassSession[] = [
  {
    id: '3',
    subject: 'Oil Painting Basics',
    time: '11:00 AM - 12:00 PM',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    instructor: 'Rajesh Kumar',
    teacher: 'Rajesh Kumar',
    teacherPhoto: '/placeholder-instructor3.jpg',
    type: 'individual',
    status: 'scheduled',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    timezone: 'IST',
    duration: '1 hour',
    courseTitle: 'Oil Painting Masterclass',
    artFormTag: 'Painting',
    attendanceStatus: 'attended',
    hasRecording: false,
    canJoin: false,
    canReschedule: true,
    canCancel: true,
    reminderSet: false
  },
  {
    id: '4',
    subject: 'Digital Art Workshop',
    time: '3:00 PM - 4:30 PM',
    startTime: '3:00 PM',
    endTime: '4:30 PM',
    instructor: 'Neha Gupta',
    teacher: 'Neha Gupta',
    teacherPhoto: '/placeholder-instructor4.jpg',
    type: 'group',
    status: 'completed',
    attendees: 6,
    maxAttendees: 12,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: 'IST',
    duration: '1.5 hours',
    courseTitle: 'Digital Art Masterclass',
    artFormTag: 'Digital Art',
    attendanceStatus: 'attended',
    hasRecording: true,
    canJoin: false,
    canReschedule: false,
    canCancel: false,
    reminderSet: false,
    instructorNotes: 'Excellent work on digital brush techniques. Student is ready to move to advanced shading concepts. Keep practicing layer management.'
  }
]

// Mock enhanced classes for MyClasses page
export const mockEnhancedClasses: EnhancedClassSession[] = [
  ...mockTodaysClassesEnhanced,
  ...mockUpcomingClassesEnhanced
]

// Credits Management Data
export interface CreditSummary {
  used: number
  purchased: number
  free: number
  balance: number
}

export interface CreditTransaction {
  id: string
  date: string
  teacherName: string
  activity: string
  credit: number
  comments: string
  classType: string
}

export const mockCreditSummary: CreditSummary = {
  used: 45,
  purchased: 100,
  free: 10,
  balance: 65
}

// New interface for class-type-based credit summary
export interface ClassTypeCreditSummary {
  classType: string
  purchased: number
  used: number
  balance: number
}

// New mock data for class-type-based credit summary
export const mockClassTypeCreditSummary: ClassTypeCreditSummary[] = [
  {
    classType: 'PVT 40 Min',
    purchased: 20,
    used: 8,
    balance: 12
  },
  {
    classType: 'PVT 60 Min', 
    purchased: 50,
    used: 25,
    balance: 25
  },
  {
    classType: 'Group 60 Min',
    purchased: 30,
    used: 12,
    balance: 18
  }
]

export const mockCreditTransactions: CreditTransaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    teacherName: 'Priya Sharma',
    activity: 'Class Joined',
    credit: -5,
    comments: 'Individual session completed successfully',
    classType: 'PVT 60 Min'
  },
  {
    id: '2',
    date: '2024-01-14',
    teacherName: 'Anjali Rao',
    activity: 'Class Joined',
    credit: -3,
    comments: 'Group session completed successfully',
    classType: 'Group 60 Min'
  },
  {
    id: '3',
    date: '2024-01-13',
    teacherName: 'Rajesh Kumar',
    activity: 'Class Missed',
    credit: -4,
    comments: 'Student did not attend scheduled class',
    classType: 'PVT 40 Min'
  },
  {
    id: '4',
    date: '2024-01-10',
    teacherName: 'System',
    activity: 'Credit Purchase',
    credit: 50,
    comments: 'Monthly credit package purchase',
    classType: 'Purchase'
  },
  {
    id: '5',
    date: '2024-01-09',
    teacherName: 'Meera Singh',
    activity: 'Makeup Class',
    credit: -2,
    comments: 'Makeup session for previously missed class',
    classType: 'Group 60 Min'
  },
  {
    id: '6',
    date: '2024-01-08',
    teacherName: 'Vikram Kapoor',
    activity: 'Class Cancelled',
    credit: 0,
    comments: 'Class cancelled by instructor, no credit deducted',
    classType: 'PVT 60 Min'
  },
  {
    id: '7',
    date: '2024-01-05',
    teacherName: 'System',
    activity: 'Free Credit',
    credit: 10,
    comments: 'Welcome bonus for new students',
    classType: 'Bonus'
  },
  {
    id: '8',
    date: '2024-01-03',
    teacherName: 'Sarah Johnson',
    activity: 'Class Joined',
    credit: -2,
    comments: 'Short individual session completed',
    classType: 'PVT 40 Min'
  }
]

// Mock student courses with artForm property
export const mockStudentCourses = [
  {
    id: '1',
    name: 'Watercolor Painting for Beginners',
    instructor: 'Priya Sharma',
    progress: 75,
    status: 'active',
    nextClass: '2024-01-15T10:00:00Z',
    artForm: 'Painting'
  },
  {
    id: '2',
    name: 'Classical Dance Fundamentals',
    instructor: 'Anjali Rao',
    progress: 50,
    status: 'active',
    nextClass: '2024-01-16T14:00:00Z',
    artForm: 'Dance'
  }
]

// Mock assignments with all required properties
export const mockAssignments = [
  {
    id: '1',
    title: 'Watercolor Landscape Practice',
    courseId: '1',
    courseName: 'Watercolor Painting for Beginners',
    dueDate: '2024-01-20',
    status: 'pending',
    description: 'Create a landscape painting using watercolor techniques learned in class.',
    type: 'assignment',
    subject: 'Watercolor Painting',
    uploadDate: '2024-01-10',
    fileUrl: '/resources/watercolor-assignment.pdf'
  },
  {
    id: '2',
    title: 'Classical Dance Routine',
    courseId: '2',
    courseName: 'Classical Dance Fundamentals',
    dueDate: '2024-01-18',
    status: 'submitted',
    description: 'Perform and record a 2-minute classical dance routine.',
    type: 'video',
    subject: 'Classical Dance',
    uploadDate: '2024-01-08',
    fileUrl: '/resources/dance-routine-guide.mp4'
  },
  {
    id: '3',
    title: 'Art History Reading',
    courseId: '1',
    courseName: 'Watercolor Painting for Beginners',
    status: 'reviewed',
    description: 'Read chapter 3 on impressionist watercolor techniques.',
    type: 'notes',
    subject: 'Art History',
    uploadDate: '2024-01-05',
    fileUrl: '/resources/art-history-chapter3.pdf'
  }
]
