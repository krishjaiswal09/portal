
import { UserRole } from '@/types/user';

export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Student', country: 'USA', status: 'Active', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', country: 'UK', status: 'Active', createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', country: 'Canada', status: 'Inactive', createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', country: 'USA', status: 'Active', createdAt: '2024-01-05' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Instructor', country: 'UK', status: 'Active', createdAt: '2024-02-15' },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', role: 'Student', country: 'Canada', status: 'Active', createdAt: '2024-03-01' },
];

export const mockClasses = [
  { id: '1', title: 'Piano Basics', instructor: 'Jane Smith', status: 'Scheduled', startTime: '10:00 AM', duration: 60, type: 'Private', startDate: '2024-03-20', enrolledStudents: 1 },
  { id: '2', title: 'Guitar Intermediate', instructor: 'John Teacher', status: 'Completed', startTime: '2:00 PM', duration: 45, type: 'Group', startDate: '2024-03-15', enrolledStudents: 5 },
  { id: '3', title: 'Vocal Training', instructor: 'Sarah Voice', status: 'Ongoing', startTime: '11:00 AM', duration: 30, type: 'Trial', startDate: '2024-03-18', enrolledStudents: 1 },
  { id: '4', title: 'Dance Fundamentals', instructor: 'Mike Dance', status: 'Scheduled', startTime: '3:00 PM', duration: 90, type: 'Group', startDate: '2024-03-22', enrolledStudents: 8 },
  { id: '5', title: 'Art Composition', instructor: 'Lisa Artist', status: 'Completed', startTime: '9:00 AM', duration: 120, type: 'Private', startDate: '2024-03-12', enrolledStudents: 1 },
];

export const mockInstructorAvailability = [
  { id: '1', instructor: 'Jane Smith', date: '2024-03-20', timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'], availableSlots: 5 },
  { id: '2', instructor: 'John Teacher', date: '2024-03-20', timeSlots: ['10:00', '11:00', '13:00', '14:00'], availableSlots: 4 },
  { id: '3', instructor: 'Sarah Voice', date: '2024-03-21', timeSlots: ['09:00', '10:00', '11:00', '16:00', '17:00'], availableSlots: 5 },
  { id: '4', instructor: 'Mike Dance', date: '2024-03-21', timeSlots: ['14:00', '15:00', '16:00'], availableSlots: 3 },
  { id: '5', instructor: 'Lisa Artist', date: '2024-03-22', timeSlots: ['08:00', '09:00', '10:00', '11:00'], availableSlots: 4 },
];

export const mockEarnings = [
  { id: '1', instructor: 'Jane Smith', totalClasses: 25, amountPaid: 1250, pending: 0, month: 'March 2024', classType: 'All' },
  { id: '2', instructor: 'John Teacher', totalClasses: 18, amountPaid: 900, pending: 200, month: 'March 2024', classType: 'Group' },
  { id: '3', instructor: 'Sarah Voice', totalClasses: 32, amountPaid: 1600, pending: 400, month: 'March 2024', classType: 'Private' },
  { id: '4', instructor: 'Mike Dance', totalClasses: 15, amountPaid: 750, pending: 100, month: 'March 2024', classType: 'Group' },
  { id: '5', instructor: 'Lisa Artist', totalClasses: 20, amountPaid: 1000, pending: 0, month: 'March 2024', classType: 'Private' },
];

export const mockCredits = [
  { id: '1', student: 'John Doe', type: 'Purchased', creditValue: 10, date: '2024-03-15', transactionId: 'TXN001' },
  { id: '2', student: 'Bob Johnson', type: 'Free Trial', creditValue: 1, date: '2024-03-10', transactionId: 'TXN002' },
  { id: '3', student: 'John Doe', type: 'Used', creditValue: -1, date: '2024-03-16', transactionId: 'TXN003' },
  { id: '4', student: 'Diana Prince', type: 'Purchased', creditValue: 5, date: '2024-03-12', transactionId: 'TXN004' },
  { id: '5', student: 'Bob Johnson', type: 'Used', creditValue: -1, date: '2024-03-11', transactionId: 'TXN005' },
];

export const mockTrials = [
  { id: '1', student: 'New Student 1', instructor: 'Jane Smith', status: 'Completed', scheduledAt: '2024-03-15 10:00', outcome: 'Converted', salesRep: 'Alice Brown' },
  { id: '2', student: 'New Student 2', instructor: 'John Teacher', status: 'Scheduled', scheduledAt: '2024-03-20 14:00', outcome: 'Pending', salesRep: 'Alice Brown' },
  { id: '3', student: 'New Student 3', instructor: 'Sarah Voice', status: 'Completed', scheduledAt: '2024-03-14 11:00', outcome: 'Not Converted', salesRep: 'Charlie Wilson' },
  { id: '4', student: 'New Student 4', instructor: 'Mike Dance', status: 'Cancelled', scheduledAt: '2024-03-13 15:00', outcome: 'Cancelled', salesRep: 'Alice Brown' },
];

export const mockTransactions = [
  { id: '1', user: 'John Doe', type: 'Credit Purchase', amount: 100, date: '2024-03-15', status: 'Completed', role: 'Student' },
  { id: '2', user: 'Bob Johnson', type: 'Missed Class Refund', amount: 25, date: '2024-03-14', status: 'Pending', role: 'Student' },
  { id: '3', user: 'Diana Prince', type: 'Credit Purchase', amount: 50, date: '2024-03-12', status: 'Completed', role: 'Student' },
  { id: '4', user: 'Jane Smith', type: 'Instructor Payment', amount: 500, date: '2024-03-10', status: 'Completed', role: 'Instructor' },
  { id: '5', user: 'John Teacher', type: 'Instructor Payment', amount: 300, date: '2024-03-08', status: 'Pending', role: 'Instructor' },
];

export const mockCommunications = [
  { id: '1', messageType: 'Class Reminder', recipient: 'john@example.com', status: 'Delivered', sentAt: '2024-03-15 09:00', opened: 'Yes', medium: 'Email' },
  { id: '2', messageType: 'Payment Reminder', recipient: 'bob@example.com', status: 'Failed', sentAt: '2024-03-14 10:00', opened: 'No', medium: 'Email' },
  { id: '3', messageType: 'Class Confirmation', recipient: '+1234567890', status: 'Delivered', sentAt: '2024-03-16 08:00', opened: 'Yes', medium: 'WhatsApp' },
  { id: '4', messageType: 'Schedule Change', recipient: 'diana@example.com', status: 'Delivered', sentAt: '2024-03-13 16:00', opened: 'Yes', medium: 'Email' },
  { id: '5', messageType: 'Welcome Message', recipient: '+0987654321', status: 'Delivered', sentAt: '2024-03-12 12:00', opened: 'No', medium: 'WhatsApp' },
];
