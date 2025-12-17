
import { create } from 'zustand';
import { Demo, mockDemos } from '@/data/demoData';

interface DemoFilters {
  search: string;
  instructor: string;
  artForm: string;
  demoType: string;
  startDate: string;
  endDate: string;
}

interface DemoStore {
  demos: Demo[];
  filters: DemoFilters;
  selectedDemos: string[];
  setFilters: (filters: Partial<DemoFilters>) => void;
  getFilteredDemos: () => Demo[];
  toggleDemoSelection: (demoId: string) => void;
  selectAllDemos: (select: boolean) => void;
  deleteDemo: (demoId: string) => void;
  bulkCancelDemos: (demoIds: string[]) => void;
  updateDemo: (demoId: string, updates: Partial<Demo>) => void;
  addDemo: (demo: Omit<Demo, 'id'>) => void;
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  demos: mockDemos,
  filters: {
    search: '',
    instructor: '',
    artForm: '',
    demoType: '',
    startDate: '',
    endDate: '',
  },
  selectedDemos: [],
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  getFilteredDemos: () => {
    const { demos, filters } = get();
    return demos.filter((demo) => {
      const matchesSearch = !filters.search || 
        demo.studentNames.some(name => name.toLowerCase().includes(filters.search.toLowerCase())) ||
        demo.instructor.toLowerCase().includes(filters.search.toLowerCase()) ||
        demo.artForm.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesInstructor = !filters.instructor || demo.instructor === filters.instructor;
      const matchesArtForm = !filters.artForm || demo.artForm === filters.artForm;
      const matchesDemoType = !filters.demoType || demo.demoType === filters.demoType;
      
      let matchesDateRange = true;
      if (filters.startDate && filters.endDate) {
        const demoDate = new Date(demo.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        matchesDateRange = demoDate >= startDate && demoDate <= endDate;
      }

      return matchesSearch && matchesInstructor && matchesArtForm && matchesDemoType && matchesDateRange;
    });
  },

  toggleDemoSelection: (demoId) =>
    set((state) => ({
      selectedDemos: state.selectedDemos.includes(demoId)
        ? state.selectedDemos.filter(id => id !== demoId)
        : [...state.selectedDemos, demoId],
    })),

  selectAllDemos: (select) =>
    set((state) => ({
      selectedDemos: select ? state.demos.map(demo => demo.id) : [],
    })),

  deleteDemo: (demoId) =>
    set((state) => ({
      demos: state.demos.filter(demo => demo.id !== demoId),
      selectedDemos: state.selectedDemos.filter(id => id !== demoId),
    })),

  bulkCancelDemos: (demoIds) =>
    set((state) => ({
      demos: state.demos.map(demo => 
        demoIds.includes(demo.id) 
          ? { ...demo, status: 'Cancelled' as const }
          : demo
      ),
      selectedDemos: [],
    })),

  updateDemo: (demoId, updates) =>
    set((state) => ({
      demos: state.demos.map(demo =>
        demo.id === demoId ? { ...demo, ...updates } : demo
      ),
    })),

  addDemo: (demoData) =>
    set((state) => ({
      demos: [
        ...state.demos,
        {
          ...demoData,
          id: Date.now().toString(),
        },
      ],
    })),
}));
