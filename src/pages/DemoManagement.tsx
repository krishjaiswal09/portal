import React, { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DemoTable } from "@/components/demo-management/DemoTable";
import { DemoNotesModal } from "@/components/demo-management/DemoNotesModal";
import { DemoAttendanceModal } from "@/components/demo-management/DemoAttendanceModal";
import { DemoRecordingsModal } from "@/components/demo-management/DemoRecordingsModal";
import { DemoCancelRescheduleModal } from "@/components/demo-management/DemoCancelRescheduleModal";
import { useDemoStore } from "@/stores/demoStore";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { hasPermission } from "@/utils/checkPermission";
import { SectionLoader } from "@/components/ui/loader";

const DemoManagement = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_READ_DEMO_CLASS")) {
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
  const {
    filters,
    selectedDemos,
    getFilteredDemos,
    setFilters,
    toggleDemoSelection,
    selectAllDemos,
    bulkCancelDemos,
  } = useDemoStore();
  const queryClient = useQueryClient();

  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [recordingsModalOpen, setRecordingsModalOpen] = useState(false);
  const [cancelRescheduleModalOpen, setCancelRescheduleModalOpen] =
    useState(false);
  const [selectedDemo, setSelectedDemo] = useState<any>(null);

  const { data: allDemoClasses = [], isLoading: isDemoClassesLoading } = useQuery({
    queryKey: ["allDemoClasses"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/demo-class",
      }),
  });

  const Instructor = useQuery({
    queryKey: ["allInstructor"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "users?roles=instructor",
      }),
  });

  const { data: allCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "courses",
      }),
  });

  const editDemoReschdule = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      fetchApi({
        path: `classes/demo-class/${data.id}`,
        method: "PUT",
        data: data.payload,
      }),
  });

  const AllInstrcutors: any = Instructor?.data;
  const AllCourses: any = allCourses;

  const handleCreateDemo = () => {
    navigate("/demos/create");
  };

  const handleJoinDemo = (demoId: string, meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
      toast({
        title: "Starting Demo Session",
        description: "Opening demo class session in a new tab...",
      });
    } else {
      toast({
        title: "No Meeting Link",
        description: "No meeting link is available for this demo.",
        variant: "destructive",
      });
    }
  };

  const handleCancelReschedule = (demoId: number) => {
    const demo = filteredDemos?.find((d) => d.id === demoId);
    setSelectedDemo(demo);
    setCancelRescheduleModalOpen(true);
  };

  const handleAddNotes = (demoId: number) => {
    const demo = filteredDemos?.find((d) => d.id === demoId);
    setSelectedDemo(demo);
    setNotesModalOpen(true);
  };

  const handleMarkAttendance = (demoId: number) => {
    const demo = filteredDemos?.find((d) => d.id === demoId);
    setSelectedDemo(demo);
    setAttendanceModalOpen(true);
  };

  const handleViewRecordings = (demoId: number) => {
    const demo = filteredDemos?.find((d) => d.id === demoId);
    setSelectedDemo(demo);
    setRecordingsModalOpen(true);
  };

  const handleCancelDemo = (data: {
    demoId: string;
    cancelReason: { id: number; name: string; enabled: boolean };
  }) => {
    editDemoReschdule.mutate(
      {
        id: data.demoId,
        payload: {
          reason: data.cancelReason.id,
          status: "cancelled",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Demo Cancelled",
            description: `Demo cancelled. Reason: ${data.cancelReason.name}`,
            variant: "destructive",
          });
          setCancelRescheduleModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["allDemoClasses"] });
          // Optionally, refetch demo list here if needed
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to cancel demo.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRescheduleDemo = (rescheduleData: any) => {
    toast({
      title: "Demo Rescheduled",
      description: `Demo rescheduled to ${rescheduleData.date} at ${rescheduleData.time}`,
    });
  };

  type NotesData = {
    demoId: string;
    notes: string;
  };

  const handleSaveNotes = (notes: NotesData) => {
    if (!notes.demoId) {
      toast({
        title: "Error",
        description: "No demo selected to save notes.",
        variant: "destructive",
      });
      return;
    }
    editDemoReschdule.mutate(
      {
        id: notes.demoId,
        payload: {
          notes: notes.notes,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Notes Saved",
            description: "Demo notes have been saved successfully.",
          });
          queryClient.invalidateQueries({ queryKey: ["allDemoClasses"] });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to save notes.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSaveAttendance = (entries: any[]) => {
    toast({
      title: "Attendance Saved",
      description: "Attendance has been saved successfully.",
    });
  };

  const handleSaveRecordings = (recordings: any[]) => {
    toast({
      title: "Recordings Saved",
      description: "Class recordings have been saved successfully.",
    });
  };

  const handleDeleteDemo = (demoId: number) => {
    const demo = filteredDemos?.find((d) => d.id === demoId);
    if (!demo) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the Demo Class for ${demo.student_first_name} ${demo.student_last_name}?\n\nThis action cannot be undone.`
    );

    if (confirmDelete) {
      fetchApi({
        path: `classes/demo-class/${demoId}`,
        method: "DELETE",
      })
        .then(() => {
          toast({
            title: "Demo Deleted",
            description: "Demo class has been deleted successfully.",
            variant: "destructive",
          });
          queryClient.invalidateQueries({ queryKey: ["allDemoClasses"] });
        })
        .catch((error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to delete demo class.",
            variant: "destructive",
          });
        });
    }
  };

  const handleBulkCancel = () => {
    if (selectedDemos.length === 0) {
      toast({
        title: "No Demos Selected",
        description: "Please select demos to cancel.",
        variant: "destructive",
      });
      return;
    }

    bulkCancelDemos(selectedDemos);
    toast({
      title: "Demos Cancelled",
      description: `${selectedDemos.length} demo(s) have been cancelled.`,
      variant: "destructive",
    });
  };



  // Filter and search functionality
  const filteredDemos = allDemoClasses.filter((demo: any) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      !searchTerm || demo.course_name?.toLowerCase().includes(searchTerm);

    const matchesInstructor =
      !filters.instructor ||
      `${demo.primary_instructor_first_name} ${demo.primary_instructor_last_name}` ===
      filters.instructor;

    const matchesCourse =
      !filters.artForm || demo.course_name === filters.artForm;

    const matchesType =
      !filters.demoType ||
      (filters.demoType === "Group" && demo.group_name) ||
      (filters.demoType === "Private" && !demo.group_name);

    const demoDate = new Date(demo.date);
    const matchesStartDate =
      !filters.startDate || demoDate >= new Date(filters.startDate);
    const matchesEndDate =
      !filters.endDate || demoDate <= new Date(filters.endDate);

    return (
      matchesSearch &&
      matchesInstructor &&
      matchesCourse &&
      matchesType &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Found ${filteredDemos.length} demo(s) matching your criteria.`,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      instructor: "",
      artForm: "",
      demoType: "",
      startDate: "",
      endDate: "",
    });
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
  };

  // Prepare options for dropdowns
  const instructorOptions = [
    { label: "All Instructors", value: "" },
    ...(AllInstrcutors?.data
      ? AllInstrcutors?.data?.map((instructor: any) => ({
        label: `${instructor.first_name} ${instructor.last_name}`,
        value: `${instructor.first_name} ${instructor.last_name}`,
      }))
      : []),
  ];

  const courseOptions = [
    { label: "All Courses", value: "" },
    ...(Array.isArray(AllCourses?.data)
      ? AllCourses?.data?.map((course: any) => ({
        label: course.title,
        value: course.title,
      }))
      : []),
  ];

  const demoTypeOptions = [
    { label: "All Demo Types", value: "" },
    { label: "Group", value: "Group" },
    { label: "Private", value: "Private" },
    { label: "One-on-One", value: "One-on-One" },
  ];

  return (
    <DashboardLayout title="Manage Demos">
      <div className="space-y-4 px-2 md:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground">
              Manage Demos
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Create, view, and manage all demo classes efficiently.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleCreateDemo}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl shadow-lg w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Create Demo
            </Button>

            {selectedDemos.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkCancel}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <X className="h-4 w-4" />
                Cancel Selected ({selectedDemos.length})
              </Button>
            )}
          </div>
        </div>

        {/* Compact Filter Panel */}
        <section className="rounded-2xl border border-border bg-background p-4 shadow-xl space-y-4">
          {/* Search Bar & Dropdown Filters in a compact layout */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-end">
            <div className="flex-1 min-w-[280px] relative">
              <Input
                type="text"
                placeholder="Search by course name..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-input rounded-md text-sm bg-background pr-8"
              />
              {/* {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )} */}
            </div>

            <SearchableSelect
              options={instructorOptions}
              value={filters.instructor || ""}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  instructor: value === "" ? "" : value,
                })
              }
              placeholder="All Instructors"
              className="w-full sm:w-[180px]"
              searchPlaceholder="Search instructors..."
              showClearButton={true}
              handleClear={() => setFilters({ ...filters, instructor: "" })}
            />

            <SearchableSelect
              options={courseOptions}
              value={filters.artForm || ""}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  artForm: value === "" ? "" : value,
                })
              }
              placeholder="All Courses"
              className="w-full sm:w-[180px]"
              searchPlaceholder="Search courses..."
              showClearButton={true}
              handleClear={() => setFilters({ ...filters, artForm: "" })}
            />

            {/* <SearchableSelect
              options={demoTypeOptions}
              value={filters.demoType || ""}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  demoType: value === "" ? "" : value,
                })
              }
              placeholder="All Demo Types"
              className="w-full sm:w-[180px]"
              searchPlaceholder="Search demo types..."
            /> */}
          </div>

          {/* Compact Date Range */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full sm:w-auto px-3 py-2 border border-input rounded-md text-sm"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full sm:w-auto px-3 py-2 border border-input rounded-md text-sm"
            />
            <Button
              size="sm"
              className="w-full sm:w-auto px-4"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            {/* <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto px-4"
              onClick={handleResetFilters}
            >
              Reset All
            </Button> */}
          </div>
        </section>

        {/* Demo Table */}
        <section className="rounded-2xl border border-border bg-background p-4 md:p-6 shadow-xl">
          {isDemoClassesLoading ? (
            <SectionLoader text="Loading demo classes..." />
          ) : (
            <DemoTable
              demos={filteredDemos}
              selectedDemos={selectedDemos?.map(Number)}
              onToggleSelection={(demoId: number) =>
                toggleDemoSelection(demoId.toString())
              }
              onSelectAll={selectAllDemos}
              onJoinDemo={(demoId: number, demoLink: string) =>
                handleJoinDemo(demoId.toString(), demoLink)
              }
              onCancelReschedule={handleCancelReschedule}
              onAddNotes={handleAddNotes}
              onMarkAttendance={handleMarkAttendance}
              onViewRecordings={handleViewRecordings}
              onDeleteDemo={handleDeleteDemo}
            />
          )}
        </section>

        {/* Demo Modals */}
        <DemoNotesModal
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          onSave={handleSaveNotes}
          demoId={selectedDemo?.id}
          existingNotes={selectedDemo?.notes}
        />

        <DemoAttendanceModal
          isOpen={attendanceModalOpen}
          onClose={() => setAttendanceModalOpen(false)}
          selectedDemo={selectedDemo}
        />

        <DemoRecordingsModal
          isOpen={recordingsModalOpen}
          onClose={() => setRecordingsModalOpen(false)}
          onSave={handleSaveRecordings}
          demoId={selectedDemo?.id}
        />

        <DemoCancelRescheduleModal
          isOpen={cancelRescheduleModalOpen}
          onClose={() => setCancelRescheduleModalOpen(false)}
          // onCancel={handleCancelDemo}
          onCancel={(reason) => {
            handleCancelDemo(reason);
          }}
          onReschedule={handleRescheduleDemo}
          demoInfo={selectedDemo}
        />
      </div>
    </DashboardLayout>
  );
};

export default DemoManagement;
