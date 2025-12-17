import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { toast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

interface Group {
  id?: string;
  name: string;
  student_ids?: string[] | number[]; // Changed to string[] for final form
  students?: Student[]; // Added for editing
}

// Internal form state interface
interface GroupFormData {
  id?: string;
  name: string;
  student_ids: Student[]; // Keep as Student[] for form handling
}

interface GroupEditModalProps {
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Group) => void;
}

export const GroupEditModal: React.FC<GroupEditModalProps> = ({
  group,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<GroupFormData>({
    id: "",
    name: "",
    student_ids: [],
  });
  const [studentSearch, setStudentSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const studentsDataMutation = useQuery({
    queryKey: ["studentsdata"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=student",
      }),
  });

  useEffect(() => {
    if (
      studentsDataMutation?.data?.data &&
      Array.isArray(studentsDataMutation?.data?.data)
    ) {
      setStudents(studentsDataMutation?.data?.data);
    }
  }, [studentsDataMutation?.data]);

  useEffect(() => {
    if (group) {
      let selectedStudents: Student[] = [];
      if (Array.isArray(group.students)) {
        selectedStudents = group.students;
      } else if (Array.isArray(group.student_ids)) {
        selectedStudents = group.student_ids
          .map((id: any) => students.find((s) => String(s.id) === String(id)))
          .filter(Boolean) as Student[];
      }
      setFormData({
        id: group.id,
        name: group.name,
        student_ids: selectedStudents,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        student_ids: [],
      });
    }
  }, [group, students]);

  const handleAddStudent = (student: Student) => {
    if (!formData.student_ids?.find((s) => s.id === student.id)) {
      setFormData((prev) => ({
        ...prev,
        student_ids: [...prev.student_ids, student],
      }));
    }
    setStudentSearch("");
    setShowStudentDropdown(false);
  };

  const handleRemoveStudent = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      student_ids: prev.student_ids?.filter((s) => s.id !== studentId),
    }));
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.first_name?.toLowerCase() || "").includes(
        studentSearch.toLowerCase()
      ) ||
      (student.last_name?.toLowerCase() || "").includes(
        studentSearch.toLowerCase()
      ) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        title: "Group Name is required",
        variant: "destructive",
      });
      return;
    }
    const groupToSave: Group = {
      name: formData.name,
      student_ids: formData?.student_ids?.map((s) => Number(s.id)),
    };
    if (group) {
      groupToSave.id = formData.id;
    }
    onSave(groupToSave);
    setFormData({
      id: "",
      name: "",
      student_ids: [],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "Create New Group"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="groupName">
              Group Name
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="groupName"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Students - Searchable Dropdown */}
          <div className="space-y-3">
            <Label>Students</Label>
            <div className="relative">
              <Input
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setShowStudentDropdown(true);
                }}
                onFocus={() => setShowStudentDropdown(true)}
                placeholder="Search students by name or email..."
              />
              {showStudentDropdown && studentSearch && (
                <div className="absolute z-50 top-full mt-1 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => handleAddStudent(student)}
                      >
                        <div>
                          <p className="font-medium">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-muted-foreground">
                      No students found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Students */}
            {formData.student_ids?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Selected Students ({formData.student_ids?.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.student_ids?.map((student) => (
                    <Badge
                      key={student.id}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {/* {student.name} */}
                      {student.first_name} {student.last_name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveStudent(student.id)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {group ? "Update Group" : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
