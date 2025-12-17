
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
  Plus,
  CalendarIcon,
  Filter,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentTransactionModal } from '@/components/finance/StudentTransactionModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from '@/utils/checkPermission';

interface StudentTransaction {
  id: string;
  studentId?: number;
  date: string;
  studentName: string;
  classType: string;
  classTypeId?: number;
  activity: 'class_joined' | 'class_missed' | 'free_credit';
  credit: number;
  comments: string;
}

const mockStudentTransactions: StudentTransaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    studentName: 'Aarav Sharma',
    classType: 'Pvt 60 min',
    activity: 'class_joined',
    credit: -1,
    comments: 'Regular classical dance session completed successfully'
  },
  {
    id: '2',
    date: '2024-01-14',
    studentName: 'Priya Patel',
    classType: 'Pvt 40 min',
    activity: 'free_credit',
    credit: 10,
    comments: 'Welcome bonus - New student credit package'
  },
  {
    id: '3',
    date: '2024-01-13',
    studentName: 'Rahul Kumar',
    classType: 'Group 60 min',
    activity: 'class_missed',
    credit: 0,
    comments: 'Student was sick, no credit deducted as per policy'
  },
  {
    id: '4',
    date: '2024-01-12',
    studentName: 'Sneha Singh',
    classType: 'Pvt 60 min',
    activity: 'class_joined',
    credit: -2,
    comments: 'Extended session - Extra practice time provided'
  },
  {
    id: '5',
    date: '2024-01-11',
    studentName: 'Kiran Reddy',
    classType: 'Pvt 40 min',
    activity: 'free_credit',
    credit: 5,
    comments: 'Referral bonus - Friend joined the academy'
  },
  {
    id: '6',
    date: '2024-01-10',
    studentName: 'Arjun Singh',
    classType: 'Group 60 min',
    activity: 'class_joined',
    credit: -1,
    comments: 'Group bharatanatyam session - Great participation'
  },
  {
    id: '7',
    date: '2024-01-09',
    studentName: 'Maya Gupta',
    classType: 'Pvt 60 min',
    activity: 'class_missed',
    credit: 0,
    comments: 'Family emergency - Credit preserved for makeup class'
  },
  {
    id: '8',
    date: '2024-01-08',
    studentName: 'Dev Patel',
    classType: 'Pvt 40 min',
    activity: 'free_credit',
    credit: 8,
    comments: 'Performance bonus - Excellent show at annual event'
  },
  {
    id: '9',
    date: '2024-01-07',
    studentName: 'Ananya Iyer',
    classType: 'Group 60 min',
    activity: 'class_joined',
    credit: -1,
    comments: 'Group session with focus on rhythm and timing'
  },
  {
    id: '10',
    date: '2024-01-06',
    studentName: 'Rohan Mehta',
    classType: 'Pvt 60 min',
    activity: 'class_joined',
    credit: -1,
    comments: 'Individual classical training session completed'
  }
];

const StudentTransactions = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_READ_STUDENT_TRANSACTION_HISTORY")) {
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
  const [transactions, setTransactions] = useState<StudentTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassType, setSelectedClassType] = useState('All Types');
  const [selectedActivity, setSelectedActivity] = useState('All Activities');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [editingTransaction, setEditingTransaction] = useState<StudentTransaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch credit history
  const { data: creditHistory, isLoading } = useQuery({
    queryKey: ['student-credit-history'],
    queryFn: () => fetchApi({
      path: 'student-credit-history',
    }),
  });

  // Update transactions when data is fetched
  useEffect(() => {
    if (creditHistory && !isLoading && Array.isArray(creditHistory)) {
      const mappedTransactions = creditHistory.map((item: any) => ({
        id: item.id.toString(),
        date: item.date,
        studentName: `${item.student.first_name} ${item.student.last_name}` || 'Unknown Student',
        classType: item.class_type_info !== undefined ? item.class_type_info.name : "N/A",
        activity: item.activity,
        credit: item.credit,
        comments: item.comment || 'N/A',
        studentId: item.student_id,
        classTypeId: item.class_type
      }));
      setTransactions(mappedTransactions);
    }
  }, [creditHistory, isLoading]);

  // Add credit mutation
  const addCreditMutation = useMutation({
    mutationFn: (creditData: any) => fetchApi({
      path: 'student-credit-history',
      method: 'POST',
      data: {
        date: creditData.date,
        student_id: creditData.studentId,
        class_type: creditData.classType,
        activity: creditData.activity,
        credit: creditData.credit,
        comment: creditData.comments,
      },
    }),
    onSuccess: () => {
      toast({
        title: "Credit Added",
        description: "Student credit transaction has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['student-credit-history'] });
      setIsAddModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add credit transaction.",
        variant: "destructive",
      });
    },
  });

    // Fetch class types
    const { data: classTypesData } = useQuery({
      queryKey: ['classes/class-types'],
      queryFn: () => fetchApi({
        path: 'classes/class-type',
      }),
    });
  const classTypes = Array.isArray(classTypesData) ? classTypesData : [];

  // Edit credit mutation
  const editCreditMutation = useMutation({
    mutationFn: ({ id, creditData }: { id: string; creditData: any }) => fetchApi({
      path: `student-credit-history/${id}`,
      method: 'PATCH',
      data: {
        date: creditData.date,
        student_id: creditData.studentId,
        class_type: creditData.classType,
        activity: creditData.activity,
        credit: creditData.credit,
        comment: creditData.comments,
      },
    }),
    onSuccess: () => {
      toast({
        title: "Credit Updated",
        description: "Student credit transaction has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['student-credit-history'] });
      setIsEditModalOpen(false);
      setEditingTransaction(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update credit transaction.",
        variant: "destructive",
      });
    },
  });

  // const classTypes = ['All Types', 'Pvt 60 min', 'Pvt 40 min', 'Group 60 min'];
  const activities = ['All Activities', 'class_joined', 'class_missed', 'free_credit'];

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'class_joined':
        return 'bg-green-100 text-green-800';
      case 'class_missed':
        return 'bg-red-100 text-red-800';
      case 'free_credit':
        return 'bg-blue-100 text-blue-800';
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
      case 'free_credit':
        return 'Free Credit';
      default:
        return activity;
    }
  };

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case 'Pvt 60 min':
        return 'bg-blue-100 text-blue-800';
      case 'Pvt 40 min':
        return 'bg-green-100 text-green-800';
      case 'Group 60 min':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = (isLoading ? mockStudentTransactions : transactions).filter(transaction => {
    const matchesSearch = transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.comments.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassType = selectedClassType === 'All Types' || transaction.classType === selectedClassType;
    const matchesActivity = selectedActivity === 'All Activities' || transaction.activity === selectedActivity;

    let matchesDateRange = true;
    if (dateFrom && dateTo) {
      const transactionDate = new Date(transaction.date);
      matchesDateRange = transactionDate >= dateFrom && transactionDate <= dateTo;
    }

    return matchesSearch && matchesClassType && matchesActivity && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (transaction: StudentTransaction) => {
    console.log(transaction)
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = (transaction: StudentTransaction) => {
    if (editingTransaction) {
      editCreditMutation.mutate({
        id: transaction.id,
        creditData: {
          date: transaction.date,
          studentId: +transaction.studentId, // Assuming student ID mapping
          classType: +transaction.classTypeId, // Map class type to ID
          activity: transaction.activity,
          credit: transaction.credit,
          comments: transaction.comments,
        },
      });
    } else {
      addCreditMutation.mutate({
        date: transaction.date,
        studentId: +transaction.studentId, // Assuming student ID mapping
        classType: +transaction.classTypeId, // Map class type to ID
        activity: transaction.activity,
        credit: transaction.credit,
        comments: transaction.comments,
      });
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Student Name', 'Class Type', 'Activity', 'Credit', 'Comments'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        transaction.date,
        transaction.studentName,
        transaction.classType,
        getActivityLabel(transaction.activity),
        transaction.credit,
        `"${transaction.comments}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-transactions.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Student Transactions">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">Student Transactions</h1>
            <p className="text-muted-foreground">Manage and track all student credit transactions</p>
          </div>
          <div className="flex gap-2">
            {
              hasPermission("HAS_CREATE_STUDENT_TRANSACTION_HISTORY") && < Button onClick={() => setIsAddModalOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            }
            <Button onClick={handleDownloadCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name or comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class Type</label>
                <Select value={selectedClassType} onValueChange={setSelectedClassType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Types">All Class Types</SelectItem>
                    {classTypes?.length === 0 ? (
                  <SelectItem value="no-types" disabled>
                    No class types available
                  </SelectItem>
                ) : (
                  classTypes?.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name || type.class_type || "Unknown Type"}
                    </SelectItem>
                  ))
                )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity</label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map(activity => (
                      <SelectItem key={activity} value={activity}>
                        {activity === 'All Activities' ? activity : getActivityLabel(activity)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Loading transactions...</div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class Type</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="font-medium">{transaction.studentName}</TableCell>
                        <TableCell>
                          <Badge className={getClassTypeColor(transaction.classType)}>
                            {transaction.classType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActivityColor(transaction.activity)}>
                            {getActivityLabel(transaction.activity)}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-medium ${transaction.credit > 0 ? 'text-green-600' : transaction.credit < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                          {transaction.credit > 0 ? '+' : ''}{transaction.credit}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{transaction.comments}</TableCell>
                        <TableCell>
                          {
                            hasPermission("HAS_UPDATE_STUDENT_TRANSACTION_HISTORY") && <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(transaction)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <StudentTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveTransaction}
          transaction={null}
        />

        <StudentTransactionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          transaction={editingTransaction}
        />
      </div>
    </DashboardLayout >
  );
};

export default StudentTransactions;
