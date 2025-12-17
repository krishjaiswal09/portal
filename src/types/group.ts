
export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[]; // User IDs
  teacherId: string;
  teacherName: string;
  createdDate: string;
  updatedDate: string;
  status: 'active' | 'inactive';
}

export interface GroupFormData {
  name: string;
  description: string;
  members: string[];
  teacherId: string;
}
