import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { ClassType } from "@/types/classType";
import { FamilyMember } from "@/types/familyCredit";
import { useToast } from "@/hooks/use-toast";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyName: string;
  familyId?: string | number;
  onAddTransaction: (transaction: any) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  familyName,
  familyId,
  onAddTransaction,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    date: new Date(),
    studentName: "",
    activity: "",
    quantity: 1,
    comments: "",
    classType: "",
  });

  const studentsQuery = useQuery({
    queryKey: ["familyStudents", familyId],
    queryFn: () =>
      fetchApi<{ users: any[] }>({
        path: `family/${familyId}`,
        method: "GET",
      }),
    enabled: !!familyId && isOpen,
  });

  const selectedStudent = studentsQuery?.data?.users?.find(
    (s) => `${s.first_name} ${s.last_name}` === formData.studentName
  );

  const { data: studentClassTypes } = useQuery({
    queryKey: ["studentsClass-types", selectedStudent?.id],
    queryFn: () =>
      fetchApi({
        path: `family/by-user/${selectedStudent?.id}`,
      }),
    enabled: !!selectedStudent?.id,
  });

  const classTypesData = studentClassTypes?.class_types || [];

  const clearFormData = () => {
    setFormData({
      date: new Date(),
      studentName: "",
      activity: "",
      quantity: 1,
      comments: "",
      classType: "",
    });
  };

  const addTransactionMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi({
        path: "student-credit-history",
        method: "POST",
        data: payload,
      }),
    onSuccess: () => {
      toast({
        title: "Transaction Added",
        description: "Transaction has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["studentsClass-types"] });
      queryClient.invalidateQueries({ queryKey: ["familyStudents"] });
      queryClient.invalidateQueries({ queryKey: ["getTransactionHistory"] });
      onAddTransaction(formData);
      onClose();
      clearFormData();
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Transaction",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const activityOptions = [
    { value: "class_joined", label: "Class Joined" },
    { value: "class_missed", label: "Class Missed" },
    { value: "free_credit", label: "Free Credit" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedClassType = classTypesData?.find(
      (ct) => ct.name === formData.classType
    );
    const student = studentsQuery?.data?.users?.find(
      (s) => `${s.first_name} ${s.last_name}` === formData.studentName
    );

    const payload = {
      student_id: student?.id,
      class_type: selectedClassType?.id,
      credit: formData.quantity,
      activity: formData.activity,
      comment: formData.comments,
      date: format(formData.date, "yyyy-MM-dd"),
    };

    addTransactionMutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        clearFormData();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction - {familyName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Student Name *</Label>
            <Select
              value={formData.studentName}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, studentName: value }))
              }
              disabled={studentsQuery.isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    studentsQuery.isLoading
                      ? "Loading students..."
                      : "Select student"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {studentsQuery?.data?.users?.map((student) => (
                  <SelectItem
                    key={student.id}
                    value={`${student.first_name} ${student.last_name}`}
                  >
                    {student.first_name} {student.last_name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Class Type *</Label>
            <Select
              value={formData.classType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, classType: value }))
              }
              disabled={!selectedStudent}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedStudent
                      ? "Select student first"
                      : "Select class type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {classTypesData?.length === 0 ? (
                  <SelectItem value="no-types" disabled>
                    No class types available
                  </SelectItem>
                ) : (
                  classTypesData?.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name || type.class_type || "Unknown Type"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) =>
                    date && setFormData((prev) => ({ ...prev, date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Activity *</Label>
            <Select
              value={formData.activity}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, activity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {activityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Credit *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 1,
                }))
              }
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comments: e.target.value }))
              }
              placeholder="Enter comments"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addTransactionMutation.isPending}
            >
              {addTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};