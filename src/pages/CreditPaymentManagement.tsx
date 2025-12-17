import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Download,
  Pencil,
  Plus,
  CalendarIcon,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { mockPaymentTransactions } from "@/data/paymentData";
import { PaymentTransaction } from "@/types/payment";
import { EditPaymentModal } from "@/components/payment/EditPaymentModal";
import { AddTransactionModal } from "@/components/payment/AddTransactionModal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { hasPermission } from "@/utils/checkPermission";
import { useNavigate } from "react-router-dom";
import { SectionLoader } from "@/components/ui/loader";

const CreditPaymentManagement = () => {
  const navigate = useNavigate();
  if (!hasPermission("HAS_READ_TRANSACTION_HISTORY")) {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<PaymentTransaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter states
  const [selectedClassType, setSelectedClassType] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const transactionHistory = useQuery({
    queryKey: ["transactionHistory"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "transaction-history",
      }),
  });

  const classTypeQueries = useQuery({
    queryKey: ["classTypeQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
  });

  useEffect(() => {
    if (transactionHistory?.data && Array.isArray(transactionHistory.data)) {
      setTransactions(transactionHistory.data);
    }
  }, [transactionHistory?.data]);

  useEffect(() => {
    if (!classTypeQueries.isLoading && classTypeQueries.data) {
      setClassTypes(classTypeQueries.data);
    }
  }, [classTypeQueries.isLoading, classTypeQueries.data]);

  const getCurrencySymbol = (groupName?: string) => {
    switch (groupName) {
      case "USA":
      case "Canada":
        return "$";
      case "UK":
        return "£";
      case "INDIA":
      default:
        return "₹";
    }
  };

  const filteredTransactions = transactions?.filter((transaction: any) => {
    const studentName = `${transaction.student_first_name || ""} ${transaction.student_last_name || ""
      }`.trim();
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.class_type_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.payment_method
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.country?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClassType =
      selectedClassType === "all" ||
      transaction.class_type?.toString() === selectedClassType;
    const matchesPaymentMethod =
      selectedPaymentMethod === "all" ||
      transaction.payment_method === selectedPaymentMethod;

    let matchesDateRange = true;
    if (dateFrom && dateTo) {
      const transactionDate = new Date(transaction.date);
      matchesDateRange =
        transactionDate >= dateFrom && transactionDate <= dateTo;
    }

    return (
      matchesSearch &&
      matchesClassType &&
      matchesPaymentMethod &&
      matchesDateRange
    );
  });

  const handleEditTransaction = (transaction: PaymentTransaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = (updatedTransaction: PaymentTransaction) => {
    transactionHistory.refetch();
  };

  const handleAddTransaction = (newTransaction: PaymentTransaction) => {
    transactionHistory.refetch();
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Student Name",
      "Country",
      "Class Type",
      "Date",
      "Payment Method",
      "Credits",
      "Price",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((transaction: any) => {
        const studentName = `${transaction.student_first_name || ""} ${transaction.student_last_name || ""
          }`.trim();
        return [
          studentName,
          transaction.country || "",
          transaction.class_type_name || "",
          new Date(transaction.date).toLocaleDateString(),
          transaction.payment_method || "",
          transaction.credit || 0,
          `₹${transaction.price || 0}`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-transactions.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const paymentMethodOptions = [
    "all",
    "Credit Card",
    "Bank Transfer",
    "PayPal",
    "Cash",
    "UPI",
  ];

  return (
    <DashboardLayout title="Credit & Payment Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-foreground">
              Credit & Payment Management
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Payment transaction history and management
            </p>
          </div>
          <div className="flex gap-2">
            {
              hasPermission("HAS_CREATE_TRANSACTION_HISTORY") && <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            }
            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Student Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Class Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Type</label>
                <Select
                  value={selectedClassType}
                  onValueChange={setSelectedClassType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {classTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id?.toString() || ""}
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method === "all" ? "All Methods" : method}
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
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionHistory.isLoading ? (
              <SectionLoader text="Loading transaction history..." />
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Class Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction: any) => {
                    const studentName = `${transaction.student_first_name || ""
                      } ${transaction.student_last_name || ""}`.trim();
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {studentName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.country || "-"}
                        </TableCell>
                        <TableCell>
                          {transaction.class_type_name || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.payment_method || "-"}
                        </TableCell>
                        <TableCell>{transaction.credit || 0}</TableCell>
                        <TableCell>{transaction.currency_name}{transaction.price || 0}</TableCell>
                        <TableCell>
                          {
                            hasPermission("HAS_UPDATE_TRANSACTION_HISTORY") && <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTransaction(transaction)}
                              className="flex items-center gap-1"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <EditPaymentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          transaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onRefetch={transactionHistory.refetch}
        />

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={handleAddTransaction}
          onRefetch={transactionHistory.refetch}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreditPaymentManagement;
