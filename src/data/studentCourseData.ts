
export interface StudentCourse {
  id: string;
  name: string;
  artform: string;
  instructor: string;
  thumbnail?: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  nextClassDate?: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'paused';
  topics: StudentCourseTopic[];
  modules: StudentCourseModule[];
  classes: StudentCourseClass[];
}

export interface StudentCourseTopic {
  id: string;
  name: string;
  completed: boolean;
  category?: string;
}

export interface StudentCourseModule {
  id: string;
  title: string;
  description: string;
  topics: ModuleTopic[];
  progress: number;
}

export interface ModuleTopic {
  id: string;
  name: string;
  resources: TopicResource[];
}

export interface TopicResource {
  id?: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  description?: string;
}

export interface StudentCourseClass {
  id: string;
  date: string;
  time: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  instructorNotes?: string;
  recordingUrl?: string;
  canReschedule: boolean;
}

export const studentCourses: StudentCourse[] = [
  {
    id: "1",
    name: "Beginner Hindustani Vocal",
    artform: "Hindustani Vocal",
    instructor: "Ravi Kumar",
    thumbnail: "/lovable-uploads/31e03d8a-83a8-426e-b8f5-7f887066b1fe.png",
    progress: 65,
    totalTopics: 12,
    completedTopics: 8,
    nextClassDate: "2024-01-15",
    enrollmentDate: "2023-10-01",
    status: "active",
    topics: [
      { id: "t1", name: "Basic Swar Practice", completed: true, category: "Fundamentals" },
      { id: "t2", name: "Aroha Avaroha", completed: true, category: "Fundamentals" },
      { id: "t3", name: "Alankars", completed: true, category: "Fundamentals" },
      { id: "t4", name: "Raag Yaman Introduction", completed: true, category: "Ragas" },
      { id: "t5", name: "Raag Yaman Bandish", completed: true, category: "Ragas" },
      { id: "t6", name: "Taal Teentaal", completed: true, category: "Rhythm" },
      { id: "t7", name: "Melakartha System", completed: true, category: "Theory" },
      { id: "t8", name: "Bhajan Singing", completed: true, category: "Application" },
      { id: "t9", name: "Raag Bhairav", completed: false, category: "Ragas" },
      { id: "t10", name: "Raag Bageshri", completed: false, category: "Ragas" },
      { id: "t11", name: "Taal Dadra", completed: false, category: "Rhythm" },
      { id: "t12", name: "Performance Techniques", completed: false, category: "Advanced" },
    ],
    modules: [
      {
        id: "m1",
        title: "Foundation Module",
        description: "Basic concepts and vocal exercises",
        progress: 100,
        topics: [
          {
            id: "mt1",
            name: "Breathing Techniques",
            resources: [
              { id: "r1", title: "Breathing Exercise Video", type: "video", url: "/resources/breathing.mp4" },
              { id: "r2", title: "Practice Sheet", type: "document", url: "/resources/breathing-sheet.pdf" },
            ]
          },
          {
            id: "mt2",
            name: "Swar Practice",
            resources: [
              { id: "r3", title: "Swar Audio Guide", type: "audio", url: "/resources/swar-practice.mp3" },
              { id: "r4", title: "Swar Chart", type: "image", url: "/resources/swar-chart.png" },
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Raag Module",
        description: "Introduction to classical ragas",
        progress: 75,
        topics: [
          {
            id: "mt3",
            name: "Raag Yaman",
            resources: [
              { id: "r5", title: "Raag Yaman Demonstration", type: "video", url: "/resources/yaman-demo.mp4" },
              { id: "r6", title: "Yaman Bandish Audio", type: "audio", url: "/resources/yaman-bandish.mp3" },
              { id: "r7", title: "Raag Notes", type: "document", url: "/resources/yaman-notes.pdf" },
            ]
          }
        ]
      }
    ],
    classes: [
      {
        id: "c1",
        date: "2024-01-08",
        time: "4:00 PM",
        status: "completed",
        instructorNotes: "Good progress on swar practice. Focus more on breath control.",
        recordingUrl: "/recordings/class-1.mp4",
        canReschedule: false
      },
      {
        id: "c2",
        date: "2024-01-15",
        time: "4:00 PM",
        status: "upcoming",
        instructorNotes: "We will cover Raag Bhairav basics",
        canReschedule: true
      },
      {
        id: "c3",
        date: "2024-01-22",
        time: "4:00 PM",
        status: "upcoming",
        canReschedule: true
      }
    ]
  },
  {
    id: "2",
    name: "Intermediate Tabla",
    artform: "Tabla",
    instructor: "Amit Sharma",
    thumbnail: "/lovable-uploads/d6611337-cc02-4c75-aa6b-b072423de40d.png",
    progress: 40,
    totalTopics: 15,
    completedTopics: 6,
    nextClassDate: "2024-01-16",
    enrollmentDate: "2023-11-15",
    status: "active",
    topics: [
      { id: "t13", name: "Basic Strokes", completed: true, category: "Fundamentals" },
      { id: "t14", name: "Teentaal Composition", completed: true, category: "Compositions" },
      { id: "t15", name: "Dadra Taal", completed: true, category: "Taals" },
      { id: "t16", name: "Kaida Practice", completed: true, category: "Compositions" },
      { id: "t17", name: "Rupak Taal", completed: true, category: "Taals" },
      { id: "t18", name: "Jhaptaal", completed: true, category: "Taals" },
      { id: "t19", name: "Advanced Kaidas", completed: false, category: "Compositions" },
      { id: "t20", name: "Tukda Compositions", completed: false, category: "Compositions" },
      { id: "t21", name: "Accompaniment Techniques", completed: false, category: "Application" },
    ],
    modules: [
      {
        id: "m3",
        title: "Basic Strokes & Rhythms",
        description: "Fundamental tabla techniques",
        progress: 80,
        topics: [
          {
            id: "mt4",
            name: "Hand Positions",
            resources: [
              { id: "r8", title: "Hand Position Guide", type: "image", url: "/resources/hand-positions.jpg" },
              { id: "r9", title: "Technique Video", type: "video", url: "/resources/hand-technique.mp4" },
            ]
          }
        ]
      }
    ],
    classes: [
      {
        id: "c4",
        date: "2024-01-09",
        time: "6:00 PM",
        status: "completed",
        instructorNotes: "Excellent work on basic strokes. Ready for intermediate level.",
        recordingUrl: "/recordings/tabla-class-1.mp4",
        canReschedule: false
      },
      {
        id: "c5",
        date: "2024-01-16",
        time: "6:00 PM",
        status: "upcoming",
        instructorNotes: "Advanced kaida compositions will be covered",
        canReschedule: true
      }
    ]
  }
];

export const getStudentCourse = (courseId: string): StudentCourse | undefined => {
  return studentCourses.find(course => course.id === courseId);
};

export const getStudentCourseTopics = (courseId: string): StudentCourseTopic[] => {
  const course = getStudentCourse(courseId);
  return course?.topics || [];
};

export const getStudentCourseModules = (courseId: string): StudentCourseModule[] => {
  const course = getStudentCourse(courseId);
  return course?.modules || [];
};

export const getStudentCourseClasses = (courseId: string): StudentCourseClass[] => {
  const course = getStudentCourse(courseId);
  return course?.classes || [];
};
