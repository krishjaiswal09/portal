import { useState } from 'react';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlayCircle, Copy, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';

interface ReportFilters {
  datePreset: string;
  instructor: string;
  course: string;
  studentName: string;
  ignoreCancelled: boolean;
  dateRange: {
    from: string;
    to: string;
  };
}

interface ScheduledClass {
  id: number;
  course: number;
  status: string;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  class_recording: string | null;
  primary_instructor_first_name: string;
  primary_instructor_last_name: string;
  primary_instructor_email: string;
  student_first_name: string | null;
  student_last_name: string | null;
  student_email: string | null;
  group_name: string;
  class_type_name: string;
  course_title: string;
}

interface ScheduledClassesResponse {
  scheduled_classes: ScheduledClass[];
  total_count: number;
  scheduled_count: number;
  cancelled_count: number;
  include_cancelled: boolean;
  message: string;
}

export default function RecordingsReport() {
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
    datePreset: 'today',
    instructor: '',
    course: '',
    studentName: '',
    ignoreCancelled: true,
    dateRange: {
      from: '',
      to: ''
    }
  });
  const [selectedRecording, setSelectedRecording] = useState<ScheduledClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const scheduledClassesQuery = useQuery<ScheduledClassesResponse>({
    queryKey: ['scheduledClasses', filters.ignoreCancelled],
    queryFn: () => fetchApi({ path: `classes/class-schedule/scheduled?includeCancelled=${filters.ignoreCancelled}` })
  });

  const classesData = scheduledClassesQuery.data?.scheduled_classes || [];

  const courseOptions = [
    { value: 'all-courses', label: 'All Courses' },
    ...Array.from(new Set(classesData.map(item => item.course_title)))
      .map(course => ({ value: course.toLowerCase().replace(/\s+/g, '-'), label: course }))
  ];

  const instructorOptions = [
    { value: 'all-instructors', label: 'All Instructors' },
    ...Array.from(new Set(classesData.map(item => `${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`)))
      .map(instructor => ({ value: instructor.toLowerCase().replace(/\s+/g, '-'), label: instructor }))
  ];

  const filteredData = classesData.filter(item => {
    if (filters.ignoreCancelled && item.status === 'cancelled') return false;
    if (filters.instructor && filters.instructor !== 'all-instructors' &&
      !`${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`.toLowerCase().includes(filters.instructor.toLowerCase())) return false;
    if (filters.course && filters.course !== 'all-courses' &&
      !item.course_title.toLowerCase().includes(filters.course.toLowerCase())) return false;
    if (filters.studentName && item.student_first_name && item.student_last_name &&
      !`${item.student_first_name} ${item.student_last_name}`.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
    return true;
  });

  const handleRecordingClick = (recording: ScheduledClass) => {
    if (recording.class_recording) {
      setSelectedRecording(recording);
      setIsModalOpen(true);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const resetFilters = () => {
    setFilters({
      datePreset: 'today',
      instructor: '',
      course: '',
      studentName: '',
      ignoreCancelled: true,
      dateRange: {
        from: '',
        to: ''
      }
    });
  };

  return (
    <ReportLayout title="Online Class Recordings Report" description="Track availability and quality of uploaded class recordings">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <SearchableSelect
                options={courseOptions}
                value={filters.course || ''}
                onValueChange={(value) => setFilters({ ...filters, course: value })}
                placeholder="Select Course"
                searchPlaceholder="Search courses..."
              />

              <SearchableSelect
                options={instructorOptions}
                value={filters.instructor || ''}
                onValueChange={(value) => setFilters({ ...filters, instructor: value })}
                placeholder="Select Instructor"
                searchPlaceholder="Search instructors..."
              />

              <Input
                placeholder="Search Student Name"
                value={filters.studentName}
                onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-cancelled"
                  checked={filters.ignoreCancelled}
                  onCheckedChange={(checked) => setFilters({ ...filters, ignoreCancelled: checked === true })}
                />
                <label htmlFor="ignore-cancelled" className="text-sm">Ignore Cancelled</label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Student Name(s)</TableHead>
                  <TableHead>Class Type</TableHead>
                  <TableHead>Recording</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.start_time}</TableCell>
                    <TableCell>{`${item.primary_instructor_first_name} ${item.primary_instructor_last_name}`}</TableCell>
                    <TableCell>{item.course_title}</TableCell>
                    <TableCell>
                      {item.student_first_name && item.student_last_name
                        ? `${item.student_first_name} ${item.student_last_name}`
                        : item.group_name || 'N/A'}
                    </TableCell>
                    <TableCell>{item.class_type_name}</TableCell>
                    <TableCell>
                      {item.class_recording ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRecordingClick(item)}
                          className="h-8 w-8 p-0"
                        >
                          <PlayCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${item.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recording Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Recording Details</DialogTitle>
              <DialogDescription>
                Access recording URLs, meeting details, and password information for the selected class.
              </DialogDescription>
            </DialogHeader>
            {selectedRecording && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Class Title:</label>
                  <p className="mt-1">{selectedRecording.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Recording URL:</label>
                  <div className="items-center gap-2 mt-1">
                    <a
                      href={selectedRecording.class_recording || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedRecording.class_recording || 'No recording available'}
                    </a>
                    {/* {selectedRecording.class_recording && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedRecording.class_recording!, 'Recording URL')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )} */}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Meeting Link:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={selectedRecording.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex-1 truncate"
                    >
                      {selectedRecording.meeting_link}
                    </a>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedRecording.meeting_link, 'Meeting Link')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Class Duration:</label>
                  <p className="mt-1">{selectedRecording.start_time} - {selectedRecording.end_time}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ReportLayout>
  );
}