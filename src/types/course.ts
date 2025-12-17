export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  color?: string;
  subCategories?: CourseSubcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseSubcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  color?: string;
  category?: CourseCategory;
  createdAt: string;
  updatedAt: string;
}

export interface TopicResource {
  id?: string;
  title: string;
  type: 'audio' | 'video' | 'image' | 'document';
  url: string;
}

export interface CourseSubtopic {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  order: number;
  resources: TopicResource[];
  createdAt: string;
  progress_check?: boolean;
  updatedAt: string;
}

export interface CourseTopic {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  progress_check?: boolean;
  subtopics: CourseSubtopic[];
  resources: TopicResource[];
  createdAt: string;
  updatedAt: string;
}

// Course Settings Types
export interface CourseEnrollmentSettings {
  maxStudents?: number;
  enrollmentDeadline?: string;
  enableWaitlist: boolean;
  autoApproveEnrollment: boolean;
}

export interface CourseAccessSettings {
  courseVisibility: 'Public' | 'Private' | 'Invite-only';
  accessDuration: 'Fixed Date Range' | 'Lifetime' | 'Limited Days from Enrollment';
  accessDurationValue?: number | { startDate: string; endDate: string };
}

export interface CourseCompletionCriteria {
  minimumAttendanceRequired?: number;
  assessmentCompletionRequired: boolean;
  feedbackMandatory: boolean;
}

export interface CourseCertificateSettings {
  issueCertificate: boolean;
  certificateTemplate?: string;
  certificateIssuedBy?: string;
}

export interface CourseNotificationPreferences {
  notifyStudentNewClass: boolean;
  notifyInstructorEnrollment: boolean;
  enableWhatsAppAlerts: boolean;
  courseCompletionReminder: boolean;
}

export interface CoursePricingSettings {
  courseCostInCredits?: number;
  allowPartialPayments: boolean;
  markAsFreeTerial: boolean;
  displayAsFree: boolean;
}

export interface CourseDisplaySettings {
  showOnHomepage: boolean;
  showInPopularCourses: boolean;
  showCourseLanguage: boolean;
  displayInCourseCatalog: boolean;
}

export interface CourseWorkflowSettings {
  linkToDemoFlow: boolean;
}

export interface CourseInstructorPermissions {
  canRescheduleClasses: boolean;
  canAddModules: boolean;
}

export interface CourseSettings {
  enrollment: CourseEnrollmentSettings;
  access: CourseAccessSettings;
  completion: CourseCompletionCriteria;
  certificate: CourseCertificateSettings;
  notifications: CourseNotificationPreferences;
  pricing: CoursePricingSettings;
  display: CourseDisplaySettings;
  workflow: CourseWorkflowSettings;
  instructorPermissions: CourseInstructorPermissions;
}

export interface Course {
  id?: string;
  title: string;
  art_form?: string;
  artform?: {
    category_id: number
    created_at: string
    description: string
    id: number
    image_url: string
    name: string
    updated_at: string
  };
  categoryId?: string;
  category_id?: string;
  is_published: boolean;
  subcategoryId?: string;
  category?: CourseCategory;
  subcategory?: CourseSubcategory;
  description?: string;
  progress?: any;
  thumbnail?: string;
  thumbnail_image?: string;
  introductionVideoUrl?: string;
  instructors?: string[];
  modules?: CourseModule[];
  status?: CourseStatus;
  totalStudents?: number;
  topicsCovered?: string[];
  topics?: CourseTopic[];
  learningOutcomes?: string[];
  objectives?: string[];
  settings?: CourseSettings;
  display_as_course_catalog?: boolean;
  display_as_free?: boolean;
  link_to_manage_demos?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration?: string;
  objectives?: string;
  order: number;
  notes: ModuleNote[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ModuleNote {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'audio' | 'document' | 'image';
  fileUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export enum CourseStatus {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  DRAFT = "draft"
}

export enum Artform {
  HINDUSTANI_VOCAL = "Hindustani Vocal",
  CARNATIC_VOCAL = "Carnatic Vocal",
  BHARATANATYAM = "Bharatanatyam",
  KATHAK = "Kathak",
  ODISSI = "Odissi",
  KUCHIPUDI = "Kuchipudi",
  SITAR = "Sitar",
  TABLA = "Tabla",
  VIOLIN = "Violin",
  FLUTE = "Flute",
  GUITAR = "Guitar",
  PIANO = "Piano",
  MRIDANGAM = "Mridangam"
}

// Define string constants for course categories
export const COURSE_CATEGORIES = {
  CLASSICAL: "Classical",
  CONTEMPORARY: "Contemporary",
  FOLK: "Folk",
  FUSION: "Fusion"
} as const;

export type CourseCategoryType = typeof COURSE_CATEGORIES[keyof typeof COURSE_CATEGORIES];
