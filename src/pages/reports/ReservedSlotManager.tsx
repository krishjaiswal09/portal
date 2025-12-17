import { useState } from 'react';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Download, Trash2, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ReservedSlotData, ReservedSlotFilters } from '@/types/reports';
import { useToast } from '@/hooks/use-toast';
import { ViewProfileModal } from '@/components/reports/ViewProfileModal';
import { ReleaseSlotModal } from '@/components/reports/ReleaseSlotModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { SectionLoader } from '@/components/ui/loader';


export default function ReservedSlotManager() {
  const [filters, setFilters] = useState<ReservedSlotFilters>({
    status: 'all',
    searchTerm: ''
  });
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservedSlots, isLoading } = useQuery({
    queryKey: ['reservedSlots'],
    queryFn: () => fetchApi<any[]>({
      path: 'reserved-slots',
      params: { status: 'reserved' }
    })
  });

  const reservedSlotReportData = reservedSlots?.map(slot => ({
    id: slot.id.toString(),
    studentName: `${slot.user_first_name} ${slot.user_last_name}`,
    instructorName: `${slot.instructor_first_name} ${slot.instructor_last_name}`,
    dayOfWeek: slot.day,
    timeSlot: `${slot.start_time}`,
    startDate: new Date(slot.date).toLocaleDateString(),
    endDate: new Date(slot.date).toLocaleDateString(),
    status: 'Active' as const,
    lastAttended: 'N/A',
    upcomingHolds: 0
  })) || [];

  const filteredData = reservedSlotReportData.filter(item => {
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.instructor && item.instructorName !== filters.instructor) return false;
    if (filters.student && item.studentName !== filters.student) return false;
    if (filters.dayOfWeek && item.dayOfWeek !== filters.dayOfWeek) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!item.studentName.toLowerCase().includes(searchLower) && !item.instructorName.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });
  // const summaryStats = {
  //   total: reservedSlotReportData.length,
  //   active: reservedSlotReportData.filter(slot => slot.status === 'Active').length,
  //   released: reservedSlotReportData.filter(slot => slot.status === 'Released').length,
  //   expired: reservedSlotReportData.filter(slot => slot.status === 'Expired').length,
  //   endingThisWeek: reservedSlotReportData.filter(slot => slot.status === 'Active' && slot.upcomingHolds > 0 && slot.upcomingHolds <= 7).length
  // };
  const uniqueInstructors = [...new Set(reservedSlotReportData.map(slot => slot.instructorName))];
  const uniqueStudents = [...new Set(reservedSlotReportData.map(slot => slot.studentName))];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSlots(filteredData.filter(slot => slot.status === 'Active').map(slot => slot.id));
    } else {
      setSelectedSlots([]);
    }
  };
  const handleSelectSlot = (slotId: string, checked: boolean) => {
    if (checked) {
      setSelectedSlots([...selectedSlots, slotId]);
    } else {
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    }
  };
  const handleReleaseSlots = () => {
    setIsReleaseModalOpen(true);
  };
  const releaseMutation = useMutation({
    mutationFn: (slotIds: number[]) => fetchApi({
      path: 'reserved-slots/bulk-release',
      method: 'PUT',
      data: { slotIds }
    }),
    onSuccess: () => {
      toast({
        title: "Slots Released",
        description: `Successfully released ${selectedSlots.length} reserved slot(s).`
      });
      queryClient.invalidateQueries({ queryKey: ['reservedSlots'] });
      setSelectedSlots([]);
      setIsReleaseModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to release slots. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleConfirmRelease = (reason?: string) => {
    const slotIds = selectedSlots.map(id => parseInt(id));
    releaseMutation.mutate(slotIds);
  };
  const handleProfileClick = (type: 'student' | 'instructor', name: string) => {
    setSelectedProfile({
      email: `${name.toLowerCase().replace(' ', '.')}@artgharana.com`,
      name
    });
    setIsProfileModalOpen(true);
  };
  const resetFilters = () => {
    setFilters({
      status: 'all',
      searchTerm: ''
    });
  };
  const handleExport = () => {
    console.log('Exporting Reserved Slots Report to CSV...');
  };
  const getStatusBadge = (status: ReservedSlotData['status']) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'Released':
        return <Badge className="bg-blue-100 text-blue-800"><XCircle className="w-3 h-3 mr-1" />Released</Badge>;
      case 'Expired':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const activeFilteredSlots = filteredData.filter(slot => slot.status === 'Active');
  const allActiveSelected = activeFilteredSlots.length > 0 && activeFilteredSlots.every(slot => selectedSlots.includes(slot.id));
  const someActiveSelected = activeFilteredSlots.some(slot => selectedSlots.includes(slot.id));
  if (isLoading) {
    return (
      <ReportLayout title="Reserved Slot Manager" description="View and manage all reserved time slots across the platform">
        <SectionLoader text="Loading reserved slots..." />
      </ReportLayout>
    );
  }

  return <ReportLayout title="Reserved Slot Manager" description="View and manage all reserved time slots across the platform">
    <div className="space-y-6">
      {/* Summary Statistics */}


      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select value={filters.status} onValueChange={value => setFilters({
              ...filters,
              status: value as ReservedSlotFilters['status']
            })}>


            </Select>

            <Select value={filters.instructor || 'all'} onValueChange={value => setFilters({
              ...filters,
              instructor: value === 'all' ? undefined : value
            })}>
              <SelectTrigger>
                <SelectValue placeholder="All Instructors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instructors</SelectItem>
                {uniqueInstructors.map(instructor => <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.dayOfWeek || 'all'} onValueChange={value => setFilters({
              ...filters,
              dayOfWeek: value === 'all' ? undefined : value
            })}>
              <SelectTrigger>
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input placeholder="Search student/instructor..." value={filters.searchTerm || ''} onChange={e => setFilters({
              ...filters,
              searchTerm: e.target.value
            })} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleReleaseSlots} disabled={selectedSlots.length === 0} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Release Selected ({selectedSlots.length})
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allActiveSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Day of Week</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map(slot => <TableRow key={slot.id}>
                <TableCell>
                  <Checkbox checked={selectedSlots.includes(slot.id)} onCheckedChange={checked => handleSelectSlot(slot.id, checked as boolean)} disabled={slot.status !== 'Active'} />
                </TableCell>
                <TableCell>
                  <Button variant="link" className="h-auto p-0 font-medium text-primary" onClick={() => handleProfileClick('student', slot.studentName)}>
                    {slot.studentName}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="link" className="h-auto p-0 font-medium text-primary" onClick={() => handleProfileClick('instructor', slot.instructorName)}>
                    {slot.instructorName}
                  </Button>
                </TableCell>
                <TableCell>{slot.dayOfWeek}</TableCell>
                <TableCell>{slot.timeSlot}</TableCell>
                <TableCell>{slot.endDate || 'Ongoing'}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReleaseSlotModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        onConfirm={handleConfirmRelease}
        selectedCount={selectedSlots.length}
        isLoading={releaseMutation.isPending}
      />

      {selectedProfile && <ViewProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userEmail={selectedProfile.email} userName={selectedProfile.name} />}
    </div>
  </ReportLayout>;
}