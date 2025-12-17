
export interface LeadSourceData {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadSource: string;
  courseInterest: string;
  country: string;
  submissionDate: string;
}

export const mockLeadSourceData: LeadSourceData[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    leadSource: 'Facebook',
    courseInterest: 'Piano Basics',
    country: 'USA',
    submissionDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91-9876543210',
    leadSource: 'Instagram',
    courseInterest: 'Guitar Advanced',
    country: 'India',
    submissionDate: '2024-01-14'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+44-7700900123',
    leadSource: 'YouTube',
    courseInterest: 'Vocal Training',
    country: 'UK',
    submissionDate: '2024-01-13'
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+34-612345678',
    leadSource: 'LinkedIn',
    courseInterest: 'Piano Intermediate',
    country: 'Spain',
    submissionDate: '2024-01-12'
  },
  {
    id: '5',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91-8765432109',
    leadSource: 'WhatsApp',
    courseInterest: 'Classical Dance',
    country: 'India',
    submissionDate: '2024-01-11'
  },
  {
    id: '6',
    name: 'John Davis',
    email: 'john.davis@email.com',
    phone: '+1-555-0456',
    leadSource: 'Google',
    courseInterest: 'Drum Lessons',
    country: 'USA',
    submissionDate: '2024-01-10'
  },
  {
    id: '7',
    name: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+1-555-0789',
    leadSource: 'Facebook',
    courseInterest: 'Violin Basics',
    country: 'Canada',
    submissionDate: '2024-01-09'
  },
  {
    id: '8',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+971-501234567',
    leadSource: 'Instagram',
    courseInterest: 'Oud Lessons',
    country: 'UAE',
    submissionDate: '2024-01-08'
  },
  {
    id: '9',
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    phone: '+33-123456789',
    leadSource: 'LinkedIn',
    courseInterest: 'Piano Advanced',
    country: 'France',
    submissionDate: '2024-01-07'
  },
  {
    id: '10',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+82-10-1234-5678',
    leadSource: 'YouTube',
    courseInterest: 'Guitar Basics',
    country: 'South Korea',
    submissionDate: '2024-01-06'
  }
];

// Export the main data array with the correct name
export const leadSourceData = mockLeadSourceData;

// Export the lead sources array
export const LEAD_SOURCES = ['Facebook', 'Instagram', 'YouTube', 'LinkedIn', 'WhatsApp', 'Google'];

// Export the courses array
export const COURSES = [
  'Piano Basics',
  'Piano Intermediate', 
  'Piano Advanced',
  'Guitar Basics',
  'Guitar Advanced',
  'Vocal Training',
  'Classical Dance',
  'Drum Lessons',
  'Violin Basics',
  'Oud Lessons'
];

export const leadSourceStats = [
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'Instagram', value: 20, color: '#E4405F' },
  { name: 'YouTube', value: 18, color: '#FF0000' },
  { name: 'LinkedIn', value: 15, color: '#0A66C2' },
  { name: 'WhatsApp', value: 12, color: '#25D366' },
  { name: 'Google', value: 10, color: '#4285F4' }
];
