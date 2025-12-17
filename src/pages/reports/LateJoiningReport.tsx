import { useState } from 'react';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ViewProfileModal } from '@/components/reports/ViewProfileModal';
import { AlertTriangle, Clock, Users, MoreHorizontal, MessageSquare, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';

interface LateJoinStatsResponse {
  total_late_join_records: number;
  unique_students_count: number;
  avg_minutes_late: number;
  late_join_records: any[];
}

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

export default function LateJoiningReport() {
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

  const [profileModal, setProfileModal] = useState({ isOpen: false, userEmail: '', userName: '' });
  const { toast } = useToast();

  const lateJoinStatsQuery = useQuery<LateJoinStatsResponse>({
    queryKey: ['lateJoinStats'],
    queryFn: () => fetchApi({ path: 'classes/attendance/late-join-stats' })
  });

  const lateJoinData = (lateJoinStatsQuery.data as LateJoinStatsResponse)?.late_join_records || [];

  const filteredData = lateJoinData.filter((item: any) => {
    if (filters.studentName && !`${item.user_first_name} ${item.user_last_name}`.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
    return true;
  });

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

  const handleAction = (actionType: string, itemId?: string) => {
    const item = lateJoinData.find((i: any) => i.id.toString() === itemId);

    switch (actionType) {
      case 'view_profile':
        if (item) {
          setProfileModal({
            isOpen: true,
            userEmail: item.user_email,
            userName: `${item.user_first_name} ${item.user_last_name}`
          });
        }
        break;
      case 'send_reminder':
        toast({
          title: "Reminder Sent",
          description: "A reminder has been sent to the student about punctuality.",
        });
        break;
      case 'contact_student':
        toast({
          title: "Contact Initiated",
          description: "Student contact form has been opened.",
        });
        break;
      default:
        toast({
          title: "Action Completed",
          description: `${actionType} action has been performed successfully.`,
        });
    }
  };

  // Calculate summary stats from API data
  const totalLateJoins = (lateJoinStatsQuery.data as LateJoinStatsResponse)?.total_late_join_records || 0;
  const avgLateMinutes = (lateJoinStatsQuery.data as LateJoinStatsResponse)?.avg_minutes_late || 0;
  const uniqueStudents = (lateJoinStatsQuery.data as LateJoinStatsResponse)?.unique_students_count || 0;

  return (
    <ReportLayout title="Late Joining Report" description="Monitor students who join classes late and track patterns">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{totalLateJoins}</p>
                <p className="text-muted-foreground">Late Joins</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-orange-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{Math.round(avgLateMinutes)}</p>
                <p className="text-muted-foreground">Avg Late (min)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{uniqueStudents}</p>
                <p className="text-muted-foreground">Unique Students</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Filter by Course"
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              />

              <Input
                placeholder="Filter by Instructor"
                value={filters.instructor}
                onChange={(e) => setFilters({ ...filters, instructor: e.target.value })}
              />

              <Input
                placeholder="Search Student Name"
                value={filters.studentName}
                onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
              />

              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-cancelled"
                  checked={filters.ignoreCancelled}
                  onCheckedChange={(checked) => setFilters({ ...filters, ignoreCancelled: checked === true })}
                />
                <label htmlFor="ignore-cancelled" className="text-sm">Ignore Cancelled</label>
              </div> */}
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
                  <TableHead>Class Time</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Join Time</TableHead>
                  <TableHead>Late By (min)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.marked_at).toLocaleDateString()}</TableCell>
                    <TableCell>{item.class_start_time}</TableCell>
                    <TableCell>{`${item.user_first_name} ${item.user_last_name}`}</TableCell>
                    <TableCell>{item.instructor_first_name || item.instructor_last_name ? `${item.instructor_first_name} ${item.instructor_last_name}` : 'N/A'}</TableCell>
                    <TableCell>Course Info</TableCell>
                    <TableCell>{item.join_time}</TableCell>
                    <TableCell>
                      <Badge variant={item.lateByMin > 10 ? 'destructive' : 'secondary'}>
                        {item.lateByMin || 0} min
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.present ? 'default' : 'destructive'}>
                        {item.present ? 'Present' : 'Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('view_profile', item.id.toString())}>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('send_reminder', item.id.toString())}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ViewProfileModal
        isOpen={profileModal.isOpen}
        onClose={() => setProfileModal({ isOpen: false, userEmail: '', userName: '' })}
        userEmail={profileModal.userEmail}
        userName={profileModal.userName}
      />
    </ReportLayout>
  );
}