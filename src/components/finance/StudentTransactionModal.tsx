import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface StudentTransaction {
  id: string;
  date: string;
  studentName: string;
  studentId?: number;
  classType: string;
  classTypeId?: number;
  activity: "class_joined" | "class_missed" | "free_credit";
  credit: number;
  comments: string;
}

interface StudentTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: StudentTransaction | null;
  onSave: (transaction: StudentTransaction) => void;
}

export function StudentTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSave,
}: StudentTransactionModalProps) {
  const mode = transaction ? "edit" : "add";
  const [formData, setFormData] = useState<
    Partial<StudentTransaction & { dateObj: Date }>
  >({});

  // Fetch students
  const { data: studentsData } = useQuery({
    queryKey: ["users", "student"],
    queryFn: () =>
      fetchApi({
        path: "users",
        params: { roles: "student" },
      }),
  });

  const { data: studentClassTypes } = useQuery({
    queryKey: ["studentsClass-types", formData?.studentId],
    queryFn: () =>
      fetchApi({
        path: `family/by-user/${formData?.studentId}`,
      }),
    enabled: !!formData?.studentId,
  });

  const classTypesData: any = studentClassTypes?.class_types || [];

  const students = Array.isArray((studentsData as any)?.data)
    ? (studentsData as any).data
    : [];
  const classTypes = Array.isArray(classTypesData) ? classTypesData : [];

  useEffect(() => {
    if (mode === "edit" && transaction) {
      setFormData({
        ...transaction,
        dateObj: new Date(transaction.date),
      });
    } else if (mode === "add") {
      setFormData({
        studentId: undefined,
        classTypeId: undefined,
        activity: "class_joined",
        credit: 0,
        comments: "",
        dateObj: new Date(),
      });
    }
  }, [transaction, mode, isOpen]);

  const activityOptions = [
    { value: "class_joined", label: "Class Joined" },
    { value: "class_missed", label: "Class Missed" },
    { value: "free_credit", label: "Free Credit" },
  ];

  const handleSave = () => {
    if (
      !formData.studentId ||
      !formData.classTypeId ||
      !formData.dateObj ||
      formData.activity === undefined
    ) {
      return;
    }

    const selectedStudent = students.find(
      (s: any) => s.id === formData.studentId
    );
    const selectedClassType = classTypes.find(
      (ct: any) => ct.id === formData.classTypeId
    );

    const transactionData: StudentTransaction = {
      id: transaction?.id || Date.now().toString(),
      date: formData.dateObj.toISOString().split("T")[0],
      studentName: selectedStudent
        ? `${selectedStudent.first_name || ""} ${
            selectedStudent.last_name || ""
          }`.trim()
        : "",
      studentId: formData.studentId,
      classType:
        selectedClassType?.name ||
        selectedClassType?.class_type ||
        "Unknown Type",
      classTypeId: formData.classTypeId,
      activity: formData.activity as StudentTransaction["activity"],
      credit: formData.credit || 0,
      comments: formData.comments || "",
    };
    onSave(transactionData);
    onClose();
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Student Name
            </label>
            <Select
              value={formData.studentId?.toString() || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, studentId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student: any) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.first_name || ""} {student.last_name || ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Class Type</label>
            {classTypes.length === 0 && (
              <p className="text-xs text-red-500 mb-1">
                No class types available for the selected student.
              </p>
            )}
            <Select
              value={formData.classTypeId?.toString() || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, classTypeId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes?.length === 0 ? (
                  <SelectItem value="no-types" disabled>
                    No class types available
                  </SelectItem>
                ) : (
                  classTypes?.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name || type.class_type || "Unknown Type"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateObj && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateObj
                    ? format(formData.dateObj, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateObj}
                  onSelect={(date) =>
                    setFormData({ ...formData, dateObj: date || new Date() })
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Activity</label>
            <Select
              value={formData.activity || ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  activity: value as StudentTransaction["activity"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {activityOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Credit</label>
            <Input
              type="number"
              step="0.01"
              value={
                formData.credit === undefined ? "" : formData.credit.toString()
              }
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  credit: value === "" ? undefined : parseFloat(value),
                });
              }}
              placeholder="Enter credit amount"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Comments</label>
            <Textarea
              value={formData.comments || ""}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Enter comments"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
