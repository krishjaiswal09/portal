import React, { useState, useMemo, useEffect } from 'react';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { AddNoteModal } from '@/components/reports/AddNoteModal';
import { FlagActivityModal } from '@/components/reports/FlagActivityModal';
import { ViewProfileModal } from '@/components/reports/ViewProfileModal';
import { Search, Download, MoreHorizontal, X, Clock, User, Flag, StickyNote, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  eventTypeOptions,
  courseOptionsForTimeline,
  type TimelineReportData
} from '@/data/timelineReportData';
import { fetchApi } from '@/services/api/fetchApi';
import { useQuery } from '@tanstack/react-query';

interface ActivityApiResponse {
  id: number;
  activity_description: string;
  user_id: number;
  performed_by: number;
  note_title: string | null;
  note: string | null;
  flag_reason: string | null;
  flag_priority: string | null;
  flag_description: string | null;
  created_at: string;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  performed_by_first_name: string;
  performed_by_last_name: string;
  performed_by_email: string;
}

export default function TimelineReport() {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    course: 'all',
    eventType: 'all'
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [timelineData, setTimelineData] = useState<TimelineReportData[]>([]);

  // Modal states
  const [addNoteModal, setAddNoteModal] = useState({ isOpen: false, itemId: '' });
  const [flagModal, setFlagModal] = useState({ isOpen: false, itemId: '' });
  const [profileModal, setProfileModal] = useState({ isOpen: false, userEmail: '', userName: '' });

  const { toast } = useToast();

  const transformToTimelineData = (apiData: ActivityApiResponse[]): TimelineReportData[] => {
    return apiData.map((item) => ({
      id: item.id.toString(),
      eventDescription: item.activity_description,
      timestamp: item.created_at,
      performedBy: `${item.performed_by_first_name} ${item.performed_by_last_name}`,
      performedByEmail: item.performed_by_email.replace('mailto:', ''),
      eventType: 'user_created',
      category: 'admin' as const,
      severity: 'success' as const,
      actionButton: { label: 'View User', action: 'view_profile' },
      metadata: {
        userId: item.user_id,
        performedById: item.performed_by,
        noteTitle: item.note_title,
        note: item.note,
        flagReason: item.flag_reason,
        flagPriority: item.flag_priority,
        flagDescription: item.flag_description,
        updatedAt: item.updated_at,
      }
    }));
  };
  const activityData = useQuery({
    queryKey: ['userActivities'],
    queryFn: () => fetchApi<any[]>({
      path: `activity`
    })
  });

  useEffect(() => {
    if (activityData.data) {
      setTimelineData(transformToTimelineData(activityData.data ?? []));
    }
  }, [activityData.data]);

  const filteredData = useMemo(() => {
    let data = [...timelineData];

    if (searchTerm) {
      data = data.filter(item =>
        item.eventDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.performedByEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.courseName && item.courseName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.course !== 'all') {
      data = data.filter(item =>
        item.courseName && item.courseName.toLowerCase().includes(filters.course.toLowerCase())
      );
    }

    if (filters.eventType !== 'all') {
      data = data.filter(item => item.eventType === filters.eventType);
    }

    if (filters.fromDate) {
      data = data.filter(item => new Date(item.timestamp) >= new Date(filters.fromDate));
    }

    if (filters.toDate) {
      data = data.filter(item => new Date(item.timestamp) <= new Date(filters.toDate));
    }

    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [searchTerm, filters, timelineData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const resetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      course: 'all',
      eventType: 'all',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getSeverityBadge = (severity: string, category: string) => {
    const baseClasses = "text-xs px-2 py-1 font-medium";

    switch (severity) {
      case 'error':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>Error</Badge>;
      case 'warning':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}>Warning</Badge>;
      case 'success':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>Success</Badge>;
      default:
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800 border-blue-200`}>Info</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Timestamp', 'Event Description', 'Performed By', 'Email',
      'Event Type', 'Category', 'Severity', 'Course'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        formatTimestamp(item.timestamp),
        `"${item.eventDescription}"`,
        item.performedBy,
        item.performedByEmail,
        item.eventType,
        item.category,
        item.severity,
        item.courseName || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAction = (actionType: string, itemId?: string) => {
    const item = timelineData.find(i => i.id === itemId);

    switch (actionType) {
      case 'add_note':
        setAddNoteModal({ isOpen: true, itemId: itemId || '' });
        break;
      case 'flag':
      case 'bulk_flag':
        setFlagModal({ isOpen: true, itemId: itemId || '' });
        break;
      case 'view_profile':
        if (item) {
          setProfileModal({
            isOpen: true,
            userEmail: item.performedByEmail,
            userName: item.performedBy
          });
        }
        break;
      default:
        toast({
          title: "Action Completed",
          description: `${actionType} action has been performed successfully.`,
        });
    }
  };

  const handleAddNote = (note: { title: string; content: string }) => {
    toast({
      title: "Note Added",
      description: `Note "${note.title}" has been added successfully.`,
    });
  };

  const handleFlagActivity = (flag: { reason: string; description: string; priority: string }) => {
    toast({
      title: "Activity Flagged",
      description: `Activity has been flagged as ${flag.reason} with ${flag.priority} priority.`,
    });
  };

  return (
    <ReportLayout
      title="Timeline Report"
      description="Centralized activity log capturing every major system event and user action"
    >
      <div className="space-y-4">
        {/* Filter Panel */}
        <Card className="rounded-xl border bg-muted/20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <h3 className="text-base font-semibold">Filters & Search</h3>
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events, users, courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <Input
                  type="date"
                  placeholder="From Date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="h-9 text-sm"
                />
                <Input
                  type="date"
                  placeholder="To Date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="h-9 text-sm"
                />
                <SearchableSelect
                  options={courseOptionsForTimeline}
                  value={filters.course}
                  onValueChange={(value) => setFilters({ ...filters, course: value })}
                  placeholder="Course"
                  searchPlaceholder="Search courses..."
                  className="h-9 text-sm"
                />
                <SearchableSelect
                  options={eventTypeOptions}
                  value={filters.eventType}
                  onValueChange={(value) => setFilters({ ...filters, eventType: value })}
                  placeholder="Event Type"
                  searchPlaceholder="Search events..."
                  className="h-9 text-sm"
                />
                <Button variant="outline" onClick={resetFilters} size="sm" className="h-9">
                  <X className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline events

              </CardTitle>
              <div className="flex gap-2">
                {selectedRows.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => handleAction('bulk_flag')}>
                    <Flag className="h-3 w-3 mr-1" />
                    Flag Selected
                  </Button>
                )}
                <Button onClick={exportToCSV} size="sm" className="h-8">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-32">Timestamp</TableHead>
                    <TableHead className="min-w-96">Event Description</TableHead>
                    <TableHead className="w-32">Performed By</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id} className="text-sm">
                      <TableCell className="text-xs">
                        <div className="font-medium">{formatTimestamp(item.timestamp)}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium text-foreground">{item.eventDescription}</div>
                        {item.courseName && (
                          <div className="text-xs text-muted-foreground mt-1">Course: {item.courseName}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <div>
                            <div className="font-medium">{item.performedBy}</div>
                            <div className="text-muted-foreground">{item.performedByEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(item.severity, item.category)}</TableCell>
                      <TableCell>
                        {item.actionButton && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleAction(item.actionButton!.action, item.id)}
                          >
                            {item.actionButton.label}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                            <DropdownMenuItem onClick={() => handleAction('add_note', item.id)}>
                              <StickyNote className="h-3 w-3 mr-2" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('flag', item.id)}>
                              <Flag className="h-3 w-3 mr-2" />
                              Flag Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('view_profile', item.id)}>
                              <User className="h-3 w-3 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Items per page:</span>
                  <SearchableSelect
                    options={[
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: '100', label: '100' }
                    ]}
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                    className="h-8 w-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No timeline events found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Modals */}
      <AddNoteModal
        isOpen={addNoteModal.isOpen}
        onClose={() => setAddNoteModal({ isOpen: false, itemId: '' })}
        onSave={handleAddNote}
        itemId={addNoteModal.itemId}
      />

      <FlagActivityModal
        isOpen={flagModal.isOpen}
        onClose={() => setFlagModal({ isOpen: false, itemId: '' })}
        onFlag={handleFlagActivity}
        itemId={flagModal.itemId}
      />

      <ViewProfileModal
        isOpen={profileModal.isOpen}
        onClose={() => setProfileModal({ isOpen: false, userEmail: '', userName: '' })}
        userEmail={profileModal.userEmail}
        userName={profileModal.userName}
      />
    </ReportLayout>
  );
}
