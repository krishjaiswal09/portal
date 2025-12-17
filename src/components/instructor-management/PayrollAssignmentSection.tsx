import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { PayrollAssignment } from "@/types/instructor";
import { PayrollAssignmentModal } from "./PayrollAssignmentModal";
import { hasPermission } from "@/utils/checkPermission";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface PayrollAssignmentSectionProps {
  instructorId: string;
  assignments?: PayrollAssignment[];
}

export const PayrollAssignmentSection: React.FC<
  PayrollAssignmentSectionProps
> = ({ instructorId, assignments = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<
    PayrollAssignment | undefined
  >();
  const [payrollAssignments, setPayrollAssignments] =
    useState<PayrollAssignment[]>(assignments);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: payrollData } = useQuery<PayrollAssignment[]>({
    queryKey: ["teacher-payroll", instructorId],
    queryFn: () =>
      fetchApi({ path: `teacher-payroll?teacherId=${instructorId}` }),
    enabled: !!instructorId,
  });

  const handleAddAssignment = () => {
    setEditingAssignment(undefined);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: PayrollAssignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (confirm("Are you sure you want to delete this payroll assignment?")) {
      try {
        await fetchApi({
          method: "DELETE",
          path: `teacher-payroll/${assignmentId}`,
        });
        
        toast({
          title: "Payroll Assignment Deleted",
          description: "Payroll assignment deleted successfully!",
          duration: 3000,
        });
        
        queryClient.invalidateQueries({
          queryKey: ["teacher-payroll", instructorId],
        });
      } catch (error: any) {
        toast({
          title: "Error Deleting Payroll Assignment",
          description: error?.message || "Failed to delete payroll assignment",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  const handleSaveAssignment = (
    assignmentData: Omit<PayrollAssignment, "id" | "createdAt" | "updatedAt">
  ) => {
    // Refetch the API data after saving
    queryClient.invalidateQueries({
      queryKey: ["teacher-payroll", instructorId],
    });
  };

  const formatClassType = (classType: string) => {
    switch (classType) {
      case "private-60":
        return "Private 60 min";
      case "private-40":
        return "Private 40 min";
      case "group-60":
        return "Group 60 min";
      default:
        return classType;
    }
  };

  const getGroupTypeBadge = (groupType: string) => {
    return (
      <Badge variant={groupType === "individual" ? "default" : "secondary"}>
        {groupType === "individual" ? "Individual" : "Group"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Default Payroll Assignment
          </CardTitle>
          {hasPermission("HAS_CREATE_PAYROLL") && (
            <Button onClick={handleAddAssignment} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {Array.isArray(payrollData) && payrollData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No payroll assignments configured</p>
            <p className="text-sm">
              Add default payment rates for different class types
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Type</TableHead>
                  <TableHead>Default Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData?.map((assignment: any) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.class_type_name || "N/A"}</TableCell>
                    <TableCell className="font-medium">
                      {parseFloat(assignment.amount).toFixed(2)} | {assignment.currency_name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {hasPermission("HAS_EDIT_PAYROLL") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAssignment(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {hasPermission("HAS_DELETE_PAYROLL") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteAssignment(assignment.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <PayrollAssignmentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSave={handleSaveAssignment}
          assignment={editingAssignment}
          instructorId={instructorId}
        />
      </CardContent>
    </Card>
  );
};
