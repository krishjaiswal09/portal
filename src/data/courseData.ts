import { Course, CourseCategory, CourseSubcategory, CourseStatus, Artform, COURSE_CATEGORIES } from "@/types/course";

export const mockCategories: CourseCategory[] = [
  {
    id: 'cat-1',
    name: 'Classical Music',
    description: 'Traditional Indian classical music forms',
    color: '#8B5CF6',
    icon: 'Music',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'cat-2', 
    name: 'Classical Dance',
    description: 'Traditional Indian classical dance forms',
    color: '#EF4444',
    icon: 'Dance',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'cat-3',
    name: 'Instrumental Music',
    description: 'Classical and traditional instrumental music',
    color: '#10B981',
    icon: 'Guitar',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const mockSubcategories: CourseSubcategory[] = [
  {
    id: 'subcat-1-1',
    name: 'Hindustani Vocal',
    description: 'North Indian classical vocal tradition',
    categoryId: 'cat-1',
    color: '#8B5CF6',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'subcat-1-2',
    name: 'Carnatic Vocal',
    description: 'South Indian classical vocal tradition',
    categoryId: 'cat-1',
    color: '#8B5CF6',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'subcat-2-1',
    name: 'Temple Dance Forms',
    description: 'Traditional temple-based dance forms',
    categoryId: 'cat-2',
    color: '#EF4444',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'subcat-2-2',
    name: 'Court Dance Forms',
    description: 'Classical dance forms from royal courts',
    categoryId: 'cat-2',
    color: '#EF4444',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'subcat-3-1',
    name: 'String Instruments',
    description: 'Classical string instruments',
    categoryId: 'cat-3',
    color: '#10B981',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'subcat-3-2',
    name: 'Percussion Instruments',
    description: 'Classical percussion instruments',
    categoryId: 'cat-3',
    color: '#10B981',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const mockCourses: Course[] = [
  {
    id: "course-1",
    name: "Complete Bharatanatyam Journey",
    artform: Artform.BHARATANATYAM,
    categoryId: 'cat-2',
    subcategoryId: 'subcat-2-1',
    category: mockCategories[1],
    subcategory: mockSubcategories.find(s => s.id === 'subcat-2-1'),
    description: "A comprehensive course covering all aspects of Bharatanatyam from basic postures to advanced choreography. Students will learn traditional items, abhinaya, and stage performance techniques.",
    thumbnail: "/placeholder.svg",
    introductionVideoUrl: "https://example.com/bharatanatyam-intro",
    instructors: ["Priya Sharma", "Meera Singh"],
    status: CourseStatus.PUBLISHED,
    totalStudents: 45,
    topicsCovered: [
      "Basic Postures and Positions",
      "Hand Gestures (Mudras)",
      "Facial Expressions (Abhinaya)",
      "Traditional Items",
      "Stage Performance",
      "Costume and Makeup",
      "Music and Rhythm"
    ],
    topics: [
      {
        id: "topic-1-1",
        courseId: "course-1",
        title: "Foundation Techniques",
        description: "Master the basic postures, positions, and fundamental movements of Bharatanatyam",
        order: 1,
        subtopics: [
          {
            id: "subtopic-1-1-1",
            topicId: "topic-1-1",
            title: "Basic Postures (Araimandi)",
            description: "Learn the fundamental sitting position and basic stances",
            order: 1,
            resources: [
              {
                id: "resource-1-1-1-1",
                name: "Araimandi Tutorial Video",
                type: "video",
                url: "#",
                description: "Step-by-step guide to perfect Araimandi position",
                createdAt: "2024-01-01"
              },
              {
                id: "resource-1-1-1-2",
                name: "Posture Practice Audio",
                type: "audio",
                url: "#",
                description: "Practice rhythm for posture training",
                createdAt: "2024-01-01"
              }
            ],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01"
          },
          {
            id: "subtopic-1-1-2",
            topicId: "topic-1-1",
            title: "Hand Gestures (Mudras)",
            description: "Introduction to basic hand gestures and their meanings",
            order: 2,
            resources: [
              {
                id: "resource-1-1-2-1",
                name: "Mudra Reference Chart",
                type: "image",
                url: "#",
                description: "Visual guide to all basic mudras",
                createdAt: "2024-01-01"
              }
            ],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01"
          }
        ],
        resources: [
          {
            id: "resource-1-1",
            name: "Foundation Module Overview",
            type: "document",
            url: "#",
            description: "Complete overview of foundation techniques",
            createdAt: "2024-01-01"
          }
        ],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      },
      {
        id: "topic-1-2",
        courseId: "course-1",
        title: "Traditional Items & Performance",
        description: "Learn classical compositions and stage performance techniques",
        order: 2,
        subtopics: [
          {
            id: "subtopic-1-2-1",
            topicId: "topic-1-2",
            title: "Alarippu",
            description: "Master the traditional opening piece",
            order: 1,
            resources: [
              {
                id: "resource-1-2-1-1",
                name: "Alarippu Choreography",
                type: "video",
                url: "#",
                createdAt: "2024-01-01"
              }
            ],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01"
          }
        ],
        resources: [],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      }
    ],
    learningOutcomes: [
      "Master fundamental Bharatanatyam positions and movements",
      "Perform traditional dance sequences with confidence",
      "Express stories through dance and facial expressions",
      "Understand the cultural significance of Bharatanatyam"
    ],
    objectives: [
      "Develop physical flexibility and strength",
      "Learn traditional repertoire",
      "Build stage presence and confidence",
      "Understand classical music and rhythm"
    ],
    createdAt: "2024-12-01",
    updatedAt: "2025-01-10",
    modules: [
      {
        id: "module-1-1",
        courseId: "course-1",
        title: "Foundation Level",
        description: "Basic postures, hand gestures, and fundamental movements",
        duration: "3 months",
        objectives: "Master basic positions and movements of Bharatanatyam",
        order: 1,
        status: 'published',
        createdAt: "2024-12-01",
        updatedAt: "2025-01-10",
        notes: [
          {
            id: "note-1-1-1",
            moduleId: "module-1-1",
            title: "Introduction to Aramandi",
            content: "Basic sitting position in Bharatanatyam",
            type: 'text',
            order: 1,
            createdAt: "2024-12-01",
            updatedAt: "2025-01-10"
          }
        ]
      },
      {
        id: "module-1-2", 
        courseId: "course-1",
        title: "Intermediate Level",
        description: "Introduction to traditional items and basic abhinaya",
        duration: "6 months",
        objectives: "Learn traditional repertoire and expression techniques",
        order: 2,
        status: 'published',
        createdAt: "2024-12-01",
        updatedAt: "2025-01-10",
        notes: []
      }
    ]
  },
  {
    id: "course-2",
    name: "Hindustani Classical Vocal",
    artform: Artform.HINDUSTANI_VOCAL,
    categoryId: 'cat-1',
    subcategoryId: 'subcat-1-1',
    category: mockCategories[0],
    subcategory: mockSubcategories.find(s => s.id === 'subcat-1-1'),
    description: "Learn the rich tradition of Hindustani classical music from basic scales to complex ragas and compositions.",
    thumbnail: "/placeholder.svg",
    introductionVideoUrl: "https://example.com/hindustani-intro",
    instructors: ["Ravi Kumar"],
    status: CourseStatus.PUBLISHED,
    totalStudents: 32,
    topicsCovered: [
      "Basic Scales (Sargam)",
      "Breathing Techniques",
      "Raga Introduction",
      "Tala and Rhythm",
      "Classical Compositions",
      "Improvisation Techniques"
    ],
    topics: [],
    learningOutcomes: [
      "Develop proper vocal techniques and breathing",
      "Understand and perform basic ragas",
      "Sing classical compositions with proper rhythm",
      "Appreciate the depth of Hindustani classical music"
    ],
    objectives: [
      "Build strong vocal foundation",
      "Learn traditional teaching methods",
      "Develop ear for classical music",
      "Understand music theory basics"
    ],
    createdAt: "2024-11-15",
    updatedAt: "2025-01-08",
    modules: [
      {
        id: "module-2-1",
        courseId: "course-2",
        title: "Beginner",
        description: "Basic scales, breathing techniques, and simple ragas",
        duration: "4 months",
        objectives: "Develop vocal foundation and basic raga understanding",
        order: 1,
        status: 'published',
        createdAt: "2024-11-15",
        updatedAt: "2025-01-08",
        notes: []
      }
    ]
  },
  {
    id: "course-3",
    name: "Sitar Mastery Program",
    artform: Artform.SITAR,
    categoryId: 'cat-3',
    subcategoryId: 'subcat-3-1',
    category: mockCategories[2],
    subcategory: mockSubcategories.find(s => s.id === 'subcat-3-1'),
    description: "Complete sitar training from basic finger positions to advanced techniques and classical compositions.",
    thumbnail: "/placeholder.svg",
    introductionVideoUrl: "https://example.com/sitar-intro",
    instructors: ["Amit Patel"],
    status: CourseStatus.PUBLISHED,
    totalStudents: 18,
    topicsCovered: [
      "Sitar Anatomy and Tuning",
      "Basic Finger Positions",
      "Plucking Techniques",
      "Meend and Gamak",
      "Classical Ragas on Sitar",
      "Advanced Performance Techniques"
    ],
    topics: [],
    learningOutcomes: [
      "Master basic sitar playing techniques",
      "Perform classical compositions on sitar",
      "Understand sitar's role in classical music",
      "Develop personal playing style"
    ],
    objectives: [
      "Learn proper sitting posture and hand positions",
      "Develop finger strength and dexterity",
      "Understand classical music through instrumental practice",
      "Build repertoire of classical pieces"
    ],
    createdAt: "2024-10-20",
    updatedAt: "2025-01-05",
    modules: []
  }
];

export const artforms = Object.values(Artform);

export const courseCategories = Object.values(COURSE_CATEGORIES);
