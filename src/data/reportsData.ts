
import { ILTReportData, RecordingReportData, ClassCreditReportData } from '@/types/reports';

export const iltReportData: ILTReportData[] = [
  {
    id: 'ilt-1',
    courseName: 'Guitar Basics',
    instructorName: 'John Smith',
    studentNames: ['Alice Johnson'],
    classDate: '2024-06-20',
    classTime: '10:00 AM - 11:00 AM',
    attendance: '1/1',
    deliveryMode: 'online',
    status: 'completed',
    details: {
      course: 'Guitar Basics',
      dateTime: '2024-06-20 10:00 AM - 11:00 AM',
      instructor: 'John Smith',
      instructorAide: 'Sarah Wilson',
      recordingAvailable: true,
      notes: 'Introduction to guitar chords, basic finger positioning',
      learners: [
        {
          name: 'Alice Johnson',
          attendance: true,
          joinTime: '10:02 AM',
          instructorRating: {
            audio: 5,
            video: 4
          }
        }
      ]
    }
  },
  {
    id: 'ilt-2',
    courseName: 'Piano Intermediate',
    instructorName: 'Maria Garcia',
    studentNames: ['Bob Davis', 'Carol White'],
    classDate: '2024-06-21',
    classTime: '02:00 PM - 03:00 PM',
    attendance: '1/2',
    deliveryMode: 'offline',
    status: 'completed',
    details: {
      course: 'Piano Intermediate',
      dateTime: '2024-06-21 02:00 PM - 03:00 PM',
      instructor: 'Maria Garcia',
      recordingAvailable: false,
      notes: 'Scale practice, sight reading exercises',
      learners: [
        {
          name: 'Bob Davis',
          attendance: true,
          joinTime: '02:00 PM',
          instructorRating: {
            audio: 5,
            video: 5
          }
        },
        {
          name: 'Carol White',
          attendance: false,
          joinTime: undefined,
          instructorRating: undefined
        }
      ]
    }
  },
  {
    id: 'ilt-3',
    courseName: 'Violin Advanced',
    instructorName: 'David Chen',
    studentNames: ['Eve Brown'],
    classDate: '2024-06-22',
    classTime: '11:00 AM - 12:00 PM',
    attendance: '0/1',
    deliveryMode: 'online',
    status: 'cancelled',
    details: {
      course: 'Violin Advanced',
      dateTime: '2024-06-22 11:00 AM - 12:00 PM',
      instructor: 'David Chen',
      recordingAvailable: false,
      notes: 'Class cancelled due to instructor illness',
      learners: [
        {
          name: 'Eve Brown',
          attendance: false,
          joinTime: undefined,
          instructorRating: undefined
        }
      ]
    }
  }
];

export const recordingReportData: RecordingReportData[] = [
  {
    id: 'rec-1',
    classDate: '2024-06-20',
    classStartTime: '10:00 AM',
    instructorName: 'John Smith',
    courseName: 'Guitar Basics',
    studentNames: ['Alice Johnson'],
    recordingStartTime: '10:03 AM',
    recordingDuration: '57 minutes',
    recordingDetails: {
      url: 'https://zoom.us/rec/share/abc123def456',
      classTime: '10:00 AM - 11:00 AM',
      meetingId: '123-456-789',
      password: 'guitar123'
    },
    status: 'completed'
  },
  {
    id: 'rec-2',
    classDate: '2024-06-21',
    classStartTime: '02:00 PM',
    instructorName: 'Maria Garcia',
    courseName: 'Piano Intermediate',
    studentNames: ['Bob Davis', 'Carol White'],
    recordingStartTime: '02:05 PM',
    recordingDuration: '55 minutes',
    recordingDetails: {
      url: 'https://zoom.us/rec/share/xyz789abc123',
      classTime: '02:00 PM - 03:00 PM',
      meetingId: '987-654-321',
      password: 'piano456'
    },
    status: 'completed'
  },
  {
    id: 'rec-3',
    classDate: '2024-06-22',
    classStartTime: '11:00 AM',
    instructorName: 'David Chen',
    courseName: 'Violin Advanced',
    studentNames: ['Eve Brown'],
    recordingStartTime: undefined,
    recordingDuration: undefined,
    recordingDetails: undefined,
    status: 'cancelled'
  }
];

export const classCreditReportData: ClassCreditReportData[] = [
  {
    id: 'credit-1',
    studentName: 'Alice Johnson',
    courseName: 'Guitar Basics',
    startDate: '2024-06-01',
    classesPurchased: 10,
    classesCharged: 3,
    classBalance: 7,
    status: 'paid',
    dueDate: '2024-07-01',
    lastPaymentDate: '2024-06-01',
    transactions: [
      {
        id: 'txn-1',
        date: '2024-06-01',
        numberOfClasses: 10,
        amountPaid: 500,
        comment: 'Initial package purchase'
      }
    ],
    scheduledClasses: [
      {
        id: 'class-1',
        dateTime: '2024-06-20 10:00 AM',
        attendance: true,
        creditUsed: true
      },
      {
        id: 'class-2',
        dateTime: '2024-06-27 10:00 AM',
        attendance: true,
        creditUsed: true
      },
      {
        id: 'class-3',
        dateTime: '2024-07-04 10:00 AM',
        attendance: false,
        creditUsed: true
      }
    ]
  },
  {
    id: 'credit-2',
    studentName: 'Bob Davis',
    courseName: 'Piano Intermediate',
    startDate: '2024-05-15',
    classesPurchased: 8,
    classesCharged: 8,
    classBalance: 0,
    status: 'overdue',
    dueDate: '2024-06-15',
    lastPaymentDate: '2024-05-15',
    transactions: [
      {
        id: 'txn-2',
        date: '2024-05-15',
        numberOfClasses: 8,
        amountPaid: 400,
        comment: 'Monthly package'
      }
    ],
    scheduledClasses: [
      {
        id: 'class-4',
        dateTime: '2024-06-21 02:00 PM',
        attendance: true,
        creditUsed: true
      }
    ]
  }
];
