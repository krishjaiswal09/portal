import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentCancelRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: (reason: any) => void;
  onReschedule: (data: any) => void;
  classInfo?: any;
}

export function StudentCancelRescheduleModal({
  isOpen,
  onClose,
  onCancel,
  onReschedule,
  classInfo,
}: StudentCancelRescheduleModalProps) {
  const [cancelReason, setCancelReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState<any>("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [activeTab, setActiveTab] = useState<string>("cancel");

  const queryClient = useQueryClient();

  // Determine permissions with defaults
  const canCancel = classInfo?.canCancel ?? true;
  const canReschedule = classInfo?.canReschedule ?? true;

  // Set initial active tab based on permissions
  useEffect(() => {
    if (isOpen) {
      if (canCancel) {
        setActiveTab("cancel");
      } else if (canReschedule) {
        setActiveTab("reschedule");
      }
    }
  }, [isOpen, canCancel, canReschedule]);

  const cancelClassMutation = useMutation({
    mutationFn: async ({
      classId,
      reason,
    }: {
      classId: string;
      reason: any;
    }) => {
      return fetchApi({
        path: `classes/class-schedule/${classId}`,
        method: "PATCH",
        data: {
          reason: reason?.id,
          status: "cancelled",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Class cancelled successfully!",
        description: "The class has been cancelled.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["vacation"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel class",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const rescheduleClassMutation = useMutation({
    mutationFn: async ({
      classId,
      reason,
      startDate,
      startTime,
      endTime,
      primaryInstructor,
    }: {
      classId: string;
      reason: any;
      startDate: string;
      startTime: string;
      endTime: string;
      primaryInstructor: any;
    }) => {
      return fetchApi({
        path: `classes/class-schedule/${classId}`,
        method: "PATCH",
        data: {
          reason: reason?.id,
          status: "reschedule",
          start_date: startDate,
          start_time: startTime,
          end_time: endTime,
          primary_instructor: primaryInstructor?.id,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Class rescheduled successfully!",
        description: "The class has been rescheduled.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["vacation"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to reschedule class",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const {
    data: cancelationReasonData,
    isLoading: cancelationReasonDataLoading,
    error: cancelationReasonDataError,
  } = useQuery({
    queryKey: ["cancelationReason"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "cancelation-reason",
      }),
    enabled: isOpen && canCancel,
  });

  const {
    data: rescheduleReasonData,
    isLoading: rescheduleReasonDataLoading,
    error: rescheduleReasonDataError,
  } = useQuery({
    queryKey: ["rescheduleReason"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "reschedule-reason",
      }),
    enabled: isOpen && canReschedule,
  });

  const Instructor = useQuery({
    queryKey: ["allInstructor"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "users?roles=instructor",
      }),
    enabled: isOpen && canReschedule,
  });

  const AllInstrcutors: any = Instructor?.data;

  const { data: availabilityData } = useQuery({
    queryKey: ["availability", selectedInstructor, selectedDate, classInfo?.id],
    queryFn: async () => {
      const formattedDate = format(selectedDate!, "yyyy-MM-dd");
      const response = await fetchApi({
        path: `availability/single-date/${selectedInstructor?.id}/${formattedDate}/${classInfo?.id}`,
      });
      return response;
    },
    enabled:
      !!selectedDate &&
      !!selectedInstructor &&
      !!classInfo?.id &&
      canReschedule,
  });

  const dataTime: any =
    (availabilityData && (availabilityData as any)?.data) || {};
  const timeSlots = dataTime?.timeSlots;

  const resetForm = () => {
    setCancelReason("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedInstructor("");
    setRescheduleReason("");
  };

  const handleCancel = () => {
    if (!cancelReason) {
      toast({
        title: "Please select a cancellation reason",
        variant: "destructive",
      });
      return;
    }

    if (!classInfo?.id) {
      toast({
        title: "Class information missing",
        description: "Unable to cancel class. Please try again.",
        variant: "destructive",
      });
      return;
    }

    cancelClassMutation.mutate({
      classId: classInfo.id,
      reason: cancelReason,
    });
  };

  const handleReschedule = () => {
    if (!rescheduleReason) {
      toast({
        title: "Please select a reschedule reason",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        variant: "destructive",
      });
      return;
    }

    if (!selectedInstructor) {
      toast({
        title: "Please select an instructor",
        variant: "destructive",
      });
      return;
    }

    if (!classInfo?.id) {
      toast({
        title: "Class information missing",
        description: "Unable to reschedule class. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const [startTime, endTime] = selectedTime.split("-");
    rescheduleClassMutation.mutate({
      classId: classInfo.id,
      reason: rescheduleReason,
      startDate: format(selectedDate, "yyyy-MM-dd"),
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      primaryInstructor: selectedInstructor,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Render when no permissions
  if (!canCancel && !canReschedule) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-background max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Class Management</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                This class cannot be cancelled or rescheduled at this time.
              </p>
              <p className="text-xs text-muted-foreground">
                Please contact support if you need assistance.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-background max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cancel / Reschedule Class</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${
              canCancel && canReschedule ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {canCancel && (
              <TabsTrigger value="cancel">Cancel Class</TabsTrigger>
            )}
            {canReschedule && (
              <TabsTrigger value="reschedule">Reschedule Class</TabsTrigger>
            )}
          </TabsList>

          {canCancel && (
            <TabsContent value="cancel" className="space-y-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Class: {classInfo?.title || classInfo?.type || "Class"} -{" "}
                  {classInfo?.startDate || "Date"}{" "}
                  {classInfo?.startTime || "Time"}
                </div>

                <div className="space-y-2">
                  <Label>Reason for Cancellation</Label>
                  <Select value={cancelReason} onValueChange={setCancelReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cancellation reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {cancelationReasonDataLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading reasons...
                        </SelectItem>
                      ) : Array.isArray(cancelationReasonData?.data) &&
                        cancelationReasonData.data.length > 0 ? (
                        cancelationReasonData.data.map((reason: any) => (
                          <SelectItem key={reason.id} value={reason}>
                            {reason?.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled>
                          No reasons available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                    Cancellation Policy
                  </h4>
                  <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                    <li>
                      • Cancellations must be made at least 2 hours before class
                    </li>
                    <li>• Credits will be refunded to your account</li>
                    <li>• Late cancellations may result in credit deduction</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="destructive"
                    disabled={cancelClassMutation.isPending || !cancelReason}
                  >
                    {cancelClassMutation.isPending
                      ? "Cancelling..."
                      : "Cancel Class"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}

          {canReschedule && (
            <TabsContent value="reschedule" className="space-y-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Current Class:{" "}
                  {classInfo?.title || classInfo?.type || "Class"} -{" "}
                  {classInfo?.startDate || "Date"}{" "}
                  {classInfo?.startTime || "Time"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instructor</Label>
                    <Select
                      value={selectedInstructor?.id?.toString() || ""}
                      onValueChange={(value) => {
                        const instructor = AllInstrcutors?.data?.find(
                          (inst: any) => inst.id.toString() === value
                        );
                        setSelectedInstructor(instructor || "");
                        setSelectedDate(undefined);
                        setSelectedTime("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select instructor">
                          {selectedInstructor
                            ? `${selectedInstructor?.first_name} ${selectedInstructor?.last_name}`
                            : "Select instructor"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {Instructor.isLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading instructors...
                          </SelectItem>
                        ) : AllInstrcutors?.data?.length > 0 ? (
                          AllInstrcutors.data.map((instructor: any) => (
                            <SelectItem
                              key={instructor.id}
                              value={instructor.id.toString()}
                            >
                              {instructor?.first_name} {instructor?.last_name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No instructors available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Reason for Rescheduling</Label>
                    <Select
                      value={rescheduleReason}
                      onValueChange={setRescheduleReason}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {rescheduleReasonDataLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading reasons...
                          </SelectItem>
                        ) : Array.isArray(rescheduleReasonData?.data) &&
                          rescheduleReasonData.data.length > 0 ? (
                          rescheduleReasonData.data.map((reason: any) => (
                            <SelectItem key={reason.id} value={reason}>
                              {reason?.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            No reasons available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Select new date and time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                        disabled={!selectedInstructor}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : selectedInstructor
                          ? "Select date"
                          : "Select instructor first"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {selectedDate && selectedInstructor && (
                    <div>
                      {timeSlots?.length > 0 ? (
                        <div className="space-y-2">
                          <Label className="text-sm">
                            Available time slots
                          </Label>
                          <div className="flex gap-2 flex-wrap">
                            {timeSlots.map((slot: any) => (
                              <Button
                                key={slot.id}
                                variant={
                                  selectedTime ===
                                  `${slot.startTime}-${slot.endTime}`
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  selectedTime ===
                                  `${slot.startTime}-${slot.endTime}`
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : ""
                                }
                                onClick={() =>
                                  setSelectedTime(
                                    `${slot.startTime}-${slot.endTime}`
                                  )
                                }
                                disabled={!slot.isActive}
                              >
                                {slot.startTime} - {slot.endTime}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                          No timeslots are available for this date. Please
                          select a different date.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedDate && selectedTime && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Reschedule To: {format(selectedDate, "PPP")},{" "}
                      {selectedTime}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReschedule}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={
                      rescheduleClassMutation.isPending ||
                      !rescheduleReason ||
                      !selectedDate ||
                      !selectedTime ||
                      !selectedInstructor ||
                      (selectedDate && timeSlots?.length === 0)
                    }
                  >
                    {rescheduleClassMutation.isPending
                      ? "Rescheduling..."
                      : "Reschedule Class"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
