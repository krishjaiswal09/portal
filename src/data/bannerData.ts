
import { Banner } from "@/types/banner";

export const mockBanners: Banner[] = [
  {
    id: "1",
    title: "New Guitar Course Launch",
    imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=400&fit=crop",
    ctaButton: {
      text: "Enroll Now",
      url: "/courses/guitar"
    },
    dateRange: {
      startDate: "2024-07-01T00:00:00Z",
      endDate: "2024-07-31T23:59:59Z"
    },
    audience: {
      userRoles: ["Student", "Parent"],
      courses: ["Guitar Basics", "Advanced Guitar"],
      artForms: ["Guitar"],
      ageGroups: ["10-20 yrs", "21-35 yrs"],
      timezones: ["Asia/Kolkata", "America/New_York"],
      countries: ["India", "United States"]
    },
    isActive: true,
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-06-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Bharatanatyam Workshop",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=400&fit=crop",
    ctaButton: {
      text: "Register",
      url: "/workshops/bharatanatyam"
    },
    dateRange: {
      startDate: "2024-07-15T00:00:00Z",
      endDate: "2024-08-15T23:59:59Z"
    },
    audience: {
      userRoles: ["Student"],
      courses: ["Classical Dance"],
      artForms: ["Bharatanatyam"],
      ageGroups: ["9 yrs and younger", "10-20 yrs"],
      timezones: ["Asia/Kolkata"],
      countries: ["India"]
    },
    isActive: true,
    createdAt: "2024-06-20T14:30:00Z",
    updatedAt: "2024-06-20T14:30:00Z"
  },
  {
    id: "3",
    title: "Piano Masterclass Series",
    imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=400&fit=crop",
    dateRange: {
      startDate: "2024-06-01T00:00:00Z",
      endDate: "2024-06-30T23:59:59Z"
    },
    audience: {
      userRoles: ["Instructor", "Student"],
      courses: ["Piano Fundamentals", "Jazz Piano"],
      artForms: ["Piano"],
      ageGroups: ["21-35 yrs", "36 yrs and older"],
      timezones: ["America/New_York", "America/Toronto"],
      countries: ["United States", "Canada"]
    },
    isActive: false,
    createdAt: "2024-05-25T09:15:00Z",
    updatedAt: "2024-06-01T16:45:00Z"
  }
];

// Mock data for dropdowns
export const mockUserRoles = ["Student", "Instructor", "Parent"];

export const mockCourses = [
  "Guitar Basics", "Advanced Guitar", "Piano Fundamentals", "Jazz Piano",
  "Classical Dance", "Bharatanatyam", "Kathak", "Tabla Basics", "Violin Fundamentals"
];

export const mockArtForms = [
  "Guitar", "Piano", "Violin", "Tabla", "Bharatanatyam", "Kathak", "Voice", "Drums"
];

export const mockAgeGroups = [
  "9 yrs and younger",
  "10-20 yrs", 
  "21-35 yrs",
  "36 yrs and older"
];

export const mockTimezones = [
  "Asia/Kolkata",
  "America/New_York", 
  "America/Toronto",
  "Europe/London",
  "Australia/Sydney",
  "Asia/Tokyo"
];

export const mockCountries = [
  "India",
  "United States",
  "Canada", 
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan"
];
