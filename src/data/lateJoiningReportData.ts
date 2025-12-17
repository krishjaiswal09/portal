
export interface LateJoiningReportData {
  id: string;
  classDate: string;
  classTime: string;
  studentName: string;
  instructorName: string;
  courseName: string;
  actualJoinTime: string;
  lateByMinutes: number;
  status: 'completed' | 'ongoing' | 'cancelled';
}

export const lateJoiningReportData: LateJoiningReportData[] = [
  {
    id: '1',
    classDate: '2024-01-20',
    classTime: '10:00 AM',
    studentName: 'Arya Patel',
    instructorName: 'Ms. Priya Sharma',
    courseName: 'Classical Dance',
    actualJoinTime: '10:05 AM',
    lateByMinutes: 5,
    status: 'completed'
  },
  {
    id: '2',
    classDate: '2024-01-19',
    classTime: '2:00 PM',
    studentName: 'Kavya Singh',
    instructorName: 'Ustad Rahman',
    courseName: 'Hindustani Classical',
    actualJoinTime: '2:12 PM',
    lateByMinutes: 12,
    status: 'completed'
  },
  {
    id: '3',
    classDate: '2024-01-18',
    classTime: '4:30 PM',
    studentName: 'Ravi Kumar',
    instructorName: 'Ms. Meera Nair',
    courseName: 'Bharatanatyam',
    actualJoinTime: '4:40 PM',
    lateByMinutes: 10,
    status: 'ongoing'
  },
  {
    id: '4',
    classDate: '2024-01-17',
    classTime: '11:00 AM',
    studentName: 'Sneha Reddy',
    instructorName: 'Pandit Krishnan',
    courseName: 'Carnatic Music',
    actualJoinTime: '11:22 AM',
    lateByMinutes: 22,
    status: 'cancelled'
  },
  {
    id: '5',
    classDate: '2024-01-16',
    classTime: '3:00 PM',
    studentName: 'Arjun Menon',
    instructorName: 'Ms. Anjali Devi',
    courseName: 'Kuchipudi',
    actualJoinTime: '3:08 PM',
    lateByMinutes: 8,
    status: 'completed'
  }
];

export const courseOptionsForLateJoining = [
  { value: 'classical-dance', label: 'Classical Dance' },
  { value: 'hindustani-classical', label: 'Hindustani Classical' },
  { value: 'bharatanatyam', label: 'Bharatanatyam' },
  { value: 'carnatic-music', label: 'Carnatic Music' },
  { value: 'kuchipudi', label: 'Kuchipudi' }
];

export const instructorOptionsForLateJoining = [
  { value: 'ms-priya-sharma', label: 'Ms. Priya Sharma' },
  { value: 'ustad-rahman', label: 'Ustad Rahman' },
  { value: 'ms-meera-nair', label: 'Ms. Meera Nair' },
  { value: 'pandit-krishnan', label: 'Pandit Krishnan' },
  { value: 'ms-anjali-devi', label: 'Ms. Anjali Devi' }
];
