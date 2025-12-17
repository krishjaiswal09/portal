import { useState } from 'react';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, ArrowLeft, Users, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { SectionLoader } from '@/components/ui/loader';

interface ReportFilters {
  course: string;
  instructor: string;
  status: string;
  studentName: string;
  dateRange: {
    from: string;
    to: string;
  };
}

interface LearnerDetail {
  learner_name: string;
  learner_email: string;
  attendance: string;
  join_time?: string;
  leave_time?: string;
  notes?: string;
}

interface ILTClass {
  class_id: number;
  course_name: string;
  instructor_name: string;
  instructor_email: string;
  instructor_aide_name?: string;
  instructor_aide_email?: string;
  student_names: string;
  class_date: string;
  class_time: string;
  attendance: string;
  status: string;
  recording_available: string;
  topics_covered?: string;
  class_title: string;
  meeting_link?: string;
  learner_details: LearnerDetail[];
}

interface ILTReportResponse {
  total_count: number;
  classes: ILTClass[];
  summary: {
    completed: number;
    scheduled: number;
    cancelled: number;
    total_with_recording: number;
    total_students: number;
    total_instructors: number;
  };
}

export default function ILTReport() {
  const navigate = useNavigate();

  if (!hasPermission("HAS_READ_REPORTS")) {
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

  const [filters, setFilters] = useState<ReportFilters>({
    course: 'all-courses',
    instructor: 'all-instructors',
    status: 'all',
    studentName: '',
    dateRange: {
      from: '',
      to: ''
    }
  });
  const [selectedClass, setSelectedClass] = useState<ILTClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const iltReportQuery = useQuery<ILTReportResponse>({
    queryKey: ['iltReport'],
    queryFn: () => fetchApi({ path: 'classes/ilt-report' })
  });

  const classesData = iltReportQuery.data?.classes || [];
  const summary = iltReportQuery.data?.summary;

  const courseOptions = Array.from(new Set(classesData.map(item => item.course_name))).filter(course => course && course.trim() !== '');
  const instructorOptions = Array.from(new Set(classesData.map(item => item.instructor_name))).filter(instructor => instructor && instructor.trim() !== '');

  const filteredData = classesData.filter(item => {
    if (filters.course && filters.course !== 'all-courses' && !item.course_name.toLowerCase().includes(filters.course.toLowerCase())) return false;
    if (filters.instructor && filters.instructor !== 'all-instructors' && !item.instructor_name.toLowerCase().includes(filters.instructor.toLowerCase())) return false;
    if (filters.status !== 'all' && item.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    if (filters.studentName && !item.student_names.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
    if (filters.dateRange?.from && item.class_date < filters.dateRange.from) return false;
    if (filters.dateRange?.to && item.class_date > filters.dateRange.to) return false;
    return true;
  });

  const handleViewDetails = (classItem: ILTClass) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    console.log('Exporting ILT Report to CSV...');
  };

  const resetFilters = () => {
    setFilters({
      course: 'all-courses',
      instructor: 'all-instructors',
      status: 'all',
      studentName: '',
      dateRange: {
        from: '',
        to: ''
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'in progress': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <Badge className={variants[statusLower as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <ReportLayout title="ILT Report" description="Instructor-Led Training detailed logs with attendance and ratings">
      <div className="space-y-6">
        {/* Summary Cards */}
        {iltReportQuery.isLoading ? (
          <SectionLoader text="Loading ILT report data..." />
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{summary.scheduled}</p>
                  <p className="text-muted-foreground">Scheduled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{summary.completed}</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{summary.total_students}</p>
                  <p className="text-muted-foreground">Students</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <BookOpen className="h-8 w-8 text-orange-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{summary.total_instructors}</p>
                  <p className="text-muted-foreground">Instructors</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select value={filters.course} onValueChange={(value) => setFilters({ ...filters, course: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-courses">All Courses</SelectItem>
                  {courseOptions.map((course) => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.instructor} onValueChange={(value) => setFilters({ ...filters, instructor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-instructors">All Instructors</SelectItem>
                  {instructorOptions.map((instructor) => (
                    <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search Student Name"
                value={filters.studentName}
                onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Input
                  type="date"
                  value={filters.dateRange?.from || ''}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, from: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Input
                  type="date"
                  value={filters.dateRange?.to || ''}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, to: e.target.value } })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters}>Reset</Button>
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardContent className="p-0">
            {iltReportQuery.isLoading ? (
              <SectionLoader text="Loading report table..." />
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Instructor Name</TableHead>
                  <TableHead>Student Name(s)</TableHead>
                  <TableHead>Class Date</TableHead>
                  <TableHead>Class Time</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recording</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.class_id}>
                    <TableCell className="font-medium">{item.course_name}</TableCell>
                    <TableCell>{item.instructor_name}</TableCell>
                    <TableCell>{item.student_names || 'No students'}</TableCell>
                    <TableCell>{new Date(item.class_date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.class_time}</TableCell>
                    <TableCell>{item.attendance}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Badge variant={item.recording_available === 'Yes' ? 'default' : 'secondary'}>
                        {item.recording_available}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Class Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Class Details - {selectedClass?.class_title}</DialogTitle>
              <DialogDescription>
                Detailed information about the class including learner attendance and notes.
              </DialogDescription>
            </DialogHeader>
            {selectedClass && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Course:</label>
                    <p className="mt-1">{selectedClass.course_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Instructor:</label>
                    <p className="mt-1">{selectedClass.instructor_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date:</label>
                    <p className="mt-1">{new Date(selectedClass.class_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time:</label>
                    <p className="mt-1">{selectedClass.class_time}</p>
                  </div>
                </div>

                {selectedClass.topics_covered && (
                  <div>
                    <label className="text-sm font-medium">Topics Covered:</label>
                    <p className="mt-1">{selectedClass.topics_covered}</p>
                  </div>
                )}

                {selectedClass.meeting_link && (
                  <div>
                    <label className="text-sm font-medium">Meeting Link:</label>
                    <a
                      href={selectedClass.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline block"
                    >
                      {selectedClass.meeting_link}
                    </a>
                  </div>
                )}

                {selectedClass.learner_details.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Learner Details:</label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Join Time</TableHead>
                          <TableHead>Leave Time</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.learner_details.map((learner, index) => (
                          <TableRow key={index}>
                            <TableCell>{learner.learner_name}</TableCell>
                            <TableCell>{learner.learner_email}</TableCell>
                            <TableCell>
                              <Badge variant={learner.attendance === 'Present' ? 'default' : 'destructive'}>
                                {learner.attendance}
                              </Badge>
                            </TableCell>
                            <TableCell>{learner.join_time || 'N/A'}</TableCell>
                            <TableCell>{learner.leave_time || 'N/A'}</TableCell>
                            <TableCell>{learner.notes || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ReportLayout>
  );
}