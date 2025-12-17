import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ClassTable } from "@/components/class-management/ClassTable";
import { ClassCancelRescheduleModal } from "@/components/class-management/ClassCancelRescheduleModal";
import { TablePagination } from "@/components/ui/table-pagination";
import { useClassStore } from "@/stores/classStore";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { fetchApi } from "@/services/api/fetchApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hasPermission } from "@/utils/checkPermission";
import { SectionLoader } from "@/components/ui/loader";

const ClassManagement = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_READ_CLASS")) {
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
  const queryClient = useQueryClient();
  const { filters, setFilters, deleteClass } = useClassStore();

  const [cancelRescheduleModalOpen, setCancelRescheduleModalOpen] =
    useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: allClasses, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: () =>
      fetchApi<any>({
        path: "classes/class-schedule",
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

  const { data: classTypes } = useQuery({
    queryKey: ["classTypes"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
  });

  const editClassReschdule = useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      fetchApi({
        path: `classes/class-schedule/${data.id}`,
        method: "PATCH",
        data: data.payload,
      }),
  });

  const AllInstrcutors: any = Instructor?.data;
  const AllCourses: any = allCourses;
  const AllClassTypes: any = classTypes;

  // Transform API data to match table expectations
  const transformedClasses = useMemo(() => {
    if (!allClasses?.total_classes || !Array.isArray(allClasses.total_classes)) {
      console.log('No classes or not array:', allClasses);
      return [];
    }

    return allClasses?.total_classes?.map((classItem: any) => ({
      id: classItem.id.toString(),
      title: classItem.title || "Untitled Class",
      instructor:
        `${classItem.primary_instructor_first_name || ""} ${classItem.primary_instructor_last_name || ""
          }`.trim() || "Unknown Instructor",
      category: classItem.course_title || "Unknown Course",
      type: classItem.class_type_name || "Unknown Type",
      course: classItem.course_title,
      startDate: classItem.start_date
        ? new Date(classItem.start_date).toLocaleDateString()
        : "N/A",
      startTime: classItem.start_time || "N/A",
      endTime: classItem.end_time || "N/A",
      duration: classItem.class_type_name?.includes("40") ? 40 : 60,
      maxStudents: classItem.group ? 10 : 1,
      enrolledStudents: classItem.group ? 1 : 1,
      status: classItem.status || "scheduled",
      notes: classItem.notes,
      classCode: classItem.id.toString(),
      students: classItem.student ? [classItem.student] : [],
      studentName:
        classItem.student_first_name 
          ? `${classItem.student_first_name} ${classItem?.student_last_name}`
          : classItem.group_name || "N/A",
      additionalInstructors: classItem.secondary_instructor
        ? [classItem.secondary_instructor]
        : [],
      meetingType: classItem.meeting_type,
      meetingLink: classItem.meeting_link,
      groupName: classItem.group_name,
      canJoin: classItem.canJoin || false,
      canCancel: classItem.canCancel || false,
      canReschedule: classItem.canReschedule || false,
      originalData: classItem,
      cancelation_reason_text: classItem.cancelation_reason_text || null,
      reschedule_history: classItem.reschedule_history || [],
      class_recording: classItem.class_recording || null,
    }));
  }, [allClasses]);

  // Apply filters to transformed classes
  const filteredClasses = useMemo(() => {
    if (!transformedClasses.length) return [];

    return transformedClasses.filter((classItem) => {
      const matchesSearch =
        classItem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        classItem.instructor
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        classItem.category.toLowerCase().includes(filters.search.toLowerCase());

      const matchesInstructor =
        filters.instructor === "all" ||
        classItem.instructor
          .toLowerCase()
          .includes(filters.instructor.toLowerCase());

      const matchesCategory =
        filters.category === "all" || classItem.category === filters.category;

      const matchesType =
        filters.type === "all" || classItem.type === filters.type;

      const matchesStatus =
        filters.status === "all" || classItem.status === filters.status;

      let matchesDateRange = true;
      if (filters.startDate && filters.endDate) {
        const classDate = new Date(classItem.originalData.start_date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        matchesDateRange = classDate >= startDate && classDate <= endDate;
      }

      return (
        matchesSearch &&
        matchesInstructor &&
        matchesCategory &&
        matchesType &&
        matchesStatus &&
        matchesDateRange
      );
    });
  }, [transformedClasses, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClasses.length / pageSize);
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleCreateClass = () => {
    navigate("/classes/create");
  };

  const handleEditClass = (classItem: any) => {
    toast({
      title: "Edit Feature",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleDeleteClass = (classId: string) => {
    const classItem = filteredClasses?.find((c) => c.id === classId);
    if (!classItem) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the class "${classItem.title}" for ${classItem.studentName}?\n\nThis action cannot be undone.`
    );

    if (confirmDelete) {
      fetchApi({
        path: `classes/class-schedule/${classId}`,
        method: "DELETE",
      })
        .then(() => {
          toast({
            title: "Class Deleted",
            description: "The class has been successfully deleted.",
            variant: "destructive",
          });
          queryClient.invalidateQueries({ queryKey: ["classes"] });
        })
        .catch((error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to delete class.",
            variant: "destructive",
          });
        });
    }
  };

  const handleJoinClass = (classId: string) => {
    toast({
      title: "Starting Class",
      description: "Opening class session...",
    });
  };

  const handleCancelClass = (data: {
    classId: string;
    cancelReason: { id: number; name: string; enabled: boolean };
  }) => {
    if (!data?.classId || !data?.cancelReason?.id) {
      toast({
        title: "Error",
        description: "Missing class or reason for cancellation.",
        variant: "destructive",
      });
      return;
    }
    editClassReschdule.mutate(
      {
        id: data.classId,
        payload: {
          reason: data.cancelReason.id,
          status: "cancelled",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Class Cancelled",
            description: `Class cancelled. Reason: ${data.cancelReason.name}`,
            variant: "destructive",
          });
          handleModalClose();
          queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to cancel class.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRescheduleClass = (classId: string) => {
    const classItem = filteredClasses.find((c) => c.id === classId);
    setSelectedClass(classItem);
    setCancelRescheduleModalOpen(true);
  };

  const handleModalClose = () => {
    setCancelRescheduleModalOpen(false);
    setSelectedClass(null);
  };

  const handleCancelSubmit = (reason: string) => {
    toast({
      title: "Class Cancelled",
      description: `Class cancelled. Reason: ${reason}`,
      variant: "destructive",
    });
  };

  const handleRescheduleSubmit = (rescheduleData: any) => {
    toast({
      title: "Class Rescheduled",
      description: `Class rescheduled to ${rescheduleData.date} at ${rescheduleData.time}`,
    });
  };

  // Check if any filters are applied
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.instructor !== "all" ||
      filters.category !== "all" ||
      filters.type !== "all" ||
      filters.status !== "all" ||
      filters.startDate !== "" ||
      filters.endDate !== ""
    );
  }, [filters]);

  // Prepare options for dropdowns
  const instructorOptions = [
    { label: "All Instructors", value: "all" },
    ...(AllInstrcutors?.data
      ? AllInstrcutors?.data?.map((instructor: any) => ({
        label: `${instructor.first_name} ${instructor.last_name}`,
        value: `${instructor.first_name} ${instructor.last_name}`,
      }))
      : []),
  ];

  const courseOptions = [
    { label: "All Courses", value: "all" },
    ...(Array.isArray(AllCourses?.data)
      ? AllCourses?.data?.map((course: any) => ({
        label: course.title,
        value: course.title,
      }))
      : []),
  ];

  const typeOptions = [
    { label: "All Types", value: "all" },
    ...(Array.isArray(AllClassTypes)
      ? AllClassTypes?.map((type: any) => ({
        label: type.name,
        value: type.name,
      }))
      : []),
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  if (isLoadingClasses) {
    return (
      <DashboardLayout title="Manage Classes">
        <SectionLoader text="Loading classes..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Classes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground">
              Manage Classes
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Create, edit, and manage your art classes efficiently.
            </p>
          </div>
          {
            hasPermission("HAS_CREATE_CLASS") && <Button
              onClick={() => navigate("/classes/create")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Create Class
            </Button>
          }
        </div>

        {/* Filter Panel */}
        <section className="rounded-2xl border border-border bg-background p-4 md:p-6 shadow-xl space-y-4 md:space-y-6">
          {/* Search Bar & Dropdown Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
            <div className="flex-1 min-w-[150px]">
              <Input
                type="text"
                placeholder="🔍 Search classes..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-4 py-2 border border-input rounded-md text-sm bg-background"
              />
            </div>

            <SearchableSelect
              options={instructorOptions}
              value={filters.instructor || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  instructor: value === "all" ? "" : value,
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
              value={filters.category || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  category: value === "all" ? "" : value,
                })
              }
              placeholder="All Courses"
              className="w-full sm:w-[180px]"
              searchPlaceholder="Search courses..."
              showClearButton={true}
              handleClear={() => setFilters({ ...filters, category: "" })}
            />

            <SearchableSelect
              options={typeOptions}
              value={filters.type || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, type: value === "all" ? "" : value })
              }
              placeholder="All Types"
              className="w-full sm:w-[180px]"
              searchPlaceholder="Search types..."
              showClearButton={true}
              handleClear={() => setFilters({ ...filters, type: "" })}
            />

            <SearchableSelect
              options={statusOptions}
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value === "all" ? "" : value })
              }
              placeholder="All Statuses"
              className="w-full sm:w-[180px]"
              searchPlaceholder="Search statuses..."
              showClearButton={true}
              handleClear={() => setFilters({ ...filters, status: "" })}
            />
          </div>

          {/* Date Range & Quick Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 md:gap-4">
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 md:gap-4">
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
              <Button size="sm" className="w-full sm:w-auto px-4">
                Go
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={(() => {
                  const today = new Date().toISOString().split('T')[0];
                  return filters.startDate === today && filters.endDate === today ? "default" : "outline";
                })()}
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setFilters({ ...filters, startDate: today, endDate: today });
                }}
                className="text-xs"
              >
                Today
              </Button>
              <Button
                variant={(() => {
                  const today = new Date();
                  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
                  return filters.startDate === startOfWeek.toISOString().split('T')[0] &&
                    filters.endDate === endOfWeek.toISOString().split('T')[0] ? "default" : "outline";
                })()}
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
                  setFilters({
                    ...filters,
                    startDate: startOfWeek.toISOString().split('T')[0],
                    endDate: endOfWeek.toISOString().split('T')[0]
                  });
                }}
                className="text-xs"
              >
                This Week
              </Button>
              <Button
                variant={(() => {
                  const today = new Date();
                  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                  return filters.startDate === startOfMonth.toISOString().split('T')[0] &&
                    filters.endDate === endOfMonth.toISOString().split('T')[0] ? "default" : "outline";
                })()}
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                  setFilters({
                    ...filters,
                    startDate: startOfMonth.toISOString().split('T')[0],
                    endDate: endOfMonth.toISOString().split('T')[0]
                  });
                }}
                className="text-xs"
              >
                This Month
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={!hasActiveFilters}
                onClick={() => {
                  setFilters({
                    search: "",
                    instructor: "all",
                    category: "all",
                    type: "all",
                    status: "all",
                    startDate: "",
                    endDate: ""
                  });
                }}
                className="text-xs"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Class Table */}
        <section className="rounded-2xl border border-border bg-background p-4 md:p-6 shadow-xl">
          <div className="space-y-4">
            <ClassTable
              classes={paginatedClasses}
              onEdit={(classItem) => {
                toast({
                  title: "Edit Feature",
                  description: "Edit functionality will be implemented soon.",
                });
              }}
              onDelete={handleDeleteClass}
              onJoin={(classId) => {
                toast({
                  title: "Starting Class",
                  description: "Opening class session...",
                });
              }}
              onCancel={(classId) => {
                const classItem = filteredClasses.find((c) => c.id === classId);
                setSelectedClass(classItem);
                setCancelRescheduleModalOpen(true);
              }}
              onReschedule={(classId) => {
                const classItem = filteredClasses.find((c) => c.id === classId);
                setSelectedClass(classItem);
                setCancelRescheduleModalOpen(true);
              }}
            />

            {filteredClasses.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredClasses.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 20, 50]}
              />
            )}
          </div>
        </section>

        {/* Cancel/Reschedule Modal */}
        <ClassCancelRescheduleModal
          isOpen={cancelRescheduleModalOpen}
          onClose={handleModalClose}
          // onCancel={(reason) => {
          //   toast({
          //     title: "Class Cancelled",
          //     description: `Class cancelled. Reason: ${reason}`,
          //     variant: "destructive",
          //   });
          // }}
          onCancel={(reason) => {
            handleCancelClass(reason);
          }}
          onReschedule={(rescheduleData) => {
            toast({
              title: "Class Rescheduled",
              description: `Class rescheduled to ${rescheduleData.date} at ${rescheduleData.time}`,
            });
          }}
          classInfo={selectedClass}
          canCancel={selectedClass?.canCancel}
          canReschedule={selectedClass?.canReschedule}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClassManagement;
