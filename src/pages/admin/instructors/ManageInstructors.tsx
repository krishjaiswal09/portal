
import { useEffect, useState } from 'react'
import { DashboardLayout } from "@/components/DashboardLayout"
import { InstructorFilters } from "@/components/instructor-management/InstructorFilters"
import { InstructorTable } from "@/components/instructor-management/InstructorTable"
import { Button } from "@/components/ui/button"
import { Plus, Grid, List, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { InstructorFilters as IInstructorFilters } from "@/types/instructor"
import { type User } from "@/components/user-management/mockData";
import { fetchApi } from '@/services/api/fetchApi'
import { useQuery } from '@tanstack/react-query'
import { hasPermission } from '@/utils/checkPermission'
import { SectionLoader } from '@/components/ui/loader'

const ManageInstructor = () => {
  if (!hasPermission("HAS_READ_INSTRUCTOR")) {
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
  const navigate = useNavigate()
  const [filters, setFilters] = useState<IInstructorFilters>({
    search: '',
    artForms: [],
    countries: [],
    status: 'all',
    languages: [],
    kidFriendly: 'all',
    gender: 'all',
    certifications: []
  })
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [instructors, setInstructors] = useState<User[]>([]);

  const usersQueries = useQuery({
    queryKey: ["usersInstructorRole"],
    queryFn: () =>
      fetchApi<{ data: User[] }>({
        path: "users",
        params: { roles: 'instructor' },
      }),
  });

  const artFormsQuery = useQuery({
    queryKey: ["artForms"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "courses/subcategories/all",
      }),
  });

  const certificationsQuery = useQuery({
    queryKey: ["certifications"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "certification",
      }),
  });

  useEffect(() => {
    if (
      !usersQueries.isLoading &&
      usersQueries.data &&
      usersQueries.data.data
    ) {
      const usersData: User[] = usersQueries.data.data?.map((v) => ({
        ...v,
        name: `${v.first_name} ${v.last_name}`,
        email: v.email,
        timezone: v.timezone,
        country: v.country,
        roles: v.roles,
        id: v.id,
        art_form: v.art_form,
        age_group: (v.age_group as unknown as any[])?.map(v => v.id),
        status: v.is_active ? "active" : "inactive",
        is_active: v.is_active,
        age_type: v.age_type,
      }));
      setInstructors(usersData)
    }
  }, [usersQueries.isLoading, usersQueries.data]);

  console.log(filters)

  // Filter instructors based on current filters
  const filteredInstructors = instructors.filter(instructor => {
    // Search filter
    if (filters.search && !instructor.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !instructor.email?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Art forms filter
    if (filters.artForms?.length > 0 && instructor.art_form && !filters.artForms?.some(form => instructor.art_form?.includes(form.toString()))) {
      return false
    }

    // Status filter
    if (filters.status !== 'all' && instructor.status && instructor.status.toLowerCase() !== filters.status) {
      return false
    }

    // Languages filter
    if (filters.languages.length > 0 && instructor.languages && !filters.languages.some(lang => instructor.languages?.includes(lang))) {
      return false
    }

    // Kid friendly filter
    if (filters.kidFriendly !== 'all') {
      return (filters.kidFriendly === 'yes') ? instructor.kid_friendly : !instructor.kid_friendly
    }

    // Gender filter
    if (filters.gender !== 'all' && instructor.gender && instructor.gender !== filters.gender.toLowerCase()) {
      return false
    }

    // Certifications filter
    if (filters.certifications.length > 0) {
      const instructorCerts = (instructor.certifications as unknown as any[]).map(v => v.id) || []
      if (!filters.certifications.some(cert => instructorCerts.includes(cert))) {
        return false
      }
    }

    return true
  })
  const handleAction = (action: string, instructorId: number) => {
    if (action === 'view') {
      navigate(`/admin/instructors/${instructorId}`)
    } else if (action === 'edit') {
      navigate(`/admin/instructors/add/${instructorId}`)
    }
  }

  return (
    <DashboardLayout title="Manage Instructors">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Manage Instructors
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              View and manage all instructor profiles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            {
              hasPermission("HAS_CREATE_INSTRUCTOR") && <Button onClick={() => navigate('add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Instructor
              </Button>
            }
          </div>
        </div>

        <InstructorFilters
          filters={filters}
          onFiltersChange={setFilters}
          artForms={artFormsQuery.data || []}
          certifications={certificationsQuery.data || []}
        />

        {usersQueries.isLoading ? (
          <SectionLoader text="Loading instructors..." />
        ) : (
          <InstructorTable
            instructors={filteredInstructors}
            viewMode={viewMode}
            onAction={handleAction}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageInstructor
