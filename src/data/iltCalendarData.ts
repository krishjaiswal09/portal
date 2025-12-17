
export interface ILTCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  instructor: {
    id: string;
    name: string;
    color: string;
  };
  course: {
    id: string;
    name: string;
    code: string;
  };
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  type: 'private' | 'group';
}

export const instructorColors = [
  { id: 'alsam-n', name: 'Alsam N', color: '#3B82F6' },
  { id: 'priya-sharma', name: 'Ms. Priya Sharma', color: '#10B981' },
  { id: 'ustad-rahman', name: 'Ustad Rahman', color: '#F59E0B' },
  { id: 'john-smith', name: 'John Smith', color: '#EF4444' },
  { id: 'maria-garcia', name: 'Maria Garcia', color: '#8B5CF6' },
  { id: 'david-chen', name: 'David Chen', color: '#06B6D4' }
];

export const courseOptions = [
  { value: 'all', label: 'All Courses' },
  { value: 'bharatanatyam-beginner', label: 'ABB – Bharatanatyam Beginner Course' },
  { value: 'kuchipudi-advanced', label: 'AKA – Advanced Kuchipudi Techniques' },
  { value: 'classical-dance', label: 'CD – Classical Dance' },
  { value: 'hindustani-classical', label: 'HCM – Hindustani Classical Music' },
  { value: 'carnatic-music', label: 'CMF – Carnatic Music Fundamentals' },
  { value: 'violin-intermediate', label: 'VI – Violin Intermediate' }
];

export const mockILTCalendarEvents: ILTCalendarEvent[] = [
  {
    id: '1',
    title: 'Bharatanatyam Session',
    start: '2025-06-26T03:45:00',
    end: '2025-06-26T04:45:00',
    instructor: {
      id: 'alsam-n',
      name: 'Alsam N',
      color: '#3B82F6'
    },
    course: {
      id: 'bharatanatyam-beginner',
      name: 'Bharatanatyam Beginner Course',
      code: 'ABB'
    },
    students: [
      { id: '1', name: 'Nishant Jain', email: 'nishant.jain@example.com' }
    ],
    status: 'scheduled',
    type: 'private'
  },
  {
    id: '2',
    title: 'Classical Dance Group',
    start: '2025-06-26T08:00:00',
    end: '2025-06-26T09:30:00',
    instructor: {
      id: 'priya-sharma',
      name: 'Ms. Priya Sharma',
      color: '#10B981'
    },
    course: {
      id: 'classical-dance',
      name: 'Classical Dance',
      code: 'CD'
    },
    students: [
      { id: '2', name: 'Megha Shinde', email: 'megha.shinde@example.com' },
      { id: '3', name: 'Arjun Patel', email: 'arjun.patel@example.com' },
      { id: '4', name: 'Kavya Singh', email: 'kavya.singh@example.com' }
    ],
    status: 'completed',
    type: 'group'
  },
  {
    id: '3',
    title: 'Hindustani Music Advanced',
    start: '2025-06-26T10:30:00',
    end: '2025-06-26T12:00:00',
    instructor: {
      id: 'ustad-rahman',
      name: 'Ustad Rahman',
      color: '#F59E0B'
    },
    course: {
      id: 'hindustani-classical',
      name: 'Hindustani Classical Music',
      code: 'HCM'
    },
    students: [
      { id: '5', name: 'Ravi Kumar', email: 'ravi.kumar@example.com' },
      { id: '6', name: 'Sneha Reddy', email: 'sneha.reddy@example.com' }
    ],
    status: 'ongoing',
    type: 'group'
  },
  {
    id: '4',
    title: 'Kuchipudi Techniques',
    start: '2025-06-27T07:00:00',
    end: '2025-06-27T08:30:00',
    instructor: {
      id: 'john-smith',
      name: 'John Smith',
      color: '#EF4444'
    },
    course: {
      id: 'kuchipudi-advanced',
      name: 'Advanced Kuchipudi Techniques',
      code: 'AKA'
    },
    students: [
      { id: '7', name: 'Anita Desai', email: 'anita.desai@example.com' }
    ],
    status: 'scheduled',
    type: 'private'
  },
  {
    id: '5',
    title: 'Carnatic Music Fundamentals',
    start: '2025-06-27T15:30:00',
    end: '2025-06-27T17:00:00',
    instructor: {
      id: 'maria-garcia',
      name: 'Maria Garcia',
      color: '#8B5CF6'
    },
    course: {
      id: 'carnatic-music',
      name: 'Carnatic Music Fundamentals',
      code: 'CMF'
    },
    students: [
      { id: '8', name: 'Vikram Rao', email: 'vikram.rao@example.com' },
      { id: '9', name: 'Pooja Nair', email: 'pooja.nair@example.com' }
    ],
    status: 'scheduled',
    type: 'group'
  }
];
