import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CancelReasonsModal } from "./CancelReasonsModal";
import { Calendar, Clock, Users, UserCheck } from "lucide-react";
import { RescheduleReasonsModal } from "./RescheduleResonsModal";
import { hasPermission } from "@/utils/checkPermission";

// Define the state interface
interface CancelRescheduleSettings {
  // Instructor permissions
  instructor_can_cancel_class: boolean;
  instructor_can_reschedule_class: boolean;
  mini_hours_before_instructor_can_cancel_class: string;
  mini_hours_before_instructor_can_reschedule_class: string;
  // Learner permissions
  user_can_cancel_class: boolean;
  user_can_reschedule_class: boolean;
  mini_hours_before_user_can_cancel_class: string;
  mini_hours_before_user_can_reschedule_class: string;
  // Class timing settings
  class_can_start_minutes_before_schedule_time: string;
  delay_limit_for_joining_class: number;
  // Rescheduling limits
  max_days_in_future_for_rescheduling: string;
}

export function CancelReschedulingSettings({
  setChanges,
  setSettings,
  settings,
}: any) {
  // Single state object with all settings
  const [showCancelReasonsModal, setShowCancelReasonsModal] =
    useState<boolean>(false);
  const [showRescheduleReasonsModal, setShowRescheduleReasonsModal] =
    useState<boolean>(false);

  // Generic update function
  const updateSetting = <K extends keyof CancelRescheduleSettings>(
    key: K,
    value: CancelRescheduleSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setChanges();
  };

  // Helper function for input changes
  const handleInputChange =
    (key: keyof CancelRescheduleSettings) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSetting(key, e.target.value);
      };

  // Helper function for select changes
  const handleSelectChange =
    (key: keyof CancelRescheduleSettings) => (value: string) => {
      updateSetting(key, value);
    };

  // Helper function for switch changes
  const handleSwitchChange =
    (key: keyof CancelRescheduleSettings) => (checked: boolean) => {
      updateSetting(key, checked);
    };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          Cancel and Rescheduling Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure permissions and timing for class cancellations and
          rescheduling
        </p>
      </div>

      {/* Instructor Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Instructor Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="instructor-cancel">
                    Allow Instructors to Cancel Classes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable instructors to cancel their classes
                  </p>
                </div>
                <Switch
                  id="instructor-cancel"
                  checked={settings.instructor_can_cancel_class}
                  onCheckedChange={handleSwitchChange(
                    "instructor_can_cancel_class"
                  )}
                  disabled={!hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE")}
                />
              </div>
              {settings.instructor_can_cancel_class && (
                <div>
                  <Label htmlFor="instructor-cancel-hours">
                    Minimum Hours Before Class
                  </Label>
                  <Input
                    id="instructor-cancel-hours"
                    type="number"
                    value={
                      settings.mini_hours_before_instructor_can_cancel_class
                    }
                    onChange={handleInputChange(
                      "mini_hours_before_instructor_can_cancel_class"
                    )}
                    className="mt-1"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Hours before class start time
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="instructor-reschedule">
                    Allow Instructors to Reschedule Classes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable instructors to reschedule their classes
                  </p>
                </div>
                <Switch
                  id="instructor-reschedule"
                  checked={settings.instructor_can_reschedule_class}
                  onCheckedChange={handleSwitchChange(
                    "instructor_can_reschedule_class"
                  )}
                  disabled={!hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE")}
                />
              </div>
              {settings.instructor_can_reschedule_class && (
                <div>
                  <Label htmlFor="instructor-reschedule-hours">
                    Minimum Hours Before Class
                  </Label>
                  <Input
                    id="instructor-reschedule-hours"
                    type="number"
                    value={
                      settings.mini_hours_before_instructor_can_reschedule_class
                    }
                    onChange={handleInputChange(
                      "mini_hours_before_instructor_can_reschedule_class"
                    )}
                    className="mt-1"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Hours before class start time
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learner Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Learner Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="learner-cancel">
                    Allow Learners to Cancel Classes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable learners to cancel their classes
                  </p>
                </div>
                <Switch
                  id="learner-cancel"
                  checked={settings.user_can_cancel_class}
                  onCheckedChange={handleSwitchChange("user_can_cancel_class")}
                  disabled={!hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE")}
                />
              </div>
              {settings.user_can_cancel_class && (
                <div>
                  <Label htmlFor="learner-cancel-hours">
                    Minimum Hours Before Class
                  </Label>
                  <Input
                    id="learner-cancel-hours"
                    type="number"
                    value={settings.mini_hours_before_user_can_cancel_class}
                    onChange={handleInputChange(
                      "mini_hours_before_user_can_cancel_class"
                    )}
                    className="mt-1"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Hours before class start time
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="learner-reschedule">
                    Allow Learners to Reschedule Classes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable learners to reschedule their classes
                  </p>
                </div>
                <Switch
                  id="learner-reschedule"
                  checked={settings.user_can_reschedule_class}
                  onCheckedChange={handleSwitchChange(
                    "user_can_reschedule_class"
                  )}
                  disabled={!hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE")}
                />
              </div>
              {settings.user_can_reschedule_class && (
                <div>
                  <Label htmlFor="learner-reschedule-hours">
                    Minimum Hours Before Class
                  </Label>
                  <Input
                    id="learner-reschedule-hours"
                    type="number"
                    value={settings.mini_hours_before_user_can_reschedule_class}
                    onChange={handleInputChange(
                      "mini_hours_before_user_can_reschedule_class"
                    )}
                    className="mt-1"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Hours before class start time
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Class Timing Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="time-difference">
                  Time difference between two classes
                </Label>
                <Select
                  value={settings.class_can_start_minutes_before_schedule_time.toString()}
                  onValueChange={handleSelectChange(
                    "class_can_start_minutes_before_schedule_time"
                  )}
                >
                  <SelectTrigger id="time-difference" className="mt-1">
                    <SelectValue placeholder="Select time difference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Classes can be started 5 minutes before scheduled time
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="delay-limit">
                  Delay limit for joining classes
                </Label>
                <Select
                  value={settings.delay_limit_for_joining_class.toString()}
                  onValueChange={(value) => updateSetting("delay_limit_for_joining_class", value === "disabled" ? 0 : Number(value))}
                >
                  <SelectTrigger id="delay-limit" className="mt-1">
                    <SelectValue placeholder="Select delay limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum delay allowed for joining classes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rescheduling Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rescheduling Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="max-days-rescheduling">
              Maximum days in future for rescheduling
            </Label>
            <Input
              id="max-days-rescheduling"
              type="number"
              value={settings.max_days_in_future_for_rescheduling}
              onChange={handleInputChange(
                "max_days_in_future_for_rescheduling"
              )}
              className="mt-1 max-w-xs"
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Admin/Support users can cancel/reschedule class anytime
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Cancel Reasons Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cancel Reasons Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manage Cancel Reasons</h4>
              <p className="text-sm text-muted-foreground">
                Add, edit, or disable reasons for class cancellation
              </p>
            </div>
            {hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE") && (
              <Button
                variant="outline"
                onClick={() => setShowCancelReasonsModal(true)}
              >
                Manage Cancel Reasons
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reschedule Reasons Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manage reschedule Reasons</h4>
              <p className="text-sm text-muted-foreground">
                Add, edit, or disable reasons for class rescheduling
              </p>
            </div>
            {hasPermission("HAS_EDIT_CANCEL_&_RESCHEDULE") && (
              <Button
                variant="outline"
                onClick={() => setShowRescheduleReasonsModal(true)}
              >
                Manage Cancel Reasons
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Reasons Management Modal */}
      <CancelReasonsModal
        isOpen={showCancelReasonsModal}
        onOpenChange={(open) => setShowCancelReasonsModal(open)}
      />
      <RescheduleReasonsModal
        isOpen={showRescheduleReasonsModal}
        onOpenChange={(open) => setShowRescheduleReasonsModal(open)}
      />
    </div>
  );
}
