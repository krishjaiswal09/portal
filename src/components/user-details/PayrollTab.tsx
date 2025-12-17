import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DollarSign, Plus, Search, Filter, Edit2, Save, X } from "lucide-react";
import { type User } from "../user-management/mockData";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PayrollEntry {
  id: string;
  date: string;
  studentName: string;
  type: string;
  activity:
  | "class_joined"
  | "class_missed"
  | "free_class"
  | "makeup_class"
  | "bonus_class";
  income: number;
  balance: number;
  comment: string;
}

interface PayrollTabProps {
  user: User;
}

export function PayrollTab({ user }: PayrollTabProps) {
  const { toast } = useToast();
  const [creditFilter, setCreditFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PayrollEntry>>({});
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    classType: "",
    currency: "1",
    amount: ""
  });
  const itemsPerPage = 5;

  const {
    data: payrollApiData,
    isLoading: isPayrollLoading,
    error: payrollError,
  } = useQuery({
    queryKey: ["instructor-payment"],
    queryFn: () =>
      fetchApi<any[]>({
        path: `teacher-payroll?teacherId=${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  const { data: classTypesData } = useQuery({
    queryKey: ["class-types"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
  });

  const allCurrencies = useQuery({
    queryKey: ["currency"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "currency",
      }),
  });

  const getSelectedCurrencyName = () => {
    const selectedCurrency = allCurrencies?.data?.find(
      (currency) => currency.id.toString() === modalData.currency
    );
    return selectedCurrency?.name || "INR";
  };

  // Map API data to table format
  const mappedApiData =
    payrollApiData?.map((item) => ({
      id: item?.id?.toString() || "",
      date: item?.created_at
        ? new Date(item.created_at).toISOString().split("T")[0]
        : "",
      studentName:
        item?.teacher_name ||
        `${item?.teacher_first_name || ""} ${item?.teacher_last_name || ""
          }`.trim() ||
        "Unknown",
      type: item?.class_type_name || "Unknown",
      activity: "class_joined" as PayrollEntry["activity"], // Default activity
      currency_name: item?.currency_name, // Default activity
      income: parseFloat(item?.amount || "0"),
      balance: parseFloat(item?.amount || "0"), // Using amount as balance since balance field not in API
      comment: "",
    })) || [];

  const allPayrollData = [...mappedApiData, ...payrollData];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Private 60min":
        return "bg-blue-100 text-blue-800";
      case "Private 40min":
        return "bg-green-100 text-green-800";
      case "Group 60min":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = allPayrollData.filter((item) => {
    const matchesSearch =
      item?.studentName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.comment?.toLowerCase()?.includes(searchTerm.toLowerCase());
    const matchesFilter = creditFilter === "all" || item?.type === creditFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleEdit = (item: PayrollEntry) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const queryClient = useQueryClient();

  const updatePayrollMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      return fetchApi({
        path: `teacher-payroll/${id}`,
        method: "PATCH",
        data: payload,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll entry updated successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-payment"],
      });
      setEditingId(null);
      setEditData({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update payroll entry",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (editingId && editData) {
      const selectedClassType = classTypesData?.find(
        (ct) => ct?.name === editData.type
      );

      const payload = {
        teacher: user.id,
        class_type: selectedClassType?.id || null,
        amount: editData.income,
      };

      console.log("Update Payload:", payload);
      updatePayrollMutation.mutate({ id: editingId, payload });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const addPayrollMutation = useMutation({
    mutationFn: async (payload: any) => {
      return fetchApi({
        path: "teacher-payroll",
        method: "POST",
        data: payload,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll entry added successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-payment"],
      });
      setIsModalOpen(false);
      setModalData({ classType: "", currency: "1", amount: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to add payroll entry",
        variant: "destructive",
      });
    },
  });

  const handleAddPayroll = () => {
    const selectedClassType = classTypesData?.find(
      (ct) => ct?.id?.toString() === modalData.classType
    );

    const payload = {
      teacher: user.id,
      class_type: parseInt(modalData.classType),
      currency: parseInt(modalData.currency),
      amount: parseFloat(modalData.amount)
    };

    console.log("Payload:", payload);
    addPayrollMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
          <CardTitle className="text-foreground flex items-center gap-2 text-xl">
            <DollarSign className="w-6 h-6 text-primary" />
            Payroll Management
          </CardTitle>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by instructor name or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={creditFilter} onValueChange={setCreditFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {classTypesData?.map((classType) => (
                    <SelectItem key={classType?.id} value={classType?.name}>
                      {classType?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isPayrollLoading && (
            <div className="text-center py-4">Loading payroll data...</div>
          )}
          {payrollError && (
            <div className="text-center py-4 text-red-500">
              Error loading payroll data
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px] font-semibold">
                    Date
                  </TableHead>
                  <TableHead className="min-w-[140px] font-semibold">
                    Instructor Name
                  </TableHead>
                  <TableHead className="min-w-[120px] font-semibold">
                    Type
                  </TableHead>
                  <TableHead className="min-w-[100px] font-semibold">
                    Income
                  </TableHead>
                  <TableHead className="min-w-[80px] font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item?.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {item?.date || "N/A"}
                      </TableCell>
                      <TableCell>{item?.studentName || "Unknown"}</TableCell>
                      <TableCell>
                        {editingId === item?.id ? (
                          <Select
                            value={editData?.type || item?.type}
                            onValueChange={(value) =>
                              setEditData({ ...editData, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {classTypesData?.map((classType) => (
                                <SelectItem
                                  key={classType?.id}
                                  value={classType?.name}
                                >
                                  {classType?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getTypeColor(item?.type || "")}>
                            {item?.type || "Unknown"}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {editingId === item?.id ? (
                          <Input
                            value={editData?.income?.toString() || "0"}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                income: parseFloat(e.target.value) || 0,
                              })
                            }
                            type="number"
                          />
                        ) : (
                          <span
                            className={
                              item?.income >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {item?.currency_name} {item?.income?.toLocaleString() || "0"}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {editingId === item?.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleSave}
                              className="h-8 w-8 p-0"
                            >
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No payroll data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payroll Transaction</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Input
                value={`${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Unknown"}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Class Type *</Label>
              <Select
                value={modalData.classType}
                onValueChange={(value) => setModalData(prev => ({ ...prev, classType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class type" />
                </SelectTrigger>
                <SelectContent>
                  {classTypesData?.map((classType) => (
                    <SelectItem key={classType?.id} value={classType?.id?.toString()}>
                      {classType?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={modalData.currency || "1"}
                onValueChange={(value) => setModalData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {allCurrencies?.data?.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id.toString()}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({getSelectedCurrencyName()}) *</Label>
              <Input
                id="amount"
                type="number"
                step="1"
                value={modalData.amount}
                onChange={(e) => setModalData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setModalData({ classType: "", currency: "1", amount: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPayroll}
              disabled={!modalData.classType || !modalData.amount || addPayrollMutation.isPending}
            >
              {addPayrollMutation.isPending ? "Adding..." : "Add Payroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
