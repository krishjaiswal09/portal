import { useState } from 'react';
import { ReportLayout } from '@/components/reports/ReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash, Download, Bell, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddTransactionModal } from '@/components/reports/AddTransactionModal';
import { hasPermission } from '@/utils/checkPermission';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';

interface ReportFilters {
  status: string;
  studentName: string;
}

interface StudentCreditData {
  family_id: number;
  family_name: string;
  class_type: number;
  class_type_info: {
    id: number;
    name: string;
    price: number;
  };
  totalCreditsPurchased: number;
  totalCreditsSpent: number;
  balance: number;
  free_credits: number;
  lastUpdated: string;
}

export default function ClassCreditReport() {
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
    status: 'all',
    studentName: ''
  });
  const [selectedClassType, setSelectedClassType] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentCreditData | null>(null);
  const [modalType, setModalType] = useState<'transactions' | 'classes' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const { toast } = useToast();

  const creditOverviewQuery = useQuery<StudentCreditData[]>({
    queryKey: ['studentCreditOverview'],
    queryFn: () => fetchApi({ path: 'student-credit-overview/combined-history' })
  });

  const creditData = creditOverviewQuery.data || [];

  const filteredData = creditData.filter(item => {
    if (filters.studentName && !item.family_name.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
    if (selectedClassType !== 'all' && item.class_type.toString() !== selectedClassType) return false;
    return true;
  });

  // Get unique class types for filter
  const uniqueClassTypes = Array.from(new Set(creditData.map(item => item.class_type_info.name)))
    .map(name => {
      const item = creditData.find(d => d.class_type_info.name === name);
      return { id: item?.class_type, name };
    });

  const handleTransactionsClick = (student: StudentCreditData) => {
    setSelectedStudent(student);
    setModalType('transactions');
    setIsModalOpen(true);
  };

  const handleClassesClick = (student: StudentCreditData) => {
    setSelectedStudent(student);
    setModalType('classes');
    setIsModalOpen(true);
  };

  // const handleSendNotification = () => {
  //   toast({
  //     title: "Notifications Sent",
  //     description: "Payment reminder notifications have been sent to overdue students.",
  //   });
  // };

  // const handleSyncCredits = () => {
  //   toast({
  //     title: "Credits Synced",
  //     description: "All credit balances have been synchronized with the payment system.",
  //   });
  // };

  // const handleAddTransaction = () => {
  //   setIsAddTransactionModalOpen(true);
  // };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Family Name",
      "Class Type",
      "Credits Purchased",
      "Credits Spent",
      "Current Balance",
      "Free Credits",
      "Status",
      "Last Updated"
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          `"${item.family_name}"`,
          `"${item.class_type_info.name}"`,
          item.totalCreditsPurchased,
          item.totalCreditsSpent,
          item.balance,
          item.free_credits,
          `"${item.balance > 0 ? 'Active' : 'No Balance'}"`,
          `"${new Date(item.lastUpdated).toLocaleDateString()}"`
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `class_credit_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Downloaded ${filteredData.length} credit records.`,
    });
  };



  const getStatusBadge = (balance: number) => {
    if (balance > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          No Balance
        </Badge>
      );
    }
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      studentName: ''
    });
    setSelectedClassType('all');
  };

  return (
    <ReportLayout title="Class Credit Report" description="Track purchased/used class credits and transaction history">
      <div className="space-y-6">
        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Search Family Name"
                value={filters.studentName}
                onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
              />

              <Select value={selectedClassType} onValueChange={setSelectedClassType}>
                <SelectTrigger>
                  <SelectValue placeholder="Class Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Class Types</SelectItem>
                  {uniqueClassTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id?.toString() || ''}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>Reset</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* <Button onClick={handleSendNotification} className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Send Notification
              </Button>
              <Button variant="outline" onClick={handleSyncCredits}>
                Sync Credits
              </Button>
              <Button variant="outline" onClick={handleAddTransaction} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button> */}
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
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
                  <TableHead>Family Name</TableHead>
                  <TableHead>Class Type</TableHead>
                  <TableHead>Credits Purchased</TableHead>
                  <TableHead>Credits Spent</TableHead>
                  <TableHead>Current Balance</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Last Updated</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={`${item.family_id}-${item.class_type}`}>
                    <TableCell className="font-medium">
                      {item.family_name}
                    </TableCell>
                    <TableCell>{item.class_type_info.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-600"
                        onClick={() => handleTransactionsClick(item)}
                      >
                        {item.totalCreditsPurchased}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-600"
                        onClick={() => handleClassesClick(item)}
                      >
                        {item.totalCreditsSpent}
                      </Button>
                    </TableCell>
                    <TableCell>{item.balance}</TableCell>
                    {/* <TableCell>{getStatusBadge(item.balance)}</TableCell> */}
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                    {/* <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Transactions Modal */}
        <Dialog open={isModalOpen && modalType === 'transactions'} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Transaction Details - {selectedStudent ? selectedStudent.family_name : ''}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Transaction history will be displayed here.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Classes Modal */}
        <Dialog open={isModalOpen && modalType === 'classes'} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Classes Details - {selectedStudent ? selectedStudent.family_name : ''}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Classes history will be displayed here.</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={() => setIsAddTransactionModalOpen(false)}
        />
      </div>
    </ReportLayout>
  );
}