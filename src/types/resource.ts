
export interface Resource {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: string
  fileType: 'Video' | 'PDF' | 'Audio' | 'Image' | 'Assignment' | 'Sheet Music' | 'Document'
  thumbnailUrl?: string
  artForms: string[]
  assignedTo: {
    courses: string[]
    classLevels: ('Beginner' | 'Intermediate' | 'Advanced')[]
    instructors: string[]
  }
  visibility: 'Public' | 'Private'
  accessType: 'View Only' | 'Downloadable'
  tags: string[]
  language: string
  uploadedBy: string
  uploadDate: string
  downloadCount: number
  viewCount: number
  categoryId?: string
}

export interface ResourceCategory {
  id: string
  name: string
  description: string
  color: string
  resourceCount: number
}

export interface ResourceTag {
  id: string
  name: string
  color: string
  usageCount: number
}

export interface AccessLog {
  id: string
  studentId: string
  studentName: string
  resourceId: string
  resourceTitle: string
  resourceType: string
  action: 'View' | 'Download'
  timestamp: string
  courseId?: string
}

export interface ResourceFilters {
  search: string
  artForms: string[]
  resourceTypes: string[]
  visibility: 'all' | 'public' | 'private'
  accessType: 'all' | 'view-only' | 'downloadable'
  uploadedBy: string[]
  categories: string[]
  tags: string[]
  dateRange: {
    start: string
    end: string
  }
}
