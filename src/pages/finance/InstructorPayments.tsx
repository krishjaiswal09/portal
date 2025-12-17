
import { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Search,
  Download,
  Edit2,
  CalendarIcon,
  Filter,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EditInstructorPaymentModal } from '@/components/payment/EditInstructorPaymentModal';
import { fetchApi } from '@/services/api/fetchApi';
import { useQuery } from '@tanstack/react-query';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface InstructorPaymentDetail {
  id: string;
  date: string;
  instructorName: string;
  studentName: string;
  type: string;
  class_type: any;
  activity: 'class_joined' | 'class_missed' | 'free_class' | 'makeup_class' | 'bonus_class' | 'class_completed';
  income: number;
  balance: number;
  comment: string;
  instructor_id?: number;
  class_id?: number;
  currency?: number;
  class_schedule?: any;
  credit_type?: any;
}




export default function InstructorPayments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  if (!hasPermission("HAS_READ_INSTRUCTOR_PAYMENT")) {
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
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('All Instructors');
  const [selectedClassType, setSelectedClassType] = useState('All Types');
  const [selectedActivity, setSelectedActivity] = useState('All Activities');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [editingPayment, setEditingPayment] = useState<InstructorPaymentDetail | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getInstructorPaymentQueries = useQuery({
    queryKey: ["getInstructorPaymentQueries"],
    queryFn: () =>
      fetchApi<InstructorPaymentDetail[]>({
        path: "instructor-payment"
      }),
  });

  const classTypeQueries = useQuery({
    queryKey: ["classTypeQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
  });

  const instructorQueries = useQuery({
    queryKey: ["instructorQueries"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=instructor",
      }),
  });

  useEffect(() => {
    if (
      !getInstructorPaymentQueries.isLoading &&
      getInstructorPaymentQueries.data
    ) {
      setPayments(getInstructorPaymentQueries.data);
    }
  }, [getInstructorPaymentQueries.isLoading, getInstructorPaymentQueries.data]);

  const itemsPerPage = 10;

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'class_joined':
        return 'bg-green-100 text-green-800';
      case 'class_missed':
        return 'bg-red-100 text-red-800';
      case 'free_class':
        return 'bg-blue-100 text-blue-800';
      case 'makeup_class':
        return 'bg-orange-100 text-orange-800';
      case 'bonus_class':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'class_joined':
        return 'Class Joined';
      case 'class_missed':
        return 'Class Missed';
      case 'free_class':
        return 'Free Class';
      case 'makeup_class':
        return 'Makeup Class';
      case 'bonus_class':
        return 'Bonus Class';
      default:
        return activity;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Private 60min':
        return 'bg-blue-100 text-blue-800';
      case 'Private 40min':
        return 'bg-green-100 text-green-800';
      case 'Group 60min':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueActivities = [...new Set(payments?.map(p => p.activity) || [])];
  const activities = [
    { value: 'All Activities', label: 'All Activities' },
    ...uniqueActivities.map(activity => ({
      value: activity,
      label: getActivityLabel(activity)
    }))
  ];

  const filteredPayments = payments?.filter(payment => {
    const studentName = payment.class_schedule?.student_name || '';
    const instructorName = `${payment.instructor?.first_name || ''} ${payment.instructor?.last_name || ''}`.trim();
    const matchesSearch = searchTerm === '' || studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstructor = selectedInstructor === 'All Instructors' || instructorName === selectedInstructor;
    const matchesClassType = selectedClassType === 'All Types' || payment.class_type?.toString() === selectedClassType;
    const matchesActivity = selectedActivity === 'All Activities' || payment.activity === selectedActivity;

    let matchesDateRange = true;
    if (dateFrom && dateTo) {
      const paymentDate = new Date(payment.date);
      matchesDateRange = paymentDate >= dateFrom && paymentDate <= dateTo;
    }

    return matchesSearch && matchesInstructor && matchesClassType && matchesActivity && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (payment: InstructorPaymentDetail) => {
    const mappedPayment = {
      ...payment,
      studentName: payment.class_schedule?.student_name || '',
      type: payment.credit_type || '',
      class_type: payment.class_type?.toString() || '',
      activity: payment.activity
    };
    setEditingPayment(mappedPayment);
    setIsEditModalOpen(true);
  };

  const handleUpdatePayment = async (updatedPayment: InstructorPaymentDetail) => {
    try {
      const payload = {
        date: updatedPayment.date,
        class_type: updatedPayment.class_type,
        class_id: updatedPayment.class_id,
        activity: updatedPayment.activity,
        income: Number(updatedPayment.income),
        balance: Number(updatedPayment.balance),
      };
      await fetchApi({
        method: "PATCH",
        path: `instructor-payment/${updatedPayment.id}`,
        data: payload
      });
      getInstructorPaymentQueries.refetch();
      toast({
        title: "Success",
        description: "Payment updated successfully",
      });
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment",
      });
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Instructor', 'Student Name', 'Type', 'Activity', 'Income', 'Balance', 'Comment'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => [
        payment.date,
        payment.instructorName,
        payment.studentName,
        payment.type,
        getActivityLabel(payment.activity),
        payment.income,
        payment.balance,
        payment.comment
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instructor-payments.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Instructor Payments">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">Instructor Payments</h1>
            <p className="text-muted-foreground">Manage instructor payment details</p>
          </div>
          <Button onClick={handleDownloadCSV} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Instructor Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instructor</label>
                <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Instructors">All Instructors</SelectItem>
                    {instructorQueries?.data?.data?.map((instructor) => (
                      <SelectItem key={instructor.id} value={`${instructor.first_name} ${instructor.last_name}`}>
                        {instructor.first_name} {instructor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Student Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Class Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Type</label>
                <Select value={selectedClassType} onValueChange={setSelectedClassType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Types">All Types</SelectItem>
                    {classTypeQueries?.data?.map((classType: any) => (
                      <SelectItem key={classType.id} value={classType.id.toString()}>
                        {classType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity</label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map(activity => (
                      <SelectItem key={activity.value} value={activity.value}>
                        {activity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Instructor Name</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.instructor.first_name} {payment.instructor.last_name}</TableCell>
                      <TableCell>{payment.class_schedule?.student_name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(payment.type)} variant="outline">
                          {payment.credit_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActivityColor(payment.activity)} variant="outline">
                          {getActivityLabel(payment.activity)}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-semibold ${payment.income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.currency_info?.name}{Math.abs(payment.income).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">{payment.currency_info?.name}{payment.balance.toLocaleString()}</TableCell>
                      <TableCell>{payment.comment}</TableCell>
                      <TableCell>
                        {
                          hasPermission("HAS_UPDATE_INSTRUCTOR_PAYMENT") && <Button size="sm" variant="outline" onClick={() => handleEdit(payment)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center p-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No payments found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        <EditInstructorPaymentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          payment={editingPayment}
          onUpdatePayment={handleUpdatePayment}
        />
      </div>
    </DashboardLayout>
  );
}
