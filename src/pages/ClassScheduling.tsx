
import React, { useState } from 'react'
import { DashboardLayout } from "@/components/DashboardLayout"
import { ClassCalendar } from "@/components/class-management/ClassCalendar"
import { CalendarListView } from "@/components/class-management/CalendarListView"
import { ClassFormModal } from "@/components/class-management/ClassFormModal"
import { ClassFilters } from "@/components/class-management/ClassFilters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, List, Clock, Users, MapPin } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { mockClasses } from "@/data/classData"
import type { Class, ClassFilters as ClassFiltersType } from "@/types/class"
import { ClassStatus } from "@/types/class"

const ClassScheduling = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar')
  const [filters, setFilters] = useState<ClassFiltersType>({
    search: '',
    instructor: 'all',
    category: 'all',
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  })

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => Promise.resolve(mockClasses)
  })

  // Filter classes based on current filters
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                        classItem.instructor.toLowerCase().includes(filters.search.toLowerCase());
    const matchesInstructor = filters.instructor === 'all' || classItem.instructor === filters.instructor;
    const matchesCategory = filters.category === 'all' || classItem.category === filters.category;
    const matchesType = filters.type === 'all' || classItem.type === filters.type;
    const matchesStatus = filters.status === 'all' || classItem.status === filters.status;
    
    return matchesSearch && matchesInstructor && matchesCategory && matchesType && matchesStatus;
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedClass(null)
    setIsModalOpen(true)
  }

  const handleClassClick = (classItem: Class) => {
    setSelectedClass(classItem)
    setIsModalOpen(true)
  }

  const handleCreateClass = () => {
    setSelectedDate(new Date())
    setSelectedClass(null)
    setIsModalOpen(true)
  }

  const handleSaveClass = (classData: any) => {
    console.log('Saving class:', classData)
    setIsModalOpen(false)
  }

  const handleDeleteClass = (classId: string) => {
    console.log('Deleting class:', classId)
    setIsModalOpen(false)
  }

  const handleEditClass = (classItem: Class) => {
    setSelectedClass(classItem)
    setIsModalOpen(true)
  }

  const handleClassUpdate = (id: string, updates: any) => {
    console.log('Updating class:', id, updates)
  }

  const handleJoinClass = (classId: string) => {
    console.log('Starting class:', classId)
  }

  const handleCancelClass = (classId: string) => {
    console.log('Cancelling class:', classId)
  }

  const handleRescheduleClass = (classId: string) => {
    console.log('Rescheduling class:', classId)
  }

  // Transform classes for calendar events
  const calendarEvents = filteredClasses.map(classItem => {
    const startTime = new Date(`${classItem.startDate}T${classItem.startTime}`)
    const durationMinutes = typeof classItem.duration === 'number' 
      ? classItem.duration 
      : parseInt(String(classItem.duration), 10) || 60
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000)

    return {
      id: classItem.id,
      title: classItem.title,
      start: startTime,
      end: endTime,
      backgroundColor: getStatusColor(classItem.status),
      borderColor: getStatusColor(classItem.status),
      extendedProps: {
        ...classItem,
        instructor: classItem.instructor,
        students: classItem.students || [],
        location: classItem.location
      }
    }
  })

  function getStatusColor(status: ClassStatus) {
    switch (status) {
      case ClassStatus.SCHEDULED:
        return '#10b981'
      case ClassStatus.ONGOING:
        return '#f59e0b'
      case ClassStatus.COMPLETED:
        return '#6b7280'
      case ClassStatus.CANCELLED:
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  // Get today's classes
  const today = new Date().toISOString().split('T')[0]
  const todaysClasses = filteredClasses.filter(classItem => 
    classItem.startDate === today
  )

  // Get upcoming classes (next 7 days)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const upcomingClasses = filteredClasses.filter(classItem => {
    const classDate = new Date(classItem.startDate)
    return classDate > new Date() && classDate <= nextWeek
  })

  if (isLoading) {
    return (
      <DashboardLayout title="Class Scheduling">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading classes...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Class Scheduling">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Class Scheduling
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage and schedule art classes
            </p>
          </div>
          <Button onClick={handleCreateClass} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Class
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Classes</p>
                  <p className="text-xl font-bold">{todaysClasses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-xl font-bold">{upcomingClasses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-xl font-bold">
                    {filteredClasses.reduce((total, classItem) => total + (classItem.enrolledStudents || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Locations</p>
                  <p className="text-xl font-bold">
                    {new Set(filteredClasses.map(c => c.location)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <ClassFilters filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        {/* Calendar/List View */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold">Schedule Overview</CardTitle>
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'calendar' | 'list')}>
                <TabsList>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {activeView === 'calendar' ? (
              <ClassCalendar
                classes={filteredClasses}
                onClassClick={handleClassClick}
                onClassUpdate={handleClassUpdate}
              />
            ) : (
              <CalendarListView
                classes={filteredClasses}
                onEdit={handleEditClass}
                onDelete={handleDeleteClass}
                onJoin={handleJoinClass}
                onCancel={handleCancelClass}
                onReschedule={handleRescheduleClass}
              />
            )}
          </CardContent>
        </Card>

        {/* Class Modal */}
        <ClassFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
        />
      </div>
    </DashboardLayout>
  )
}

export default ClassScheduling
