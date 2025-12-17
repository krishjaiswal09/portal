import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoCancelRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: (reason: any) => void;
  onReschedule: (data: any) => void;
  demoInfo?: any;
}

export function DemoCancelRescheduleModal({
  isOpen,
  onClose,
  onCancel,
  onReschedule,
  demoInfo,
}: DemoCancelRescheduleModalProps) {
  const [cancelReason, setCancelReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState<any>("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  const queryClient = useQueryClient();

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
    enabled: isOpen,
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
    enabled: isOpen,
  });

  const Instructor = useQuery({
    queryKey: ["allInstructor"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "users?roles=instructor",
      }),
  });

  const AllInstrcutors: any = Instructor?.data;

  const cancelDemoMutation = useMutation({
    mutationFn: async ({ demoId, reason }: { demoId: string; reason: any }) => {
      return fetchApi({
        path: `classes/demo-class/${demoId}`,
        method: "PUT",
        data: {
          reason: reason?.id,
          status: "cancelled",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Demo cancelled successfully!",
        description: "The demo has been cancelled.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["allDemoClasses"] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel demo",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const rescheduleDemoMutation = useMutation({
    mutationFn: async ({
      demoId,
      reason,
      startDate,
      startTime,
      endTime,
      primaryInstructor,
    }: {
      demoId: string;
      reason: any;
      startDate: string;
      startTime: string;
      endTime: string;
      primaryInstructor: any;
    }) => {
      return fetchApi({
        path: `classes/demo-class/${demoId}`,
        method: "PUT",
        data: {
          reason: reason?.id,
          status: "reschedule",
          date: startDate,
          start_time: startTime,
          end_time: endTime,
          primary_instructor: primaryInstructor?.id,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Demo rescheduled successfully!",
        description: "The demo has been rescheduled.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["allDemoClasses"] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to reschedule demo",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate minutes from start_time and end_time fields (e.g., "13:30:00", "14:30:00")
  const calculateMinutes = () => {
    const start = demoInfo?.start_time;
    const end = demoInfo?.end_time;

    if (!start || !end) {
      return demoInfo?.duration || 60; // fallback to duration if available, otherwise 60
    }

    // Parse "HH:mm:ss" to minutes since midnight
    const [startH, startM, startS] = start.split(":").map(Number);
    const [endH, endM, endS] = end.split(":").map(Number);

    if (
      [startH, startM, startS, endH, endM, endS].some(
        (v) => typeof v !== "number" || isNaN(v)
      )
    ) {
      return demoInfo?.duration || 60; // fallback if parsing fails
    }

    const startTotalMinutes = startH * 60 + startM + (startS ? startS / 60 : 0);
    const endTotalMinutes = endH * 60 + endM + (endS ? endS / 60 : 0);

    const diffMinutes = Math.round(endTotalMinutes - startTotalMinutes);
    return Math.max(diffMinutes, 1); // ensure at least 1 minute
  };

  const minutes = calculateMinutes();

  const { data: availabilityData } = useQuery({
    queryKey: [
      "availability",
      selectedInstructor,
      selectedDate,
      demoInfo?.id,
      minutes,
    ],
    queryFn: async () => {
      const formattedDate = format(selectedDate!, "yyyy-MM-dd");
      const response = await fetchApi({
        path: `availability/single-date-by-minutes/${selectedInstructor?.id}/${formattedDate}/${minutes}`,
      });
      return response;
    },
    enabled: !!selectedDate && !!selectedInstructor && !!demoInfo?.id,
  });

  // For now, we'll use the availabilityData directly until we see the structure
  const dataTime: any =
    (availabilityData && (availabilityData as any)?.data) || {};
  const timeSlots = dataTime?.timeSlots;

  const resetForm = () => {
    setCancelReason("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedInstructor("");
    setRescheduleReason("");
    queryClient.invalidateQueries({ queryKey: ["allDemoClasses"] });
  };

  const handleCancel = () => {
    if (!cancelReason) {
      toast({
        title: "Please select a cancellation reason",
        variant: "destructive",
      });
      return;
    }

    cancelDemoMutation.mutate({
      demoId: demoInfo?.id,
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
    const [startTime, endTime] = selectedTime.split("-");
    rescheduleDemoMutation.mutate({
      demoId: demoInfo?.id,
      reason: rescheduleReason,
      startDate: format(selectedDate!, "yyyy-MM-dd"),
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      primaryInstructor: selectedInstructor,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cancel / Reschedule Demo</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="cancel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cancel">Cancel Demo</TabsTrigger>
            <TabsTrigger value="reschedule">Reschedule Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="cancel" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Demo: {demoInfo?.artForm || "Art Form"} -{" "}
                {demoInfo?.date || "Date"} {demoInfo?.startTime || "Time"}
              </div>

              <div className="space-y-2">
                <Label>Reason for Cancellation</Label>
                <Select value={cancelReason} onValueChange={setCancelReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cancellation reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {Array.isArray(cancelationReasonData?.data) &&
                      cancelationReasonData?.data?.map((reason: any) => (
                        <SelectItem key={reason} value={reason}>
                          {reason?.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="destructive"
                  disabled={cancelDemoMutation.isPending}
                >
                  {cancelDemoMutation.isPending
                    ? "Cancelling..."
                    : "Cancel Demo"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reschedule" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Current Demo: {demoInfo?.artForm || "Art Form"} -{" "}
                {demoInfo?.date || "Date"} {demoInfo?.startTime || "Time"}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Select
                    value={
                      selectedInstructor?.id
                        ? selectedInstructor.id.toString()
                        : ""
                    }
                    onValueChange={(value) => {
                      const instructor = AllInstrcutors?.data?.find(
                        (inst: any) => inst.id.toString() === value
                      );
                      setSelectedInstructor(instructor || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor">
                        {selectedInstructor
                          ? `${selectedInstructor.first_name || ""} ${
                              selectedInstructor.last_name || ""
                            }`.trim()
                          : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {AllInstrcutors?.data?.map((instructor: any) => (
                        <SelectItem
                          key={instructor.id}
                          value={instructor.id.toString()}
                        >
                          {instructor?.first_name} {instructor?.last_name}
                        </SelectItem>
                      ))}
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
                      {Array.isArray(rescheduleReasonData) &&
                        rescheduleReasonData?.map((reason: any) => (
                          <SelectItem key={reason} value={reason}>
                            {reason?.name}
                          </SelectItem>
                        ))}
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
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Select date"}
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
                {selectedDate && (
                  <div>
                    {timeSlots?.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {timeSlots?.map((slot: any) => (
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
                                ? "bg-orange-500 text-white"
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
                    ) : (
                      <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                        No timeslots are available so you can't reschedule the
                        demo
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-800">
                    Reschedule To -{" "}
                    {selectedDate ? format(selectedDate, "PPP") : ""},{" "}
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
                    rescheduleDemoMutation.isPending ||
                    (selectedDate && timeSlots?.length === 0)
                  }
                >
                  {rescheduleDemoMutation.isPending
                    ? "Rescheduling..."
                    : "Reschedule Demo"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
