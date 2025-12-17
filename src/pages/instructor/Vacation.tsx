import React, { useState } from "react";
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Calendar, Plus, Edit, Trash2, Eye } from "lucide-react";
import { ImpactedClassesModal } from "@/components/instructor/ImpactedClassesModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ImpactedClass {
  id: number;
  start_date: string;
  start_time: string;
  end_time: string;
  title: string;
  course: number;
  class_type: number;
  student?: any;
  group?: any;
}

interface VacationRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  created_at: string;
  impactedClass: ImpactedClass[];
  impactedClassCount: number;
  teacherFirstName: string;
  teacherLastName: string;
}

export default function Vacation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newRequest, setNewRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImpactedClassesModalOpen, setIsImpactedClassesModalOpen] =
    useState(false);
  const [selectedVacation, setSelectedVacation] =
    useState<VacationRequest | null>(null);
  const [editRequest, setEditRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const {
    data: vacationData,
    isLoading: isVacationLoading,
    error: vacationError,
  } = useQuery({
    queryKey: ["vacation"],
    queryFn: () =>
      fetchApi<VacationRequest[]>({
        path: `vacation/teacher/${user?.id}`,
      }),
  });

  const createVacationMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi({
        path: "vacation",
        method: "POST",
        data: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacation"] });
      setNewRequest({ startDate: "", endDate: "", reason: "" });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Vacation request submitted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          "Failed to submit vacation request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteVacationMutation = useMutation({
    mutationFn: (id: number) =>
      fetchApi({
        path: `vacation/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacation"] });
      toast({
        title: "Success",
        description: "Vacation request cancelled successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          "Failed to cancel vacation request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateVacationMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      fetchApi({
        path: `vacation/${id}`,
        method: "PATCH",
        data: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacation"] });
      setEditRequest({ startDate: "", endDate: "", reason: "" });
      setIsEditDialogOpen(false);
      setSelectedVacation(null);
      toast({
        title: "Success",
        description: "Vacation request updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          "Failed to update vacation request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const truncateReason = (reason: string, wordLimit: number = 15) => {
    const words = reason.split(" ");
    if (words.length <= wordLimit) return reason;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const payload = {
      teacher: user.id,
      startDate: new Date(newRequest.startDate).toISOString(),
      endDate: new Date(newRequest.endDate).toISOString(),
      reason: newRequest.reason,
    };

    createVacationMutation.mutate(payload);
  };

  const handleViewImpactedClasses = (vacation: VacationRequest) => {
    setSelectedVacation(vacation);
    setIsImpactedClassesModalOpen(true);
  };

  const handleCancelRequest = (id: number) => {
    if (
      window.confirm("Are you sure you want to cancel this vacation request?")
    ) {
      deleteVacationMutation.mutate(id);
    }
  };

  const handleEditRequest = (vacation: VacationRequest) => {
    setSelectedVacation(vacation);
    setEditRequest({
      startDate: new Date(vacation.startDate).toISOString().split("T")[0],
      endDate: new Date(vacation.endDate).toISOString().split("T")[0],
      reason: vacation.reason,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedVacation) return;

    const payload = {
      teacher: user.id,
      startDate: new Date(editRequest.startDate).toISOString(),
      endDate: new Date(editRequest.endDate).toISOString(),
      reason: editRequest.reason,
    };

    updateVacationMutation.mutate({ id: selectedVacation.id, payload });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isVacationLoading) return <div>Loading...</div>;
  if (vacationError) return <div>Error loading vacation data</div>;

  return (
    <InstructorDashboardLayout title="Vacation Requests">
      <div className="space-y-6">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-playfair font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vacation Management
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Request time off and manage your vacation schedule
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Vacation Time</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newRequest.startDate}
                        onChange={(e) =>
                          setNewRequest({
                            ...newRequest,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newRequest.endDate}
                        onChange={(e) =>
                          setNewRequest({
                            ...newRequest,
                            endDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide a reason for your vacation request..."
                      value={newRequest.reason}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, reason: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={createVacationMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={createVacationMutation.isPending}
                    >
                      {createVacationMutation.isPending
                        ? "Submitting..."
                        : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Impacted Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vacationData?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {new Date(request.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {truncateReason(request.reason)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-600 hover:text-blue-800"
                          onClick={() => handleViewImpactedClasses(request)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {request.impactedClassCount} classes
                        </Button>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status.toLowerCase() === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRequest(request)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleCancelRequest(request.id)}
                                disabled={deleteVacationMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {deleteVacationMutation.isPending
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Vacation Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Vacation Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartDate">Start Date</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={editRequest.startDate}
                    onChange={(e) =>
                      setEditRequest({
                        ...editRequest,
                        startDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndDate">End Date</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={editRequest.endDate}
                    onChange={(e) =>
                      setEditRequest({
                        ...editRequest,
                        endDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editReason">Reason</Label>
                <Textarea
                  id="editReason"
                  placeholder="Please provide a reason for your vacation request..."
                  value={editRequest.reason}
                  onChange={(e) =>
                    setEditRequest({ ...editRequest, reason: e.target.value })
                  }
                  required
                />
              </div>

              {/* Impacted Classes Section */}
              {selectedVacation &&
                selectedVacation.impactedClass.length > 0 && (
                  <div className="space-y-2">
                    <Label>Impacted Classes</Label>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Date</TableHead>
                            <TableHead className="text-xs">Time</TableHead>
                            <TableHead className="text-xs">Title</TableHead>
                            <TableHead className="text-xs">
                              Student/Group
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedVacation.impactedClass.map((classItem) => (
                            <TableRow key={classItem.id}>
                              <TableCell className="text-xs">
                                {new Date(
                                  classItem.start_date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-xs">
                                {classItem.start_time} - {classItem.end_time}
                              </TableCell>
                              <TableCell className="text-xs">
                                {classItem.title}
                              </TableCell>
                              <TableCell className="text-xs">
                                {classItem.student
                                  ? "Individual"
                                  : classItem.group
                                  ? "Group"
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateVacationMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={updateVacationMutation.isPending}
                >
                  {updateVacationMutation.isPending
                    ? "Updating..."
                    : "Update Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Impacted Classes Modal */}
        {selectedVacation && (
          <ImpactedClassesModal
            isOpen={isImpactedClassesModalOpen}
            onClose={() => {
              setIsImpactedClassesModalOpen(false);
              setSelectedVacation(null);
            }}
            impactedClasses={selectedVacation.impactedClass}
            vacationPeriod={`${new Date(
              selectedVacation.startDate
            ).toLocaleDateString()} - ${new Date(
              selectedVacation.endDate
            ).toLocaleDateString()}`}
          />
        )}
      </div>
    </InstructorDashboardLayout>
  );
}
