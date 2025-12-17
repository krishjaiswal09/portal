import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User } from "./mockData";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
  familyName: string;
  onAddMembers: (familyId: string, students: any[]) => void;
  existingUsers: User[];
  alreadyAddedUsers: any;
  getFamiliesDataMutation: any
}

export function AddFamilyMemberModal({
  isOpen,
  onClose,
  familyId,
  familyName,
  onAddMembers,
  existingUsers,
  getFamiliesDataMutation,
  alreadyAddedUsers,
}: AddFamilyMemberModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const studentsDataMutation = useQuery({
    queryKey: ["studentsdata", isOpen],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=student",
      }),
    enabled: isOpen,
  });

  const updateFamilyMutation = useMutation({
    mutationFn: (payload: {
      name?: string;
      discount_percentage?: number;
      class_type?: number[];
      auto_payment?: boolean;
      users?: number[];
    }) =>
      fetchApi<{ data: any }>({
        path: `family/${familyId}`,
        method: "PATCH",
        data: payload,
      }),
    onSuccess: () => {
      getFamiliesDataMutation.refetch()
    }
  });

  const allStudents = studentsDataMutation?.data?.data;

  // Filter for students only - show students not already in a family
  const availableStudents =
    allStudents?.filter(
      (user) => user.roles.includes("student") && !user.family_id // Only show students not already in a family
    ) || [];

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one student to add",
        variant: "destructive",
      });
      return;
    }
    const studentUsers = availableStudents.filter((s) =>
      selectedStudents.includes(s.id)
    );
    const alreadyThereStudents = alreadyAddedUsers?.users?.map(
      (user: any) => user.id
    );
    const allUsers = [
      ...alreadyThereStudents,
      ...selectedStudents.map((id) => Number(id)),
    ];
    const payload = {
      name: alreadyAddedUsers?.name!,
      discount_percentage: alreadyAddedUsers?.discount_percentage,
      class_type: alreadyAddedUsers?.class_type,
      auto_payment: alreadyAddedUsers?.auto_payment,
      users: allUsers,
    };
    updateFamilyMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Added ${selectedStudents.length} member(s) to ${familyName}!`,
        });
        getFamiliesDataMutation.refetch()
        onAddMembers(
          familyId,
          studentUsers.map((student) => ({
            name: `${student.first_name} ${student.last_name}`,
            email: student.email,
            ageType: student.age_type,
            roles: student.roles,
          }))
        );
        queryClient.invalidateQueries({ queryKey: ["getFamiliesData"] });
        setSelectedStudents([]);
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error?.message || "Failed to add members to the family.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Members to {familyName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Select Students to Add</Label>
            {availableStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto border rounded-lg p-4">
                {availableStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <Label
                      htmlFor={student.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {student.first_name} {student.last_name} (
                      {student.age_type})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No available students to add. All students are already assigned
                to families.
              </p>
            )}
            {selectedStudents.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedStudents.length} student(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={selectedStudents.length === 0}>
              Add Members
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
