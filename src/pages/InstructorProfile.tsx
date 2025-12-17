
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/DashboardLayout"
import { PayrollAssignmentSection } from "@/components/instructor-management/PayrollAssignmentSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type User as UserType } from "@/components/user-management/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2, Star, User, BookOpen, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { fetchApi } from '@/services/api/fetchApi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useArtForm } from '@/hooks/use-artForms'
import { useToast } from "@/hooks/use-toast";
import { hasPermission } from '@/utils/checkPermission'
import { SectionLoader } from '@/components/ui/loader'

const InstructorProfile = () => {
  const { id } = useParams()

  const { toast } = useToast();
  const { data: artForms = [] } = useArtForm(); // Renamed to artForms for clarity
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState<UserType>()


  const requiredPermission = id
    ? "HAS_EDIT_INSTRUCTOR" // Edit mode
    : "HAS_CREATE_INSTRUCTOR"; // Create mode
  if (!hasPermission(requiredPermission)) {
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

  const usersQueries = useQuery({
    queryKey: ["userWithId"],
    queryFn: () =>
      fetchApi<UserType>({
        path: "users/" + id,
      }),
  });
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      fetchApi<any>({
        path: `users/${userId}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      usersQueries.refetch();
      toast({
        title: "Instructor Deleted Successfully",
        variant: "destructive",
        duration: 3000
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Instructor",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 3000
      });
    },
  });

  useEffect(() => {
    if (
      !usersQueries.isLoading &&
      usersQueries.data
    ) {
      setInstructor(usersQueries.data);
    }
  }, [usersQueries.isLoading, usersQueries.data]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this instructor?')) {
      // console.log('Delete instructor:', instructor?.id)
      deleteUserMutation.mutate(instructor?.id);
      navigate('/instructors')
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <DashboardLayout title={`${instructor?.first_name} ${instructor?.last_name} - Instructor Profile`}>
      <div className="space-y-4 md:space-y-6">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/instructors')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Instructors</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div>
              <h1 className="text-xl md:text-3xl font-playfair font-bold text-foreground">
                Instructor Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage instructor details and assignments
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/instructors/add/${instructor?.id}`)}
              className="flex-1 sm:flex-none"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Instructor Profile Card */}
        {usersQueries.isLoading ? (
          <SectionLoader text="Loading instructor profile..." />
        ) : (
          <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={instructor?.profile_picture_url || ""} />
                <AvatarFallback className="text-2xl font-semibold">
                  {getInitials(instructor?.first_name + " " + instructor?.last_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-foreground">
                      {instructor?.first_name} {instructor?.last_name}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                      <Badge
                        variant={instructor?.is_active ? 'default' : 'secondary'}
                      >
                        {instructor?.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{instructor?.email}</span>
                    </div>
                    {instructor?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{instructor?.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{instructor?.city}, {instructor?.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {new Date(instructor?.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {/* <span className="text-sm font-medium">{instructor?.totalStudents} Students</span> */}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      {/* <span className="text-sm font-medium">{instructor?.totalClasses} Classes</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {instructor?.bio && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-muted-foreground">{instructor?.bio}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Art Forms</h3>
                <div className="flex flex-wrap gap-2">
                  {(instructor?.art_form as unknown as any[])?.map((form) => (
                    <Badge key={form.id} variant="secondary">{artForms.find(v => v.value == form.id) ? artForms.find(v => v.value == form.id).name : "No Art Forms Available"}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {instructor?.languages?.map((lang) => (
                    <Badge key={lang} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Comfortable Age Groups</h3>
                <div className="flex flex-wrap gap-2">
                  {instructor?.age_groups?.map((group) => (
                    <Badge key={`${group.name}_${group.id}`} variant="outline">{group.name}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {(instructor?.certifications as unknown as any[])?.map((cert) => (
                    <Badge key={`${cert.name}_${cert.id}`} variant="outline">{cert.name}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Payroll Assignment Section */}
        {
          hasPermission("HAS_READ_PAYROLL") && <PayrollAssignmentSection
            instructorId={instructor?.id}
            assignments={[]}
          />
        }
      </div>
    </DashboardLayout>
  )
}

export default InstructorProfile
