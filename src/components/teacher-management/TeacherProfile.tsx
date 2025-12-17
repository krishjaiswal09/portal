import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays, Clock, DollarSign, BookOpen, Settings, User, Plus, X, Star, Award, MapPin, Phone, Mail, Languages } from "lucide-react"
import { mockCourses } from "@/data/courseData"

interface TeacherProfileProps {
  teacher: any
  onUpdate: (data: any) => void
}

export function TeacherProfile({ teacher, onUpdate }: TeacherProfileProps) {
  const [availability, setAvailability] = useState([
    { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', enabled: false, startTime: '09:00', endTime: '17:00' },
    { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '17:00' },
  ])

  const [assignedCourses, setAssignedCourses] = useState<string[]>(teacher?.courses || [])
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState('')

  const [settings, setSettings] = useState({
    defaultDuration: '60',
    defaultCategory: 'hindustani-vocal',
    defaultPrice: '50',
    autoAcceptBookings: false,
    allowBackToBack: true,
  })

  const updateAvailability = (dayIndex: number, field: string, value: any) => {
    const updated = [...availability]
    updated[dayIndex] = { ...updated[dayIndex], [field]: value }
    setAvailability(updated)
  }

  const addCourse = () => {
    if (selectedCourseToAdd && !assignedCourses.includes(selectedCourseToAdd)) {
      setAssignedCourses([...assignedCourses, selectedCourseToAdd])
      setSelectedCourseToAdd('')
    }
  }

  const removeCourse = (courseId: string) => {
    setAssignedCourses(assignedCourses.filter(id => id !== courseId))
  }

  const availableCourses = mockCourses.filter(course => !assignedCourses.includes(course.id))

  return (
    <div className="space-y-6">
      {/* Enhanced Teacher Header */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Avatar className="w-20 h-20 md:w-32 md:h-32 mx-auto md:mx-0">
              <AvatarImage src={teacher?.avatar} />
              <AvatarFallback className="text-xl md:text-4xl">
                {teacher?.name?.split(' ').map((n: string) => n[0]).join('') || 'T'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 mb-2">
                  <h2 className="text-xl md:text-3xl font-bold">{teacher?.name || 'Teacher Name'}</h2>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-base md:text-lg font-semibold">{teacher?.rating || '4.5'}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm md:text-lg px-2 md:px-3 py-1">
                  {teacher?.specialization || 'Specialization'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{teacher?.email || 'teacher@example.com'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{teacher?.phone || '+91 00000 00000'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{teacher?.location || 'Location'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span>Experience: {teacher?.experience || '0 years'}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="outline">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {assignedCourses.length} Courses
                </Badge>
                <Badge variant="outline">
                  <User className="w-3 h-3 mr-1" />
                  {teacher?.students?.length || 0} Students
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {teacher?.status || 'Active'}
                </Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Bio Section */}
          {teacher?.bio && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{teacher.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="availability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 text-xs md:text-sm">
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="settings" className="hidden md:block">Settings</TabsTrigger>
          <TabsTrigger value="achievements" className="hidden md:block">Achievements</TabsTrigger>
          <TabsTrigger value="notes" className="hidden md:block">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <CalendarDays className="w-4 h-4 md:w-5 md:h-5" />
                Weekly Availability Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availability.map((day, index) => (
                <div key={day.day} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg">
                  <div className="w-full md:w-24">
                    <Label className="font-medium text-sm md:text-base">{day.day}</Label>
                  </div>
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={(checked) => updateAvailability(index, 'enabled', checked)}
                  />
                  {day.enabled && (
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs md:text-sm">From:</Label>
                        <Input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                          className="w-full sm:w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs md:text-sm">To:</Label>
                        <Input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                          className="w-full sm:w-32"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button className="w-full">Save Availability</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                Course Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Course */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedCourseToAdd} onValueChange={setSelectedCourseToAdd}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a course to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - {course.artform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addCourse} disabled={!selectedCourseToAdd} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Course
                </Button>
              </div>

              {/* Assigned Courses */}
              <div className="space-y-4">
                <h4 className="font-medium text-base md:text-lg">Assigned Courses</h4>
                {assignedCourses.length > 0 ? (
                  <div className="space-y-3">
                    {assignedCourses.map((courseId) => {
                      const course = mockCourses.find(c => c.id === courseId)
                      if (!course) return null
                      
                      return (
                        <div key={courseId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm md:text-base">{course.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{course.artform}</Badge>
                              <Badge variant="secondary" className="text-xs">{course.modules.length} modules</Badge>
                              <Badge variant="outline" className="text-xs">{course.totalStudents} students</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">View</Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeCourse(courseId)}
                              className="flex-1 sm:flex-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground">
                    No courses assigned yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
                Teaching Settings & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Lesson Duration</Label>
                  <Select value={settings.defaultDuration} onValueChange={(value) => setSettings({...settings, defaultDuration: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Default Price per Lesson ($)</Label>
                  <Input
                    type="number"
                    value={settings.defaultPrice}
                    onChange={(e) => setSettings({...settings, defaultPrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-accept Bookings</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve student booking requests</p>
                  </div>
                  <Switch
                    checked={settings.autoAcceptBookings}
                    onCheckedChange={(checked) => setSettings({...settings, autoAcceptBookings: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Allow Back-to-Back Lessons</Label>
                    <p className="text-sm text-muted-foreground">Enable consecutive lesson bookings</p>
                  </div>
                  <Switch
                    checked={settings.allowBackToBack}
                    onCheckedChange={(checked) => setSettings({...settings, allowBackToBack: checked})}
                  />
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Award className="w-4 h-4 md:w-5 md:h-5" />
                Achievements & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Performance Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xl md:text-2xl font-bold text-primary">{teacher?.rating || '4.8'}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Average Rating</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xl md:text-2xl font-bold text-green-600">{teacher?.students?.length || 0}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Active Students</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xl md:text-2xl font-bold text-blue-600">{teacher?.experience || '0'}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Experience</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xl md:text-2xl font-bold text-purple-600">{assignedCourses.length}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Courses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">Teaching Notes & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add notes about teaching methodology, student progress, resources, upcoming events..."
                  rows={6}
                  className="text-sm md:text-base"
                />
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <Button variant="outline" className="w-full sm:w-auto">Attach File</Button>
                  <Button className="w-full sm:w-auto">Save Notes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
