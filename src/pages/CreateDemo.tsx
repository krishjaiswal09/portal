import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, X } from "lucide-react";
import { ParentDetailsSection } from "@/components/demo-management/ParentDetailsSection";
import { StudentDetailsSection } from "@/components/demo-management/StudentDetailsSection";
import { CourseSelectionSection } from "@/components/demo-management/CourseSelectionSection";
import { SimpleInstructorSelection } from "@/components/demo-management/SimpleInstructorSelection";
import { DemoDetailsSection } from "@/components/demo-management/DemoDetailsSection";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { hasPermission } from "@/utils/checkPermission";

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageType: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  pin: string;
  sameAsParent?: boolean;
}

interface ParentFormData {
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  sameAsParent: boolean;
}

interface DemoFormData {
  date: string;
  startTime: string;
  endTime: string;
  ignoreInstructorAvailability: boolean;
}

interface ExistingStudentFormData {
  selectedStudents: string;
  selectedGroup: string;
  ignoreInstructorAvailability: boolean;
}

const CreateDemo = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_CREATE_DEMO_CLASS")) {
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

  const [parentData, setParentData] = useState<ParentFormData>({
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    sameAsParent: false,
  });

  const [studentData, setStudentData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ageType: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    sameAsParent: false,
  });

  const [demoData, setDemoData] = useState<DemoFormData>({
    date: "",
    startTime: "",
    endTime: "",
    ignoreInstructorAvailability: false,
  });

  const [existingStudentData, setExistingStudentData] =
    useState<ExistingStudentFormData>({
      selectedStudents: "",
      selectedGroup: "",
      ignoreInstructorAvailability: false,
    });

  const [selectedCourse, setSelectedCourse] = useState("");
  const [primaryInstructor, setPrimaryInstructor] = useState("");
  const [secondaryInstructor, setSecondaryInstructor] = useState("none");

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

  const { data: instructorCourses } = useQuery({
    queryKey: ["instructorCourses", primaryInstructor],
    queryFn: () =>
      fetchApi<any[]>({
        path: `instructor-courses/instructor/${primaryInstructor}`,
        params: {
          demoCheck: "Demo",
        },
      }),
    enabled: !!primaryInstructor,
  });

  const allGroupsData = allGroups;
  const allStudents: any = Students;

  const studentOptions = allStudents?.data?.map((student) => ({
    label: `${student.first_name} ${student.last_name}`,
    value: student.id,
  }));

  const groupOptions = allGroupsData?.map((group) => ({
    label: group.name,
    value: group.id,
  }));

  const getStudentLabel = (studentId: string) => {
    const student = allStudents?.data?.find(
      (s) => s.id.toString() === studentId
    );
    return student ? `${student.first_name} ${student.last_name}` : "";
  };

  const getGroupLabel = (groupId: string) => {
    const group = allGroupsData?.find((g) => g.id.toString() === groupId);
    return group?.name || "";
  };

  const handleSameAsParentChange = (checked: boolean) => {
    setParentData((prev) => ({
      ...prev,
      sameAsParent: checked,
    }));

    if (checked) {
      setStudentData((prev) => ({
        ...prev,
        email: parentData.parentEmail,
        phone: parentData.parentPhone,
        sameAsParent: true,
      }));
    } else {
      setStudentData((prev) => ({
        ...prev,
        sameAsParent: false,
      }));
    }
  };

  const handleAgeTypeChange = (ageType: string) => {
    // Clear sameAsParent flag when ageType changes to adult
    if (ageType === "adult") {
      setParentData((prev) => ({
        ...prev,
        sameAsParent: false,
      }));
      setStudentData((prev) => ({
        ...prev,
        sameAsParent: false,
      }));
    }
  };

  // const handleNewStudentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Basic validation for new student
  //   if (
  //     !parentData.parentFirstName ||
  //     !parentData.parentLastName ||
  //     !parentData.parentEmail
  //   ) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all required parent details",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!studentData.firstName || !studentData.lastName || !studentData.email) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all required student details",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (
  //     !selectedCourse ||
  //     !primaryInstructor ||
  //     !demoData.date ||
  //     !demoData.startTime
  //   ) {
  //     toast({
  //       title: "Error",
  //       description: "Please fill in all required demo details",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // Create demo for new student
  //   const newDemo = {
  //     studentNames: [`${studentData.firstName} ${studentData.lastName}`],
  //     instructor: primaryInstructor,
  //     artForm: selectedCourse,
  //     demoType: "Private" as const,
  //     date: demoData.date,
  //     startTime: demoData.startTime,
  //     endTime: demoData.endTime,
  //     status: "Scheduled" as const,
  //     notes: `Student: ${studentData.email}, ${studentData.phone}. Parent: ${
  //       parentData.parentFirstName
  //     } ${parentData.parentLastName} (${parentData.parentEmail}, ${
  //       parentData.parentPhone
  //     })${
  //       secondaryInstructor && secondaryInstructor !== "none"
  //         ? `. Secondary Instructor: ${secondaryInstructor}`
  //         : ""
  //     }`,
  //     attendanceMarked: false,
  //   };
  //   console.log(newDemo, "newDemo");
  //   return false;
  //   addDemo(newDemo);
  //   toast({
  //     title: "Success",
  //     description: "Demo created successfully for new student!",
  //   });
  //   navigate("/demos");
  // };

  const addDemoClassMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi({
        path: "classes/demo-class",
        method: "POST",
        data: payload,
      }),
  });

  const handleNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate parent details if student is a kid (not adult)
    if (studentData.ageType !== "adult") {
      if (
        !parentData.parentFirstName ||
        !parentData.parentLastName ||
        !parentData.parentEmail
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required parent details",
          variant: "destructive",
        });
        return;
      }
    }

    if (!studentData.firstName || !studentData.lastName || !studentData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required student details",
        variant: "destructive",
      });
      return;
    }

    // Phone number is required for adult students
    if (studentData.ageType === "adult" && !studentData.phone) {
      toast({
        title: "Error",
        description: "Phone number is required for adult students",
        variant: "destructive",
      });
      return;
    }
    if (
      !selectedCourse ||
      !primaryInstructor ||
      !demoData.date ||
      !demoData.startTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required demo details",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      course_id: Number(selectedCourse),
      date: demoData.date, // should already be in ISO format
      start_time: demoData.startTime, // "HH:mm"
      end_time: demoData.endTime || null,
      primary_instructor: Number(primaryInstructor),
      secondary_instructor:
        secondaryInstructor && secondaryInstructor !== "none"
          ? Number(secondaryInstructor)
          : null,
      group: existingStudentData.selectedGroup
        ? Number(existingStudentData.selectedGroup)
        : null,
      ignore_instructor_availability: demoData?.ignoreInstructorAvailability,
      status: "Scheduled",

      // 🔹 Student details
      student_first_name: studentData.firstName,
      student_last_name: studentData.lastName,
      student_email: studentData.email,
      student_phone: studentData.phone || null,
      student_date_of_birth: null, // expect ISO string like "1990-05-15T00:00:00Z"
      student_age_type: studentData.ageType || null, // "kid" | "adult"
      student_gender: studentData.gender || null,
      student_country: studentData.country || null,
      student_city: studentData.city || null,
      student_state: studentData.state || null,
      student_pin: studentData.pin || null,
    };

    // Only include parent details if student is not an adult
    if (studentData.ageType !== "adult") {
      payload.parent_first_name = parentData.parentFirstName;
      payload.parent_last_name = parentData.parentLastName;
      payload.parent_phone = parentData.parentPhone || null;
      payload.parent_email = parentData.parentEmail;
      payload.parent_date_of_birth = null;
    }

    addDemoClassMutation?.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Demo created successfully for new student!",
        });
        navigate("/demos");
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error?.message || "Failed to create demo. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleExistingStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !existingStudentData.selectedGroup &&
      !existingStudentData.selectedStudents
    ) {
      toast({
        title: "Error",
        description: "Please select students or choose a group",
        variant: "destructive",
      });
      return;
    }
    if (
      !selectedCourse ||
      !primaryInstructor ||
      !demoData.date ||
      !demoData.startTime
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required demo details",
        variant: "destructive",
      });
      return;
    }
    // if (existingStudentData.selectedGroup) {
    //   toast({
    //     title: "Error",
    //     description:
    //       "Group demo creation is not supported in this flow. Please select a single student.",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    let selectedStudentObj: any = null;
    if (
      existingStudentData.selectedStudents &&
      typeof existingStudentData.selectedStudents === "string"
    ) {
      selectedStudentObj = (
        Array.isArray(allStudents?.data) ? allStudents.data : []
      ).find(
        (s: any) =>
          String(s.id) === String(existingStudentData.selectedStudents)
      );
    } else if (
      Array.isArray(existingStudentData.selectedStudents) &&
      existingStudentData.selectedStudents.length > 0
    ) {
      // If selectedStudents is an array, take the first one
      selectedStudentObj = (
        Array.isArray(allStudents?.data) ? allStudents.data : []
      ).find(
        (s: any) =>
          String(s.id) === String(existingStudentData.selectedStudents[0])
      );
    }

    if (
      (!existingStudentData.selectedStudents ||
        existingStudentData.selectedStudents.length === 0) &&
      (!existingStudentData.selectedGroup ||
        existingStudentData.selectedGroup === "")
    ) {
      toast({
        title: "Error",
        description: "Please select at least one student or a group.",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      course_id: Number(selectedCourse),
      date: demoData.date, // should already be in ISO format
      start_time: demoData.startTime,
      end_time: demoData.endTime || null,
      primary_instructor: Number(primaryInstructor),
      secondary_instructor:
        secondaryInstructor && secondaryInstructor !== "none"
          ? Number(secondaryInstructor)
          : null,
      group: existingStudentData.selectedGroup
        ? Number(existingStudentData.selectedGroup)
        : null,
      ignore_instructor_availability: demoData?.ignoreInstructorAvailability,
      status: "Scheduled",
      student_id: Number(existingStudentData?.selectedStudents) || null,
    };
    addDemoClassMutation?.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Demo created successfully for existing student!",
        });
        navigate("/demos");
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error?.message || "Failed to create demo. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <DashboardLayout title="Create Demo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/demos")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Button>
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground">
              Create New Demo
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Complete student registration and demo scheduling in one place.
            </p>
          </div>
        </div>

        {/* Student Type Toggle */}
        <Card>
          <CardContent className="pt-6">
            <Tabs
              defaultValue="new-student"
              className="w-full"
              onValueChange={(value) => {
                if (value === "new-student") {
                  setParentData({
                    parentFirstName: "",
                    parentLastName: "",
                    parentEmail: "",
                    parentPhone: "",
                    sameAsParent: false,
                  });
                  setStudentData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    ageType: "",
                    gender: "",
                    country: "",
                    state: "",
                    city: "",
                    pin: "",
                    sameAsParent: false,
                  });
                  setDemoData({
                    date: "",
                    startTime: "",
                    endTime: "",
                    ignoreInstructorAvailability: false,
                  });
                  setSelectedCourse("");
                  setPrimaryInstructor("");
                  setSecondaryInstructor("none");
                } else if (value === "existing-student") {
                  setExistingStudentData({
                    selectedStudents: "",
                    selectedGroup: "",
                    ignoreInstructorAvailability: false,
                  });
                  setDemoData({
                    date: "",
                    startTime: "",
                    endTime: "",
                    ignoreInstructorAvailability: false,
                  });
                  setSelectedCourse("");
                  setPrimaryInstructor("");
                  setSecondaryInstructor("none");
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="new-student">New Student</TabsTrigger>
                <TabsTrigger value="existing-student">
                  Existing Student
                </TabsTrigger>
              </TabsList>

              {/* New Student Tab */}
              <TabsContent value="new-student">
                <form onSubmit={handleNewStudentSubmit} className="space-y-6">
                  {/* Parent Details Section - Only show for kids */}
                  {studentData.ageType !== "adult" && (
                    <ParentDetailsSection
                      parentData={parentData}
                      onParentDataChange={setParentData}
                      onSameAsParentChange={handleSameAsParentChange}
                    />
                  )}

                  {/* Student Details Section */}
                  <StudentDetailsSection
                    studentData={studentData}
                    onStudentDataChange={setStudentData}
                    sameAsParent={parentData.sameAsParent}
                    onAgeTypeChange={handleAgeTypeChange}
                  />

                  {/* Instructor Selection Section */}
                  <SimpleInstructorSelection
                    primaryInstructor={primaryInstructor}
                    secondaryInstructor={secondaryInstructor}
                    onPrimaryInstructorChange={(instructor) => {
                      setPrimaryInstructor(instructor);
                      setSelectedCourse(""); // Clear course when instructor changes
                    }}
                    onSecondaryInstructorChange={setSecondaryInstructor}
                  />

                  <CourseSelectionSection
                    selectedCourse={selectedCourse}
                    onCourseChange={setSelectedCourse}
                    instructorCourses={instructorCourses}
                    primaryInstructor={primaryInstructor}
                  />

                  {/* Demo Details Section */}
                  <DemoDetailsSection
                    demoData={demoData}
                    onDemoDataChange={setDemoData}
                  />

                  {/* Submit Button */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/demos")}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex items-center gap-2"
                          disabled={addDemoClassMutation.isPending}
                        >
                          {addDemoClassMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Creating Demo...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Create Demo
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>

              {/* Existing Student Tab */}
              <TabsContent value="existing-student">
                <form
                  onSubmit={handleExistingStudentSubmit}
                  className="space-y-6"
                >
                  {/* Student/Group Selection */}
                  {/* Student/Group Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Student Selection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Students */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Students{" "}
                          {existingStudentData.selectedGroup
                            ? "(Disabled - Group Selected)"
                            : "*"}
                        </Label>
                        <div className="relative">
                          <Select
                            value={existingStudentData.selectedStudents}
                            onValueChange={(value) =>
                              setExistingStudentData((prev) => ({
                                ...prev,
                                selectedStudents: value,
                                selectedGroup: "", // clear group when student selected
                              }))
                            }
                            disabled={!!existingStudentData.selectedGroup}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select student">
                                {existingStudentData.selectedStudents
                                  ? getStudentLabel(
                                      existingStudentData.selectedStudents
                                    )
                                  : ""}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {(Array.isArray(allStudents?.data)
                                ? allStudents.data
                                : []
                              ).map((student) => (
                                <SelectItem
                                  key={student.id}
                                  value={student.id.toString()}
                                >
                                  {student.first_name} {student.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {existingStudentData.selectedStudents &&
                            existingStudentData.selectedStudents !== "" && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() =>
                                  setExistingStudentData((prev) => ({
                                    ...prev,
                                    selectedStudents: "",
                                  }))
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Select either a student OR a group, not both
                        </p>
                      </div>

                      <div className="space-y-2">
                        {/* Groups */}
                        <Label className="text-sm font-medium">
                          Groups (Optional){" "}
                          {existingStudentData.selectedStudents.length > 0
                            ? "(Disabled - Student Selected)"
                            : ""}
                        </Label>
                        <div className="relative">
                          <Select
                            value={existingStudentData.selectedGroup}
                            onValueChange={(value) =>
                              setExistingStudentData((prev) => ({
                                ...prev,
                                selectedGroup: value,
                                selectedStudent: "", // clear student when group selected
                              }))
                            }
                            disabled={
                              existingStudentData.selectedStudents.length > 0
                            }
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select group">
                                {existingStudentData.selectedGroup
                                  ? getGroupLabel(
                                      existingStudentData.selectedGroup
                                    )
                                  : ""}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {(Array.isArray(allGroupsData)
                                ? allGroupsData
                                : []
                              ).map((group) => (
                                <SelectItem
                                  key={group.id}
                                  value={group.id.toString()}
                                >
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {existingStudentData.selectedGroup && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                              onClick={() =>
                                setExistingStudentData((prev) => ({
                                  ...prev,
                                  selectedGroup: "",
                                }))
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instructor Selection Section */}
                  <SimpleInstructorSelection
                    primaryInstructor={primaryInstructor}
                    secondaryInstructor={secondaryInstructor}
                    onPrimaryInstructorChange={(instructor) => {
                      setPrimaryInstructor(instructor);
                      setSelectedCourse(""); // Clear course when instructor changes
                    }}
                    onSecondaryInstructorChange={setSecondaryInstructor}
                  />

                  {/* Course Selection Section */}
                  <CourseSelectionSection
                    selectedCourse={selectedCourse}
                    onCourseChange={setSelectedCourse}
                    instructorCourses={instructorCourses}
                    primaryInstructor={primaryInstructor}
                  />
                  {/* Course Selection Section */}
                  {/* <CourseSelectionSection
                    instructorCourses={instructorCourses}
                    selectedCourse={selectedCourse}
                    onCourseChange={setSelectedCourse}
                  /> */}

                  {/* Demo Details Section */}
                  <DemoDetailsSection
                    demoData={demoData}
                    onDemoDataChange={setDemoData}
                  />

                  {/* Submit Button */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/demos")}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex items-center gap-2"
                          disabled={addDemoClassMutation.isPending}
                        >
                          {addDemoClassMutation.isPending ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Creating Demo...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Create Demo
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateDemo;
