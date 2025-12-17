import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { Calendar, Clock, Users, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { ClassCancelRescheduleModal } from "@/components/class-management/ClassCancelRescheduleModal";
import { ImpactedClass } from "@/types/instructor";

interface ImpactedClassesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: ImpactedClass[];
  instructorName: string;
  vacationPeriod: { startDate: string; endDate: string };
}

export const ImpactedClassesModal: React.FC<ImpactedClassesModalProps> = ({
  open,
  onOpenChange,
  classes,
  instructorName,
  vacationPeriod,
}) => {
  const [showCancelRescheduleModal, setShowCancelRescheduleModal] =
    useState(false);
  const [actionType, setActionType] = useState<"cancel" | "reschedule">(
    "cancel"
  );
  const [selectedClassInfo, setSelectedClassInfo] =
    useState<ImpactedClass | null>(null);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleCancel = (classItem: ImpactedClass) => {
    setSelectedClassInfo(classItem);
    setActionType("cancel");
    setShowCancelRescheduleModal(true);
  };

  const handleReschedule = (classItem: ImpactedClass) => {
    setSelectedClassInfo(classItem);
    setActionType("reschedule");
    setShowCancelRescheduleModal(true);
  };

  const handleModalCancel = (reason: string) => {
    toast.success("Class cancelled successfully");
    setShowCancelRescheduleModal(false);
  };

  const handleModalReschedule = (data: any) => {
    toast.success("Class rescheduled successfully");
    setShowCancelRescheduleModal(false);
  };

  const formatVacationPeriod = () => {
    const startDate = new Date(vacationPeriod.startDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
    const endDate = new Date(vacationPeriod.endDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
    return `${startDate} - ${endDate}`;
  };



  // Don't render if no classes
  if (!classes || classes.length === 0) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Impacted Classes - {instructorName}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Vacation Period: {formatVacationPeriod()}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {classes.length} classes will be impacted
                </span>
              </div>
              <Badge variant="outline" className="text-orange-600">
                Action Required
              </Badge>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Title</TableHead>
                    <TableHead>Student Name(s)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes?.map((classItem) => {
                    const { date, time } = formatDateTime(classItem.dateTime);
                    return (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">
                          {classItem.title}
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="max-w-xs">
                            <Badge variant="outline" className="text-xs">
                              <p className="flex items-center gap-1">{classItem.studentName}</p>
                            </Badge>
                            {(classItem.studentGroup || classItem.groupName) && (
                              <Badge variant="outline" className="text-xs">
                                {classItem.studentGroup ? classItem.studentGroup : classItem.groupName}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                          </div>
                        </TableCell>
                        <TableCell>{classItem.duration} min</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReschedule(classItem)}
                              className="text-blue-600 hover:text-blue-700 border-blue-200"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(classItem)}
                              className="text-red-600 hover:text-red-700 border-red-200"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>



            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel/Reschedule Modal */}
      {selectedClassInfo && (
        <ClassCancelRescheduleModal
          isOpen={showCancelRescheduleModal}
          onClose={() => setShowCancelRescheduleModal(false)}
          onCancel={handleModalCancel}
          onReschedule={handleModalReschedule}
          classInfo={{
            ...selectedClassInfo,
            type: selectedClassInfo.title,
            startDate: formatDateTime(selectedClassInfo.dateTime).date,
            startTime: formatDateTime(selectedClassInfo.dateTime).time,
          }}
        />
      )}
    </>
  );
};
