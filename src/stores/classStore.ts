import { create } from "zustand";
import { Class, type ClassFilters } from "@/types/class";

interface ClassStore {
  classes: Class[];
  filters: ClassFilters;
  isModalOpen: boolean;
  editingClass: Class | undefined;

  // Actions
  setClasses: (classes: Class[]) => void;
  addClass: (classData: Omit<Class, "id">) => void;
  updateClass: (id: string, classData: Omit<Class, "id">) => void;
  deleteClass: (id: string) => void;
  setFilters: (filters: ClassFilters) => void;
  setModalOpen: (isOpen: boolean) => void;
  setEditingClass: (classItem: Class | undefined) => void;
  // Computed
  getFilteredClasses: () => Class[];
}

export const useClassStore = create<ClassStore>((set, get) => ({
  classes: [],
  filters: {
    search: "",
    instructor: "all",
    category: "all",
    type: "all",
    status: "all",
    startDate: "",
    endDate: "",
  },
  isModalOpen: false,
  editingClass: undefined,

  setClasses: (classes) => set({ classes }),

  addClass: (classData) =>
    set((state) => ({
      classes: [
        {
          ...classData,
          id: Date.now().toString(),
        },
        ...state.classes,
      ],
    })),

  updateClass: (id, classData) =>
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === id ? { ...classData, id } : c
      ),
    })),

  deleteClass: (id) =>
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    })),

  setFilters: (filters) => set({ filters }),

  setModalOpen: (isModalOpen) => set({ isModalOpen }),

  setEditingClass: (editingClass) => set({ editingClass }),

  getFilteredClasses: () => {
    const { classes, filters } = get();
    return classes.filter((classItem) => {
      const matchesSearch =
        classItem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        classItem.instructor
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesInstructor =
        filters.instructor === "all" ||
        classItem.instructor === filters.instructor;
      const matchesCategory =
        filters.category === "all" || classItem.category === filters.category;
      const matchesType =
        filters.type === "all" || classItem.type === filters.type;
      const matchesStatus =
        filters.status === "all" || classItem.status === filters.status;

      return (
        matchesSearch &&
        matchesInstructor &&
        matchesCategory &&
        matchesType &&
        matchesStatus
      );
    });
  },
}));
