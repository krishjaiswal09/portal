
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { mockStudents } from "@/data/studentData";
import { Student } from "@/types/student";

interface StudentSelectorProps {
  selectedStudents: string[];
  onStudentsChange: (studentIds: string[]) => void;
  category?: string;
  maxStudents?: number;
}

export function StudentSelector({ selectedStudents, onStudentsChange, category, maxStudents }: StudentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || student.categories.includes(category);
    return matchesSearch && matchesCategory;
  });

  const selectedStudentObjects = mockStudents.filter(student => 
    selectedStudents.includes(student.id)
  );

  const toggleStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      onStudentsChange(selectedStudents.filter(id => id !== studentId));
    } else {
      // Check if we've reached the maximum number of students
      if (maxStudents && selectedStudents.length >= maxStudents) {
        return; // Don't add more students if we've reached the limit
      }
      onStudentsChange([...selectedStudents, studentId]);
    }
  };

  const removeStudent = (studentId: string) => {
    onStudentsChange(selectedStudents.filter(id => id !== studentId));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Select Students</Label>
        {maxStudents && (
          <span className="text-sm text-muted-foreground">
            {selectedStudents.length}/{maxStudents} selected
          </span>
        )}
      </div>
      
      {/* Selected Students */}
      {selectedStudentObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStudentObjects.map(student => (
            <Badge key={student.id} variant="secondary" className="px-3 py-1">
              {student.name}
              <Button
                type="button"
                onClick={() => removeStudent(student.id)}
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="pl-10"
        />
      </div>

      {/* Student Dropdown */}
      {showDropdown && (
        <div className="border rounded-md bg-card max-h-60 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No students found
            </div>
          ) : (
            <div className="p-2">
              {filteredStudents.map(student => {
                const isSelected = selectedStudents.includes(student.id);
                const isDisabled = maxStudents && selectedStudents.length >= maxStudents && !isSelected;
                
                return (
                  <div
                    key={student.id}
                    className={`flex items-center space-x-3 p-2 rounded-sm cursor-pointer ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
                    }`}
                    onClick={() => !isDisabled && toggleStudent(student.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => {}}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.email} • {student.level}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showDropdown && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => setShowDropdown(false)}
            variant="outline"
            size="sm"
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
}
