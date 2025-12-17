
export function formatStudentDisplay(students: string | string[] | undefined): string {
  if (!students) return 'No students';
  
  if (typeof students === 'string') {
    return students;
  }
  
  if (Array.isArray(students)) {
    // Return only the first student name
    return students[0] || 'No students';
  }
  
  return 'No students';
}

export function getStudentCount(students: string | string[] | undefined): number {
  if (!students) return 0;
  
  if (typeof students === 'string') {
    return 1;
  }
  
  if (Array.isArray(students)) {
    return students.length;
  }
  
  return 0;
}
