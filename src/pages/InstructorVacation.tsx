import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plane,
  Calendar,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { ImpactedClassesModal } from "@/components/instructor-management/ImpactedClassesModal";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "@/utils/checkPermission";
import { SectionLoader, InlineLoader } from "@/components/ui/loader";

const InstructorVacation = () => {
  const navigate = useNavigate();

  if (!hasPermission("HAS_READ_VACATION")) {
    return (
      <DashboardLayout title="No Permission">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [impactedClasses, setImpactedClasses] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingVacation, setEditingVacation] = useState<any>(null);
  const [showImpactedClassesModal, setShowImpactedClassesModal] =
    useState(false);
  const [selectedVacationForClasses, setSelectedVacationForClasses] =
    useState<any>(null);

  const queryClient = useQueryClient();

  const {
    data: vacationData,
    isLoading: isVacationLoading,
    error: vacationError,
  } = useQuery({
    queryKey: ["vacation"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "vacation",
      }),
  });

  const { data: instrcutorDataMutation, isLoading: isInstructorLoading } = useQuery({
    queryKey: ["instrcutorData"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=instructor",
      }),
  });

  const vacationMutation = useMutation({
    mutationFn: async (payload: any) => {
      return fetchApi({
        path: "vacation",
        method: "POST",
        data: payload,
      });
    },
  });

  const editVacationMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number | string;
      payload: any;
    }) => {
      return fetchApi({
        path: `vacation/${id}`,
        method: "PATCH",
        data: payload,
      });
    },
  });

  const deleteVacationMutation = useMutation({
    mutationFn: async (id: number | string) => {
      return fetchApi({
        path: `vacation/${id}`,
        method: "DELETE",
      });
    },
  });

  const instructors = instrcutorDataMutation?.data;

  const filteredVacations =
    vacationData?.filter(
      (vacation) =>
        `${vacation.teacherFirstName} ${vacation.teacherLastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vacation.reason.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleAddVacation = () => {
    if (!selectedInstructor || !startDate || !endDate || !reason) {
      toast({
        title: "Failed to submit vacation request.",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const startDateTime = new Date(startDate).toISOString();
    const endDateTime = new Date(endDate).toISOString();
    const payload = {
      teacher: parseInt(selectedInstructor),
      startDate: startDateTime,
      endDate: endDateTime,
      reason: reason,
    };

    if (isEditMode && editingVacation) {
      editVacationMutation.mutate(
        { id: editingVacation.id, payload },
        {
          onSuccess: () => {
            toast({
              title: "Vacation request updated successfully!",
              description:
                "The vacation request has been updated successfully.",
              variant: "default",
            });
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ["vacation"] });
          },
          onError: (error: any) => {
            toast({
              title: "Failed to update vacation request.",
              description: error.message || "Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      vacationMutation.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Vacation request submitted successfully!",
            description:
              "The vacation request has been submitted successfully.",
            variant: "default",
          });
          handleCloseModal();
          queryClient.invalidateQueries({ queryKey: ["vacation"] });
        },
        onError: (error: any) => {
          toast({
            title: "Failed to submit vacation request.",
            description: error.message || "Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleAction = (action: string, vacation: any) => {
    switch (action) {
      case "view":
        console.log("View vacation details:", vacation);
        break;
      case "edit":
        handleEditVacation(vacation);
        break;
      case "delete":
        handleDeleteVacation(vacation);
        break;
    }
  };

  const handleDeleteVacation = (vacation: any) => {
    if (confirm(`Are you sure you want to delete this vacation request?`)) {
      deleteVacationMutation.mutate(vacation.id, {
        onSuccess: () => {
          toast({
            title: "Vacation request deleted successfully!",
            description: "The vacation request has been deleted successfully.",
            variant: "default",
          });
          queryClient.invalidateQueries({ queryKey: ["vacation"] });
        },
        onError: (error: any) => {
          toast({
            title: "Failed to delete vacation request.",
            description: error.message || "Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleEditVacation = (vacation: any) => {
    setEditingVacation(vacation);
    // Ensure the instructor ID is properly set as a string
    setSelectedInstructor(vacation.teacher?.toString() || "");
    // Format datetime for datetime-local input (YYYY-MM-DDTHH:MM)
    const startDateTime = new Date(vacation.startDate);
    const endDateTime = new Date(vacation.endDate);
    setStartDate(startDateTime.toISOString().slice(0, 16));
    setEndDate(endDateTime.toISOString().slice(0, 16));
    setReason(vacation.reason);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditingVacation(null);
    setSelectedInstructor("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setImpactedClasses([]);
    setShowImpactedClassesModal(false);
    setSelectedVacationForClasses(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <DashboardLayout title="Instructor Vacation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Instructor Vacation
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage instructor vacation requests and view impacted classes
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            {hasPermission("HAS_CREATE_VACATION") && (
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vacation
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  {isEditMode
                    ? "Edit Vacation Request"
                    : "Add Vacation Request"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instructor *</Label>
                    <Select
                      value={selectedInstructor}
                      onValueChange={setSelectedInstructor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors?.map((instructor) => (
                          <SelectItem
                            key={instructor.id}
                            value={instructor.id.toString()}
                          >
                            {instructor.first_name} {instructor.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason *</Label>
                    <Input
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., Family vacation, Medical leave"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date & Time *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Impacted Classes Preview */}
                {startDate && endDate && selectedInstructor && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Impacted Classes
                      </Label>
                      {isEditMode &&
                        editingVacation?.impactedClass?.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVacationForClasses(editingVacation);
                              setShowImpactedClassesModal(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            View All ({editingVacation.impactedClassCount}{" "}
                            classes)
                          </Button>
                        )}
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="space-y-2">
                        {isEditMode &&
                        editingVacation?.impactedClass?.length > 0 ? (
                          editingVacation.impactedClass
                            .slice(0, 2)
                            .map((classItem: any, index: number) => (
                              <div key={index}>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4" />
                                  <span className="font-medium">
                                    {classItem.title || "Class"}
                                  </span>
                                  <Badge variant="outline">
                                    {classItem.studentGroup || "Individual"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6">
                                  {formatDate(classItem.dateTime || startDate)}{" "}
                                  at{" "}
                                  {new Date(
                                    classItem.dateTime || startDate
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No impacted classes found for this vacation period
                          </p>
                        )}
                        {isEditMode &&
                          editingVacation?.impactedClass?.length > 2 && (
                            <p className="text-sm text-muted-foreground italic">
                              ... and {editingVacation.impactedClass.length - 2}{" "}
                              more classes
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={
                      vacationMutation.isPending ||
                      editVacationMutation.isPending
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddVacation}
                    disabled={
                      !selectedInstructor ||
                      !startDate ||
                      !endDate ||
                      !reason ||
                      vacationMutation.isPending ||
                      editVacationMutation.isPending
                    }
                  >
                    {vacationMutation.isPending ||
                    editVacationMutation.isPending ? (
                      <>
                        <InlineLoader size="sm" />
                        <span className="ml-2">
                          {isEditMode ? "Updating..." : "Submitting..."}
                        </span>
                      </>
                    ) : (
                      isEditMode ? "Update Request" : "Submit Request"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        {isInstructorLoading ? (
          <SectionLoader text="Loading instructors..." />
        ) : (
          <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by instructor name or reason"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        )}

        {/* Vacation Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Vacation Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instructor Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Impacted Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isVacationLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading vacation data...
                      </TableCell>
                    </TableRow>
                  ) : vacationError ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-destructive"
                      >
                        Error loading vacation data. Please try again.
                      </TableCell>
                    </TableRow>
                  ) : filteredVacations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No vacation requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVacations.map((vacation) => (
                      <TableRow key={vacation.id}>
                        <TableCell className="font-medium">
                          {vacation.teacherFirstName} {vacation.teacherLastName}
                        </TableCell>
                        <TableCell>{formatDate(vacation.startDate)}</TableCell>
                        <TableCell>{formatDate(vacation.endDate)}</TableCell>
                        <TableCell>{vacation.reason}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto font-normal"
                            onClick={() => {
                              setSelectedVacationForClasses(vacation);
                              setShowImpactedClassesModal(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            {vacation.impactedClassCount} classes
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(vacation.status)}>
                            {vacation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {hasPermission("HAS_READ_VACATION") && (
                                <DropdownMenuItem
                                  onClick={() => handleAction("view", vacation)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              )}
                              {hasPermission("HAS_EDIT_VACATION") && (
                                <DropdownMenuItem
                                  onClick={() => handleAction("edit", vacation)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {hasPermission("HAS_DELETE_VACATION") && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction("delete", vacation)
                                  }
                                  className="text-destructive"
                                  disabled={deleteVacationMutation.isPending}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {deleteVacationMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impacted Classes Modal */}
      {selectedVacationForClasses && (
        <ImpactedClassesModal
          open={showImpactedClassesModal}
          onOpenChange={setShowImpactedClassesModal}
          classes={selectedVacationForClasses.impactedClass || []}
          instructorName={`${selectedVacationForClasses.teacherFirstName} ${selectedVacationForClasses.teacherLastName}`}
          vacationPeriod={{
            startDate: selectedVacationForClasses.startDate,
            endDate: selectedVacationForClasses.endDate,
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default InstructorVacation;
