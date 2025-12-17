
import { Resource } from "@/types/resource"
import { mockResources } from "./resourceData"

// Mock instructor data for mapping IDs to names
const instructorMap: Record<string, { name: string; role: string }> = {
  "instructor-1": { name: "Raghav Sharma", role: "Instructor" },
  "instructor-2": { name: "Priya Kumar", role: "Instructor" },
  "instructor-3": { name: "Amit Patel", role: "Instructor" },
  "instructor-4": { name: "Kavitha Reddy", role: "Instructor" },
  "instructor-5": { name: "Suresh Iyer", role: "Instructor" },
}

export interface StudentResource extends Resource {
  media_url?: string;
  senderName: string
  senderRole: string
  courseContext?: string
  isNew: boolean
  lastAccessed?: string
}

export const getStudentResources = (studentCourses: string[] = []): StudentResource[] => {
  // Filter resources based on student's enrolled courses and public visibility
  const availableResources = mockResources.filter(resource => {
    // Include public resources
    if (resource.visibility === 'Public') return true

    // Include resources from student's enrolled courses
    if (resource.assignedTo.courses.some(course => studentCourses.includes(course))) {
      return true
    }

    return false
  })

  // Transform resources to include sender information
  return availableResources.map(resource => {
    let senderName = "Admin User"
    let senderRole = "Admin"

    // Check if uploaded by instructor
    if (resource.uploadedBy.startsWith("Instructor")) {
      const instructorId = resource.assignedTo.instructors?.[0]
      if (instructorId && instructorMap[instructorId]) {
        senderName = instructorMap[instructorId].name
        senderRole = instructorMap[instructorId].role
      } else {
        senderName = resource.uploadedBy
        senderRole = "Instructor"
      }
    }

    return {
      ...resource,
      senderName,
      senderRole,
      courseContext: resource.assignedTo.courses[0],
      isNew: Math.random() > 0.7, // Randomly mark some as new for demo
      lastAccessed: Math.random() > 0.5 ? "2024-02-08T10:30:00Z" : undefined
    }
  })
}

// Mock student's enrolled courses
export const mockStudentCourses = [
  "Classical Music Fundamentals",
  "Guitar Fundamentals",
  "Classical Dance"
]

export const studentResources = getStudentResources(mockStudentCourses)
