import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, Plus, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MultiSelect } from "@/components/ui/multi-select";
import { mockStudents } from "@/data/studentData";
import { mockGroups } from "@/data/groupData";
import { mockCourses } from "@/data/courseData";
import { useToast } from "@/components/ui/use-toast";
import { fetchApi } from "@/services/api/fetchApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { hasPermission } from "@/utils/checkPermission";

const CreateClass = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_CREATE_CLASS")) {
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
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    classType: "",
    instructor: "",
    secondaryInstructor: "",
    students: "",
    group: "",
    startDate: "",
    numberOfClasses: 1,
    endDate: "",
    schedule: [],
    meetingType: "google_meet",
    ignoreAvailability: false,
    reserve: false,
    cancelledClasses: false,
    ignoreCredits: false,
  });
  const [selectedCancelledClass, setSelectedCancelledClass] = useState("");

  const { data: allCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "courses",
      }),
  });

  const { data: allGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "groups",
      }),
  });

  const { data: Students } = useQuery({
    queryKey: ["allStudents"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "users?roles=student",
      }),
  });

  const { data: Instructor } = useQuery({
    queryKey: ["allInstructor"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "users?roles=instructor",
      }),
  });

  const { data: classTypes } = useQuery({
    queryKey: ["classTypes"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
  });

  const { data: instructorCourses } = useQuery({
    queryKey: ["instructorCourses", formData.instructor],
    queryFn: () =>
      fetchApi<any[]>({
        path: `instructor-courses/instructor/${formData.instructor}`,
        params: {
          "demoCheck": "withoutDemo"
        }
      }),
    enabled: !!formData.instructor,
  });

  const { data: studentClassTypes } = useQuery({
    queryKey: ["studentClassTypes", formData.students],
    queryFn: () =>
      fetchApi<any>({
        path: `family/by-user/${formData.students}`,
      }),
    enabled: !!formData.students,
  });

  const createClassScheduleMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi({
        path: "classes/class-schedule",
        method: "POST",
        data: payload,
      }),
  });

  const { data: cancelledClasses } = useQuery({
    queryKey: ["cancelledClasses", formData.students],
    queryFn: () =>
      fetchApi<any[]>({
        path: `classes/class-schedule/cancelled/user/${formData.students}`,
      }),
    enabled: !!formData.students && formData.cancelledClasses,
  });

  console.log(cancelledClasses, "cancelledClasses");

  const allCousesData: any = allCourses;
  const allGroupsData = allGroups;
  const allStudents: any = Students;
  const allClassTypes = classTypes;
  const allInstrcutors: any = Instructor;

  // Helper functions to get display labels
  const getCourseLabel = (courseId: string) => {
    if (formData.instructor && instructorCourses) {
      const course = instructorCourses.find(
        (c) => c.course_id.toString() === courseId
      );
      return course?.course_title || "";
    }
    const course = allCousesData?.data?.find(
      (c) => c.id.toString() === courseId
    );
    return course?.title || "";
  };

  const getClassTypeLabel = (classTypeId: string) => {
    const classType = allClassTypes?.find(
      (ct) => ct.id.toString() === classTypeId
    );
    return classType?.name || "";
  };

  const getStudentLabel = (studentId: string) => {
    const student = allStudents?.data?.find(
      (s) => s.id.toString() === studentId
    );
    return student ? `${student.first_name} ${student.last_name}` : "";
  };

  const getInstructorLabel = (instructorId: string) => {
    const instructor = allInstrcutors?.data?.find(
      (i) => i.id.toString() === instructorId
    );
    return instructor ? `${instructor.first_name} ${instructor.last_name}` : "";
  };

  const getGroupLabel = (groupId: string) => {
    const group = allGroupsData?.find((g) => g.id.toString() === groupId);
    return group?.name || "";
  };

  // const studentOptions = mockStudents.map((student) => ({
  //   label: student.name,
  //   value: student.id,
  // }));
  const courseOptions = formData.instructor && instructorCourses
    ? instructorCourses?.map((course) => ({
      label: course.course_title,
      value: course.course_id,
    }))
    : allCousesData?.data?.map((course) => ({
      label: course.title,
      value: course.id,
    }));

  const calculateEndDate = (startDate: string, numberOfClasses: number) => {
    if (!startDate || numberOfClasses <= 0) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + (numberOfClasses - 1) * 7);
    return date.toISOString().split("T")[0];
  };

  const getDayFromDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - require course and class type
    if (!formData.course || !formData.classType) {
      toast({
        title: "Error",
        description: "Please select a course and class type",
        variant: "destructive",
      });
      return;
    }

    // if (!formData.title) {
    //   toast({
    //     title: "Error",
    //     description: "Please enter a class title",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // Validation - require either student or group (but not both)
    if (!formData.group && !formData.students) {
      toast({
        title: "Error",
        description: "Please select either a student or a group",
        variant: "destructive",
      });
      return;
    }

    if (formData.group && formData.students) {
      toast({
        title: "Error",
        description: "Please select either a student OR a group, not both",
        variant: "destructive",
      });
      return;
    }

    // Validation - require primary instructor
    if (!formData.instructor) {
      toast({
        title: "Error",
        description: "Please select a primary instructor",
        variant: "destructive",
      });
      return;
    }

    // Validation - require start date
    if (!formData.startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }

    // Validation - require at least one schedule slot
    if (formData.schedule.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one schedule slot",
        variant: "destructive",
      });
      return;
    }

    // Validation - check if all schedule slots have required fields
    const incompleteSlots = formData.schedule.filter(
      (slot) => !slot.day || !slot.startTime || !slot.endTime
    );
    if (incompleteSlots.length > 0) {
      toast({
        title: "Error",
        description:
          "Please complete all schedule slot information (day, start time, and end time)",
        variant: "destructive",
      });
      return;
    }

    // Validation - check if end time is after start time
    const invalidTimeSlots = formData.schedule.filter(
      (slot) => slot.startTime >= slot.endTime
    );
    if (invalidTimeSlots.length > 0) {
      toast({
        title: "Error",
        description: "End time must be after start time for all schedule slots",
        variant: "destructive",
      });
      return;
    }

    // Validation - require student selection if cancelled classes is checked
    if (formData.cancelledClasses && !formData.students) {
      toast({
        title: "Error",
        description: "Please select a student first to view cancelled classes",
        variant: "destructive",
      });
      return;
    }

    // Validation - require cancelled class selection if checkbox is checked
    if (formData.cancelledClasses && !selectedCancelledClass) {
      toast({
        title: "Error",
        description: "Please select a cancelled class",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      course: parseInt(formData.course),
      class_type: parseInt(formData.classType),
      title: formData.title,
      primary_instructor: parseInt(formData.instructor),
      secondary_instructor:
        formData.secondaryInstructor &&
          formData.secondaryInstructor !== "no-secondary"
          ? parseInt(formData.secondaryInstructor)
          : null,
      student: formData.students ? parseInt(formData.students) : null,
      group: formData.group ? parseInt(formData.group) : null,
      start_date: formData.startDate,
      number_of_classes: formData.numberOfClasses,
      schedule_slots: formData.schedule.map((slot) => ({
        day: slot.day.charAt(0).toUpperCase() + slot.day.slice(1), // Capitalize first letter
        start_time: slot.startTime,
        end_time: slot.endTime,
      })),
      meeting_type: formData.meetingType,
      ignore_instructor_availability: formData.ignoreAvailability,
      ignore_credits: formData.ignoreCredits,
      reserve: formData.reserve,
      status: "scheduled",
      ...(formData.cancelledClasses && selectedCancelledClass && {
        cancelled_class_id: parseInt(selectedCancelledClass)
      })
    };
    try {
      const res: any = await createClassScheduleMutation.mutateAsync(payload);
      if (res.summary?.total_conflicts > 0) {
        toast({
          title: "Class Created",
          description: res?.conflicts[0]?.conflicts[0]?.message || "No classes were created due to conflicts. Please resolve conflicts and try again",
          variant: "destructive"
        });
        return
      } else {
        toast({
          title: "Class Created",
          description: "The class has been successfully scheduled.",
        });
      }


      // Reset form
      setFormData({
        course: "",
        classType: "",
        title: "",
        instructor: "",
        secondaryInstructor: "",
        students: "",
        group: "",
        startDate: "",
        numberOfClasses: 1,
        endDate: "",
        schedule: [],
        meetingType: "gmeet",
        ignoreAvailability: false,
        reserve: false,
        cancelledClasses: false,
        ignoreCredits: false,
      });
      setSelectedCancelledClass("");
      navigate("/classes");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          day: "",
          startTime: "",
          endTime: "",
        },
      ],
    }));
  };

  const extractDurationFromClassName = (classTypeName: string): number => {
    const match = classTypeName.match(/(\d+)\s*(?:minutes?|mins?)/i);
    return match ? parseInt(match[1]) : 60; // Default to 60 minutes if not found
  };

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    return startDate.toTimeString().slice(0, 5);
  };

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (field === "remove") {
      setFormData((prev) => {
        const schedule = [...prev.schedule];
        schedule.splice(index, 1);
        return {
          ...prev,
          schedule,
        };
      });
    } else {
      setFormData((prev) => {
        const schedule = [...prev.schedule];
        schedule[index][field] = value;
        if (field === "startTime" && value && formData.classType) {
          const selectedClassType = (formData.students && studentClassTypes 
            ? studentClassTypes?.class_types 
            : allClassTypes)?.find(type => type.id.toString() === formData.classType);
          
          if (selectedClassType?.name) {
            const duration = extractDurationFromClassName(selectedClassType.name);
            schedule[index].endTime = calculateEndTime(value, duration);
          }
        }
        return {
          ...prev,
          schedule,
        };
      });
    }
  };

  return (
    <DashboardLayout title="Create Class">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/classes")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </Button>
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground">
              Create New Class
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Schedule a new class for your students.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Primary Instructor
                </Label>
                <Select
                  value={formData.instructor}
                  onValueChange={(value) => {
                    handleInputChange("instructor", value);
                    // Clear course selection when instructor changes
                    handleInputChange("course", "");
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select instructor">
                      {formData.instructor
                        ? getInstructorLabel(formData.instructor)
                        : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(allInstrcutors?.data)
                      ? allInstrcutors?.data
                      : []
                    )?.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.first_name} {instructor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Students field */}
              <div className="space-y-2">
                <Label htmlFor="students" className="text-sm font-medium">
                  Student {formData.group ? "(Disabled - Group Selected)" : "*"}
                </Label>
                <div className="relative">
                  <Select
                    value={formData.students}
                    onValueChange={(value) => {
                      handleInputChange("students", value);
                      // Clear group and class type when student is selected
                      if (value) {
                        handleInputChange("group", "");
                        handleInputChange("classType", "");
                      }
                    }}
                    disabled={!!formData.group}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select student">
                        {formData.students
                          ? getStudentLabel(formData.students)
                          : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(allStudents?.data)
                        ? allStudents?.data
                        : []
                      )?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {`${student.first_name} ${student.last_name} | (${student.email})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.students && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => handleInputChange("students", "")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select either a student OR a group, not both
                </p>
              </div>
              {/* Course Selection */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium">
                    Select Course * {formData.instructor ? "(Instructor's Courses)" : "(All Courses)"}
                  </Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) =>
                      handleInputChange("course", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a course">
                        {formData.course ? getCourseLabel(formData.course) : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions?.map((course) => (
                        <SelectItem key={course.value} value={course.value}>
                          {course.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="classType" className="text-sm font-medium">
                    Class Type * {formData.students ? "(Student's Class Types)" : ""}
                  </Label>
                  <Select
                    value={formData.classType}
                    onValueChange={(value) => {
                      handleInputChange("classType", value);
                      
                      // Update end times for existing schedule slots when class type changes
                      if (value && formData.schedule.length > 0) {
                        const selectedClassType = (formData.students && studentClassTypes 
                          ? studentClassTypes?.class_types 
                          : allClassTypes)?.find(type => type.id.toString() === value);
                        
                        if (selectedClassType?.name) {
                          const duration = extractDurationFromClassName(selectedClassType.name);
                          setFormData(prev => ({
                            ...prev,
                            classType: value,
                            schedule: prev.schedule.map(slot => ({
                              ...slot,
                              endTime: slot.startTime ? calculateEndTime(slot.startTime, duration) : slot.endTime
                            }))
                          }));
                          return;
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select class type">
                        {formData.classType
                          ? getClassTypeLabel(formData.classType)
                          : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.students && studentClassTypes ? studentClassTypes?.class_types : allClassTypes)?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Class Title */}
              {/* <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Class Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter class title"
                  className="h-11"
                />
              </div> */}

              {/* Group Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Groups (Optional){" "}
                  {formData.students ? "(Disabled - Student Selected)" : ""}
                </Label>
                <div className="relative">
                  <Select
                    value={formData.group}
                    onValueChange={(value) => {
                      handleInputChange("group", value);
                      // Clear student when group is selected
                      if (value) {
                        handleInputChange("students", "");
                      }
                    }}
                    disabled={!!formData.students}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select group">
                        {formData.group ? getGroupLabel(formData.group) : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(allGroupsData) ? allGroupsData : [])?.map(
                        (group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {formData.group && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => handleInputChange("group", "")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      const endDate = calculateEndDate(
                        startDate,
                        formData.numberOfClasses
                      );
                      const dayOfWeek = getDayFromDate(startDate);

                      handleInputChange("startDate", startDate);
                      handleInputChange("endDate", endDate);

                      // Auto-populate first schedule slot with the day
                      if (dayOfWeek && formData.schedule.length === 0) {
                        setFormData(prev => ({
                          ...prev,
                          startDate,
                          endDate,
                          schedule: [{
                            day: dayOfWeek,
                            startTime: "",
                            endTime: ""
                          }]
                        }));
                      } else if (dayOfWeek && formData.schedule.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          startDate,
                          endDate,
                          schedule: prev.schedule.map((slot, index) =>
                            index === 0 ? { ...slot, day: dayOfWeek } : slot
                          )
                        }));
                      }
                    }}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="numberOfClasses"
                    className="text-sm font-medium"
                  >
                    Number of Classes
                  </Label>
                  <Input
                    id="numberOfClasses"
                    type="number"
                    value={formData.numberOfClasses}
                    onChange={(e) => {
                      const numberOfClasses = parseInt(e.target.value, 10) || 1;
                      const endDate = calculateEndDate(
                        formData.startDate,
                        numberOfClasses
                      );
                      handleInputChange("numberOfClasses", numberOfClasses);
                      handleInputChange("endDate", endDate);
                    }}
                    className="h-11"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    className="h-11"
                    disabled
                  />
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule
                </h3>
                {formData.schedule.map((slot, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Day of the Week
                      </Label>
                      <Select
                        value={slot.day}
                        onValueChange={(value) =>
                          handleScheduleChange(index, "day", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "endTime", e.target.value)
                        }
                        className="h-11"
                        readOnly
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleScheduleChange(index, "remove", "")}
                      className="h-11"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchedule}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Slot
                </Button>
              </div>

              {/* Other Form Fields */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Instructor Availability
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="ignoreAvailability"
                      checked={formData.ignoreAvailability}
                      onChange={(e) =>
                        handleInputChange(
                          "ignoreAvailability",
                          e.target.checked
                        )
                      }
                    />
                    Ignore Instructor's Availability
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="reserve"
                      checked={formData.reserve}
                      onChange={(e) =>
                        handleInputChange("reserve", e.target.checked)
                      }
                    />
                    Reserve
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="cancelledClasses"
                      checked={formData.cancelledClasses}
                      onChange={(e) => {
                        handleInputChange("cancelledClasses", e.target.checked);
                        if (!e.target.checked) {
                          setSelectedCancelledClass("");
                        }
                      }}
                    />
                    Cancelled Classes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="ignoreCredits"
                      checked={formData.ignoreCredits}
                      onChange={(e) =>
                        handleInputChange("ignoreCredits", e.target.checked)
                      }
                    />
                    Ignore Credits
                  </label>
                </div>

                {/* Cancelled Classes Selection */}
                {formData.cancelledClasses && formData.students && (
                  <div className="space-y-3 mt-4 p-4 border rounded-lg bg-muted/50">
                    <Label className="text-sm font-medium">
                      Select Cancelled Class for {getStudentLabel(formData.students)}
                    </Label>
                    {cancelledClasses && cancelledClasses.length > 0 ? (
                      <RadioGroup
                        value={selectedCancelledClass}
                        onValueChange={setSelectedCancelledClass}
                        className="space-y-3"
                      >
                        {cancelledClasses.map((cls) => (
                          <div key={cls.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-background">
                            <RadioGroupItem value={cls.id.toString()} id={`class-${cls.id}`} className="mt-1" />
                            <Label htmlFor={`class-${cls.id}`} className="flex-1 cursor-pointer space-y-1">
                              <div className="font-medium text-sm">{cls.title}</div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div><strong>Course:</strong> {cls.course_title}</div>
                                <div><strong>Instructor:</strong> {cls.primary_instructor_first_name} {cls.primary_instructor_last_name}</div>
                                <div><strong>Class Type:</strong> {cls.class_type_name}</div>
                                <div><strong>Date:</strong> {new Date(cls.start_date).toLocaleDateString()} | <strong>Time:</strong> {cls.start_time} - {cls.end_time}</div>
                                <div><strong>Status:</strong> <span className="text-red-600 font-medium">{cls.status}</span></div>
                                {cls.notes && <div><strong>Notes:</strong> {cls.notes}</div>}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="text-sm text-muted-foreground p-3 text-center border rounded-lg">
                        No cancelled classes found for this student.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Web Conference</Label>
                <Select
                  value={formData.meetingType}
                  onValueChange={(value) =>
                    handleInputChange("meetingType", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google_meet">Google Meet</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Secondary Instructor (Optional)
                  </Label>
                  <Select
                    value={formData.secondaryInstructor}
                    onValueChange={(value) =>
                      handleInputChange("secondaryInstructor", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select secondary instructor">
                        {formData.secondaryInstructor &&
                          formData.secondaryInstructor !== "no-secondary"
                          ? getInstructorLabel(formData.secondaryInstructor)
                          : formData.secondaryInstructor === "no-secondary"
                            ? "No Secondary Instructor"
                            : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-secondary">
                        No Secondary Instructor
                      </SelectItem>
                      {(Array.isArray(allInstrcutors?.data)
                        ? allInstrcutors.data
                        : []
                      )
                        ?.filter(
                          (instructor) =>
                            instructor.id.toString() !== formData.instructor
                        )
                        ?.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.first_name} {instructor.last_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/classes")}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1"
              disabled={
                createClassScheduleMutation.isPending ||
                (formData.cancelledClasses && (!formData.students || !selectedCancelledClass))
              }
            >
              {createClassScheduleMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Class...
                </>
              ) : (
                "Create Class"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateClass;