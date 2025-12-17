import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchApi } from "@/services/api/fetchApi"
import { CalendarDays, Users, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { User } from "@/components/user-management/mockData";
import { hasPermission } from "@/utils/checkPermission";

interface TeacherAssignment {
  id?: number
  teacher_id: number
  year: number
  month: number
  slot_number: number
  assigned_at?: string
  created_at?: string
  updated_at?: string
}

interface TeacherManagementData {
  year: number
  month: number
  assignments: {
    slot1: number | null
    slot2: number | null
    slot3: number | null
    slot4: number | null
    slot5: number | null
  }
}

export function StartTeacherManagement() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherManagementData['assignments']>({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null
  })

  const queryClient = useQueryClient()

  // Fetch all teachers
  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ['teachersAssign'],
    queryFn: () => fetchApi<{ data: User[] }>({
      path: 'users',
      params: {
        roles: "instructor"
      }
    })
  })

  const teachers = teachersData?.data || []

  // Fetch existing assignments for selected year/month
  const { data: existingAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['teacher-assignments', selectedYear, selectedMonth],
    queryFn: () =>
      fetchApi<TeacherAssignment[]>({
        path: `teacher-assignments?year=${selectedYear}&month=${selectedMonth}`
      }),
    enabled: !!(selectedYear && selectedMonth)
  })

  // Update assignments when data is fetched
  React.useEffect(() => {
    if (existingAssignments) {
      const assignmentMap: TeacherManagementData['assignments'] = {
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        slot5: null
      }

      existingAssignments.forEach(assignment => {
        const slotKey = `slot${assignment.slot_number}` as keyof typeof assignmentMap
        assignmentMap[slotKey] = assignment.teacher_id
      })

      setTeacherAssignments(assignmentMap)
    }
  }, [existingAssignments])

  // Save assignments mutation
  const saveAssignmentsMutation = useMutation({
    mutationFn: (data: TeacherManagementData) =>
      fetchApi({
        path: 'teacher-assignments/assignments',
        method: 'POST',
        data: data
      }),
    onSuccess: () => {
      toast.success('Teacher assignments saved successfully!')
      queryClient.invalidateQueries({ queryKey: ['teacher-assignments'] })
    },
    onError: (error) => {
      toast.error('Failed to save assignments. Please try again.')
      console.error('Save error:', error)
    }
  })

  const handleTeacherAssignment = (slot: keyof TeacherManagementData['assignments'], teacherId: string) => {
    setTeacherAssignments(prev => ({
      ...prev,
      [slot]: teacherId === 'none' ? null : parseInt(teacherId)
    }))
  }

  const handleSaveAssignments = () => {
    const data: TeacherManagementData = {
      year: selectedYear,
      month: selectedMonth,
      assignments: teacherAssignments
    }
    saveAssignmentsMutation.mutate(data)
  }

  const getMonthName = (monthNumber: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[monthNumber - 1]
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
      years.push(i)
    }
    return years
  }

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: getMonthName(i + 1)
    }))
  }

  const getAvailableTeachers = (currentSlot: keyof TeacherManagementData['assignments']) => {
    const assignedTeacherIds = Object.entries(teacherAssignments)
      .filter(([slot_number, teacherId]) => slot_number !== currentSlot && teacherId !== null)
      .map(([, teacherId]) => teacherId)

    return teachers.filter(teacher => !assignedTeacherIds.includes(Number(teacher.id)))
  }

  const getAssignedTeacherName = (teacherId: number | null) => {
    if (!teacherId) return 'Not assigned'
    const teacher = teachers.find(t => Number(t.id) === teacherId)
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown teacher'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Teacher Management</h1>
      </div>

      {/* Year and Month Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Select Time Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {generateYearOptions().map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select
                value={selectedMonth?.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Managing teacher assignments for {getMonthName(selectedMonth)} {selectedYear}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Slot Teacher Assignments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assign teachers to each slot of the selected month
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {teachersLoading || assignmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading teachers...</span>
            </div>
          ) : (
            <>
              {(Object.keys(teacherAssignments) as Array<keyof TeacherManagementData['assignments']>).map((slot, index) => {
                const slotNumber = index + 1
                const availableTeachers = getAvailableTeachers(slot)
                const currentAssignment = teacherAssignments[slot]

                return (
                  <div key={slot} className="space-y-2">
                    <Label htmlFor={slot} className="text-base font-medium">
                      Slot {slotNumber}
                      {currentAssignment && (
                        <span className="ml-2 text-sm text-green-600 font-normal">
                          (Assigned: {getAssignedTeacherName(currentAssignment)})
                        </span>
                      )}
                    </Label>
                    <Select
                      value={currentAssignment?.toString() || 'none'}
                      onValueChange={(value) => handleTeacherAssignment(slot, value)}
                      disabled={!hasPermission("HAS_EDIT_STAR_TEACHER")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select teacher for slot ${slotNumber}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No teacher assigned</SelectItem>
                        {availableTeachers?.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{teacher.first_name} {teacher.last_name}</span>
                              {teacher.art_form && (
                                <span className="text-xs text-muted-foreground">
                                  {teacher.art_form}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                        {/* Also include currently assigned teacher if exists */}
                        {currentAssignment && !availableTeachers.find(t => Number(t.id) === currentAssignment) && (
                          <SelectItem value={currentAssignment.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {getAssignedTeacherName(currentAssignment)}
                              </span>
                              <span className="text-xs text-blue-600">Currently assigned</span>
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}

              {hasPermission("HAS_CREATE_STAR_TEACHER") && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleSaveAssignments}
                    disabled={saveAssignmentsMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {saveAssignmentsMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Assignments
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Assignment Summary */}
      {teachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(teacherAssignments).map(([slot, teacherId], index) => (
                <div
                  key={slot}
                  className={`p-3 rounded-lg border ${teacherId ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div className="font-medium">Slot {index + 1}</div>
                  <div className="text-sm text-muted-foreground">
                    {getAssignedTeacherName(teacherId)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}