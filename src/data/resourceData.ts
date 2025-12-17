
import { Resource, ResourceCategory, ResourceTag, AccessLog } from "@/types/resource"

export const resourceCategories: ResourceCategory[] = [
  {
    id: "1",
    name: "Theory Notes",
    description: "Theoretical concepts and study materials",
    color: "bg-blue-100 text-blue-800",
    resourceCount: 15
  },
  {
    id: "2", 
    name: "Practice Material",
    description: "Exercises and practice sheets",
    color: "bg-green-100 text-green-800",
    resourceCount: 23
  },
  {
    id: "3",
    name: "Reference Videos",
    description: "Instructional and demonstration videos",
    color: "bg-purple-100 text-purple-800",
    resourceCount: 12
  },
  {
    id: "4",
    name: "Audio Samples",
    description: "Music samples and audio references",
    color: "bg-orange-100 text-orange-800",
    resourceCount: 8
  }
]

export const resourceTags: ResourceTag[] = [
  { id: "1", name: "Beginner Friendly", color: "bg-emerald-100 text-emerald-800", usageCount: 45 },
  { id: "2", name: "Advanced Technique", color: "bg-red-100 text-red-800", usageCount: 23 },
  { id: "3", name: "Classical", color: "bg-indigo-100 text-indigo-800", usageCount: 34 },
  { id: "4", name: "Modern", color: "bg-pink-100 text-pink-800", usageCount: 19 },
  { id: "5", name: "Exam Prep", color: "bg-yellow-100 text-yellow-800", usageCount: 12 }
]

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Introduction to Hindustani Classical Ragas",
    description: "Comprehensive guide covering basic ragas and their characteristics",
    fileName: "hindustani-ragas-guide.pdf",
    fileSize: "2.4 MB",
    fileType: "PDF",
    thumbnailUrl: "/placeholder-pdf.png",
    artForms: ["Hindustani Vocal", "Harmonium"],
    assignedTo: {
      courses: ["Classical Music Fundamentals"],
      classLevels: ["Beginner", "Intermediate"],
      instructors: ["instructor-1", "instructor-2"]
    },
    visibility: "Public",
    accessType: "Downloadable",
    tags: ["Beginner Friendly", "Classical"],
    language: "English",
    uploadedBy: "Admin User",
    uploadDate: "2024-01-15",
    downloadCount: 127,
    viewCount: 234,
    categoryId: "1"
  },
  {
    id: "2",
    title: "Guitar Fingering Techniques Demo",
    description: "Video demonstration of proper finger positioning and techniques",
    fileName: "guitar-fingering-demo.mp4",
    fileSize: "45.6 MB",
    fileType: "Video",
    thumbnailUrl: "/placeholder-video.png",
    artForms: ["Guitar"],
    assignedTo: {
      courses: ["Guitar Fundamentals"],
      classLevels: ["Beginner"],
      instructors: ["instructor-3"]
    },
    visibility: "Public",
    accessType: "View Only",
    tags: ["Beginner Friendly"],
    language: "English",
    uploadedBy: "Instructor Kumar",
    uploadDate: "2024-01-20",
    downloadCount: 0,
    viewCount: 89,
    categoryId: "3"
  },
  {
    id: "3",
    title: "Bharatanatyam Basic Adavus Practice Sheet",
    description: "Step-by-step breakdown of fundamental adavus with practice exercises",
    fileName: "bharatanatyam-adavus.pdf",
    fileSize: "1.8 MB",
    fileType: "PDF",
    artForms: ["Bharatanatyam"],
    assignedTo: {
      courses: ["Classical Dance"],
      classLevels: ["Beginner"],
      instructors: ["instructor-4"]
    },
    visibility: "Private",
    accessType: "Downloadable",
    tags: ["Beginner Friendly", "Classical"],
    language: "English",
    uploadedBy: "Admin User",
    uploadDate: "2024-01-25",
    downloadCount: 67,
    viewCount: 123,
    categoryId: "2"
  },
  {
    id: "4",
    title: "Tabla Compositions - Teentaal Variations",
    description: "Audio samples of different teentaal compositions for practice",
    fileName: "tabla-teentaal-variations.mp3",
    fileSize: "12.3 MB",
    fileType: "Audio",
    artForms: ["Tabla"],
    assignedTo: {
      courses: ["Percussion Fundamentals"],
      classLevels: ["Intermediate", "Advanced"],
      instructors: ["instructor-5"]
    },
    visibility: "Public",
    accessType: "Downloadable",
    tags: ["Advanced Technique", "Classical"],
    language: "Hindi",
    uploadedBy: "Instructor Sharma",
    uploadDate: "2024-02-01",
    downloadCount: 43,
    viewCount: 87,
    categoryId: "4"
  }
]

export const mockAccessLogs: AccessLog[] = [
  {
    id: "1",
    studentId: "student-1",
    studentName: "Arjun Patel",
    resourceId: "1",
    resourceTitle: "Introduction to Hindustani Classical Ragas",
    resourceType: "PDF",
    action: "Download",
    timestamp: "2024-02-10T10:30:00Z",
    courseId: "course-1"
  },
  {
    id: "2",
    studentId: "student-2",
    studentName: "Priya Sharma",
    resourceId: "2",
    resourceTitle: "Guitar Fingering Techniques Demo",
    resourceType: "Video",
    action: "View",
    timestamp: "2024-02-10T14:15:00Z",
    courseId: "course-2"
  },
  {
    id: "3",
    studentId: "student-1",
    studentName: "Arjun Patel",
    resourceId: "1",
    resourceTitle: "Introduction to Hindustani Classical Ragas",
    resourceType: "PDF",
    action: "View",
    timestamp: "2024-02-09T16:45:00Z",
    courseId: "course-1"
  },
  {
    id: "4",
    studentId: "student-3",
    studentName: "Kavya Reddy",
    resourceId: "3",
    resourceTitle: "Bharatanatyam Basic Adavus Practice Sheet",
    resourceType: "PDF",
    action: "Download",
    timestamp: "2024-02-08T11:20:00Z",
    courseId: "course-3"
  }
]

export const artForms = [
  "Hindustani Vocal",
  "Carnatic Vocal", 
  "Guitar",
  "Piano",
  "Keyboard",
  "Harmonium",
  "Tabla",
  "Bharatanatyam",
  "Kathak",
  "Western Dance",
  "Bollywood Dance"
]

export const languages = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi"
]
