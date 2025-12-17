import React, { useState, useMemo } from "react";
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import { TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  date: string;
  activity: string;
  income: number;
  balance: number;
  comment: string;
  credit_type: string;
  class_type: string | null;
  currency_info?: { id: number; name: string };
}

export default function InstructorTransactions() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    activity: "all",
    search: "",
    classType: "all",
  });

  const {
    data: instructorPaymentData,
    isLoading: instructorPaymentDataLoading,
    error: instructorPaymentDataError,
  } = useQuery({
    queryKey: ["instructor-payment"],
    queryFn: () =>
      fetchApi<any>({
        path: `instructor-payment/instructor/${user?.id}/summary`,
      }),
  });

  const { data: classTypesData, isLoading: classTypesLoading } = useQuery({
    queryKey: ["class-types"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
  });

  const transactions = useMemo(() => {
    if (!instructorPaymentData?.payments) return [];
    return instructorPaymentData?.payments?.map((payment: any) => ({
      id: payment.id.toString(),
      date: payment.date,
      activity: payment.activity,
      income: parseFloat(payment.income),
      balance: parseFloat(payment.balance),
      comment: payment.comment,
      credit_type: payment.credit_type,
      class_type: payment?.class_schedule_type_info?.name,
      currency_info: payment.currency_info,
    }));
  }, [instructorPaymentData]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filters.fromDate && transaction.date < filters.fromDate) return false;
      if (filters.toDate && transaction.date > filters.toDate) return false;
      if (
        filters.activity !== "all" &&
        !transaction.activity
          .toLowerCase()
          .includes(filters.activity.toLowerCase())
      )
        return false;
      if (
        filters.search &&
        !transaction.activity
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        !transaction.comment
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      )
        return false;
      if (
        filters.classType !== "all" &&
        transaction.class_type !== filters.classType
      )
        return false;
      return true;
    });
  }, [transactions, filters]);  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const totalIncome = filteredTransactions.reduce(
    (sum, t) => sum + t.income,
    0
  );
  const currentBalance = instructorPaymentData?.balance
    ? parseFloat(instructorPaymentData.balance)
    : 0;
  const totalClasses = instructorPaymentData?.classes_completed_count || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const getActivityBadge = (creditType: string) => {
    switch (creditType) {
      case "credit":
        return <Badge className="bg-green-100 text-green-700">Credit</Badge>;
      case "debit":
        return <Badge className="bg-red-100 text-red-700">Debit</Badge>;
      default:
        return <Badge variant="secondary">{creditType}</Badge>;
    }
  };

  return (
    <InstructorDashboardLayout title="Transactions">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{(instructorPaymentData?.total_income || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From filtered transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ₹{currentBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Classes Completed
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {totalClasses}
              </div>
              <p className="text-xs text-muted-foreground">
                In filtered period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Date Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search activity or comment..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Class Type</Label>
                <Select
                  value={filters.classType}
                  onValueChange={(value) =>
                    setFilters({ ...filters, classType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Class Types</SelectItem>
                    {classTypesData?.map((classType: any) => (
                      <SelectItem key={classType.id} value={classType.name}>
                        {classType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Activity</Label>
                <Select
                  value={filters.activity}
                  onValueChange={(value) =>
                    setFilters({ ...filters, activity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="makeup">Makeup</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Class Type</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructorPaymentDataLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : paginatedTransactions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTransactions?.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.activity}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {transaction.class_type || "null"}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {transaction.currency_info?.name || ''} {transaction.income.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {transaction.currency_info?.name || ''} {transaction.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {transaction.comment}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredTransactions.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />

            {filteredTransactions.length === 0 &&
              !instructorPaymentDataLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found matching the current filters
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  );
}
