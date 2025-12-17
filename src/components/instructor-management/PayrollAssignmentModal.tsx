import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { DollarSign } from "lucide-react";
import { PayrollAssignment } from "@/types/instructor";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PayrollAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    assignment: Omit<PayrollAssignment, "id" | "createdAt" | "updatedAt">
  ) => void;
  assignment?: PayrollAssignment;
  instructorId: string;
}

export const PayrollAssignmentModal: React.FC<PayrollAssignmentModalProps> = ({
  open,
  onOpenChange,
  onSave,
  assignment,
  instructorId,
}) => {
  const [formData, setFormData] = useState({
    classType: "" as string,
    defaultAmount: 0,
    currency: "" as string,
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        classType: assignment.class_type?.toString() || "",
        defaultAmount: parseFloat(assignment.amount) || 0,
        currency: assignment.currency?.toString() || "",
      });
    } else {
      setFormData({
        classType: "",
        defaultAmount: 0,
        currency: "",
      });
    }
  }, [assignment]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classTypes = [] } = useQuery({
    queryKey: ["classTypes"],
    queryFn: () => fetchApi<any[]>({ path: "classes/class-type" }),
    enabled: !!open,
  });

  const { data: currency = [] } = useQuery({
    queryKey: ["currency"],
    queryFn: () => fetchApi<any[]>({ path: "currency" }),
    enabled: !!open,
  });

  const handleSave = async () => {
    if (!formData.classType || formData.defaultAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and enter a valid amount",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        teacher: parseInt(instructorId),
        class_type: parseInt(formData.classType),
        amount: formData.defaultAmount,
        currency: parseInt(formData.currency)
      };
      if (assignment) {
        // Edit existing assignment
        await fetchApi({
          method: "PATCH",
          path: `teacher-payroll/${assignment.id}`,
          data: payload,
        });
      } else {
        // Create new assignment
        await fetchApi({
          method: "POST",
          path: "teacher-payroll",
          data: payload,
        });
      }

      toast({
        title: assignment ? "Payroll Assignment Updated" : "Payroll Assignment Saved",
        description: assignment ? "Payroll assignment updated successfully!" : "Payroll assignment saved successfully!",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher-payroll", instructorId],
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: assignment ? "Error Updating Payroll Assignment" : "Error Saving Payroll Assignment",
        description: error?.message || (assignment ? "Failed to update payroll assignment" : "Failed to save payroll assignment"),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      classType: "",
      defaultAmount: 0,
      currency: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            {assignment ? "Edit" : "Add"} Payroll Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classType">Class Type</Label>
            <Select
              value={formData.classType}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, classType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes?.map((classType) => (
                  <SelectItem
                    key={classType.id}
                    value={classType.id.toString()}
                  >
                    {classType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currency?.map((curr) => (
                  <SelectItem
                    key={curr.id}
                    value={curr.id.toString()}
                  >
                    {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultAmount">
              Default Amount {formData.currency ? `(${currency.find(c => c.id.toString() === formData.currency)?.name || ''})` : ""}
            </Label>
            <Input
              id="defaultAmount"
              type="number"
              min="1"
              step="1"
              value={formData.defaultAmount || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  defaultAmount: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="Enter amount"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
              disabled={
                isLoading || !formData.classType || formData.defaultAmount <= 0
              }
            >
              {isLoading 
                ? (assignment ? "Updating..." : "Saving...") 
                : (assignment ? "Update Assignment" : "Save Assignment")
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
