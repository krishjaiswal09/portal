import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Users,
  CreditCard,
  Settings,
  Pencil,
  Plus,
  Percent,
  ToggleLeft,
} from "lucide-react";
import { useFamilyManagement } from "@/components/user-management/hooks/useFamilyManagement";
import { AddCreditToFamilyModal } from "@/components/user-management/AddCreditToFamilyModal";
import { SetupAutoPaymentModal } from "@/components/user-management/SetupAutoPaymentModal";
import { AddTransactionModal } from "@/components/user-management/AddTransactionModal";
import { EditTransactionModal } from "@/components/user-management/EditTransactionModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { toast } from "@/hooks/use-toast";
import { hasPermission } from "@/utils/checkPermission";
import { log } from "node:console";

export default function FamilyDetails() {
  const { familyId } = useParams<{ familyId: string }>();
  const navigate = useNavigate();
  const { families, convertToFamilyData } = useFamilyManagement();
  const queryClient = useQueryClient();
  const [isAddCreditModalOpen, setIsAddCreditModalOpen] = useState(false);
  const [isAutoPaymentModalOpen, setIsAutoPaymentModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const [selectedClassType, setSelectedClassType] = useState<string | null>(
    null
  );
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [assignedClassTypes, setAssignedClassTypes] = useState<string[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(false);
  const [assignedClassTypesIds, setAssignedClassTypesIds] = useState<any>([]);
  const [assignedClassCredits, setAssignedClassCredits] = useState<number[]>(
    []
  );

  const getFamilyDataMutation = useQuery({
    queryKey: ["getFamilyData", familyId],
    queryFn: () =>
      fetchApi<{
        id: number;
        name: string;
        discount_percentage: number;
        created_at: string;
        updated_at: string;
        class_type: string | null;
        auto_payment: boolean;
        users: Array<{
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          credits: number;
          roles: any[];
        }>;
        class_types: any[];
      }>({
        path: `family/${familyId}`,
        method: "GET",
      }),
  });

  const getClassTypesQuery = useQuery({
    queryKey: ["getClassTypes", editingTransaction],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "classes/class-type",
        method: "GET",
      }),
  });

  const getClassCredits = useQuery({
    queryKey: ["getClassCredits"],
    queryFn: () =>
      fetchApi<any[]>({
        path: `student-credit-overview/family/${familyId}/summary`,
        method: "GET",
      }),
  });

  const getTransactionHistory = useQuery({
    queryKey: ["getTransactionHistory"],
    queryFn: () =>
      fetchApi<any[]>({
        path: `student-credit-history/family/${familyId}`,
        method: "GET",
      }),
  });

  const classCreditsData = getClassCredits?.data || [];
  const transactionHistoryData = getTransactionHistory?.data || [];

  const updateFamilyMutation = useMutation({
    mutationFn: (payload: {
      name?: string;
      discount_percentage?: number;
      class_type?: number[];
      auto_payment?: boolean;
      users?: number[];
    }) =>
      fetchApi<{ data: any }>({
        path: `family/${familyId}`,
        method: "PATCH",
        data: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getFamilyData", familyId] });
    },
    onError: (error) => {
      console.error("Update family error:", error);
    },
  });

  const familyData = getFamilyDataMutation.data;
  const classTypes = getClassTypesQuery?.data || [];

  // Update state with API data when available
  React.useEffect(() => {
    if (familyData) {
      const assignedIds = (familyData as any)?.class_type || [];
      const assignedClassCreditsObjects = getClassCredits?.data?.filter(
        (credit: any) => assignedIds.includes(credit.class_type)
      );
      const assignedClassCreditsBalance = getClassCredits?.data?.filter(
        (credit: any) => credit.balance > 0
      );
      const ClassCreditCardObjectData = [
        ...(assignedClassCreditsObjects || []),
        ...(assignedClassCreditsBalance || []),
      ].filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.class_type === item.class_type)
      );
      setAssignedClassCredits(ClassCreditCardObjectData);
      setDiscountPercentage(familyData.discount_percentage);
      setAutoPaymentEnabled(familyData.auto_payment);
      setAssignedClassTypesIds(familyData.class_type || []);
      setAssignedClassTypes(
        familyData?.class_types?.map((item: any) => item.name)
      );
    }
  }, [familyData]);

  if (!hasPermission("HAS_READ_FAMILY")) {
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

  if (getFamilyDataMutation.isLoading) {
    return (
      <DashboardLayout title="Loading Family Details">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (getFamilyDataMutation.isError || !familyData) {
    return (
      <DashboardLayout title="Family Not Found">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-4">Family Not Found</h2>
          <Button onClick={() => navigate("/users")}>
            Back to User Management
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      ?.map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return "bg-purple-500 text-white";
      case "student":
        return "bg-pink-500 text-white";
      case "parent":
        return "bg-blue-500 text-white";
      case "admin":
        return "bg-primary text-primary-foreground";
      case "support":
        return "bg-green-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const handleClassTypeToggle = (classType: any) => {
    setAssignedClassTypes((prev) =>
      prev.includes(classType.name)
        ? prev.filter((type) => type !== classType.name)
        : [...prev, classType.name]
    );
    setAssignedClassTypesIds((prev) =>
      prev.includes(classType.id)
        ? prev.filter((id) => id !== classType.id)
        : [...prev, classType.id]
    );
  };

  const handleSaveClassTypes = () => {
    const payload = {
      name: familyData.name,
      discount_percentage: discountPercentage,
      class_type: assignedClassTypesIds,
      auto_payment: autoPaymentEnabled,
      users: familyData.users?.map((user: any) => user.id),
    };
    updateFamilyMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Class Types Updated",
          description: "Assigned class types have been updated successfully.",
          variant: "default",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Update Class Types",
          description:
            error?.message || "An error occurred while updating class types.",
          variant: "destructive",
        });
      },
    });
  };

  const handleAddCredit = (creditData: any) => {
    // Handle adding credit
  };

  const handleSetupAutoPayment = (autoPaymentData: any) => {
    // Handle setting up auto payment
  };

  const handleAddTransaction = (transactionData: any) => {
    // Handle adding transaction
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction: any) => {
    // Handle updating transaction
    setEditingTransaction(null);
  };

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setDiscountPercentage(numValue);
    }
  };

  const handleSaveDiscount = () => {
    const payload = {
      name: familyData.name,
      discount_percentage: discountPercentage,
      class_type: assignedClassTypesIds,
      auto_payment: autoPaymentEnabled,
      users: familyData.users?.map((user: any) => user.id),
    };
    updateFamilyMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Discount Updated",
          description: "The family discount was updated successfully.",
          variant: "default",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Update Discount",
          description:
            error?.message || "An error occurred while updating the discount.",
          variant: "destructive",
        });
      },
    });
  };

  const handleAutoPaymentToggle = (enabled: boolean) => {
    setAutoPaymentEnabled(enabled);
    const payload = {
      name: familyData.name,
      discount_percentage: discountPercentage,
      class_type: assignedClassTypesIds,
      auto_payment: enabled,
      users: familyData.users?.map((user: any) => user.id),
    };
    updateFamilyMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "AutoPayment Updated",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to update auto payment setting",
          description: "An error occurred while updating the group.",
          variant: "destructive",
        });
        setAutoPaymentEnabled(familyData.auto_payment);
      },
    });
  };

  // Filter transactions by selected class type
  const filteredTransactions = selectedClassType
    ? transactionHistoryData.filter((t: any) =>
        t.class_type_info.name
          .toLowerCase()
          .includes(selectedClassType.toLowerCase())
      )
    : transactionHistoryData;

  return (
    <DashboardLayout title={`Family: ${familyData.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/users")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <h1 className="text-2xl font-bold">{familyData.name}</h1>
            </div>
          </div>
        </div>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Family Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyData?.users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(`${user.first_name} ${user.last_name}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{`${user.first_name} ${user.last_name}`}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {user.email}
                    </p>
                    <div className="flex gap-2">
                      {user.roles?.map((role) => (
                        <Badge
                          key={role}
                          className={`text-xs ${getRoleColor(role)}`}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div className="text-right">
                  <p className="text-2xl font-bold">{user.credits}</p>
                  <p className="text-sm text-muted-foreground">Credits</p>
                </div> */}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Class Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Class Credits
              <Button
                onClick={() => setIsAddTransactionModalOpen(true)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Transaction
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getClassCredits.isLoading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Loading class credits...
                </p>
              </div>
            ) : assignedClassCredits?.length > 0 ? (
              assignedClassCredits?.map((classCredit: any) => (
                <div
                  key={classCredit.class_type}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors w-[calc(25%-12px)] inline-block m-1.5 ${
                    selectedClassType === classCredit.class_type_info.name
                      ? "border-orange-500 bg-orange-50"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    setSelectedClassType(
                      selectedClassType === classCredit.class_type_info.name
                        ? null
                        : classCredit.class_type_info.name
                    )
                  }
                >
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">
                      {classCredit.class_type_info.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Purchased</p>
                        <p className="font-medium text-lg">
                          {classCredit.totalCreditsPurchased}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-medium text-lg">
                          {classCredit.totalCreditsSpent}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-semibold text-xl text-primary">
                          {classCredit.balance}
                        </p>
                      </div>
                      {/* <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium text-sm">
                          ${classCredit.class_type_info.price}
                        </p>
                      </div> */}
                      <div>
                          <p className="text-muted-foreground">Free Credits</p>
                          <p className="font-semibold text-xl text-primary">
                            {classCredit.free_credits}
                          </p>
                        </div>
                    </div>
                    {classCredit.class_type_info.duration && (
                      <Badge variant="outline">
                        {classCredit.class_type_info.duration} min
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No class credits available</p>
                <p className="text-sm">
                  Class credits will appear here when available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ToggleLeft className="h-5 w-5" />
              Auto Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-payment">Setup Auto Payment</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically charge payment method when credits are low
                </p>
              </div>
              <Switch
                id="auto-payment"
                checked={autoPaymentEnabled}
                onCheckedChange={handleAutoPaymentToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Family Discount Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Family Discount Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    // step="0.1"
                    value={discountPercentage}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Apply discount percentage to all family transactions
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDiscount}
                disabled={updateFamilyMutation.isPending}
              >
                {updateFamilyMutation.isPending ? "Saving..." : "Save Discount"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Class Type Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Assign Class Types
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveClassTypes}
                disabled={updateFamilyMutation.isPending}
              >
                {updateFamilyMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getClassTypesQuery.isLoading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading class types...</p>
              </div>
            ) : classTypes ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Array.isArray(classTypes)
                  ? classTypes
                  : classTypes.data
                )?.map((classType) => (
                  <div
                    key={classType.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`class-${classType.id}`}
                      checked={assignedClassTypesIds.includes(classType.id)}
                      onCheckedChange={() => handleClassTypeToggle(classType)}
                    />
                    <Label
                      htmlFor={`class-${classType.id}`}
                      className="text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{classType.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {classType.credit} credits • {classType.price}{" "}
                          {classType.currency_name}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No class types available
                </p>
              </div>
            )}
            {assignedClassTypes?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Assigned Class Types:
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignedClassTypes?.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Types and Transactions Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Class Credits (1/4) */}
          {/* <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Class Credits
                  <Button
                    onClick={() => setIsAddTransactionModalOpen(true)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Transaction
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {classCreditsData?.length > 0 ? (
                  classCreditsData?.map((classCredit: any) => (
                    <div
                      key={classCredit.class_type}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedClassType === classCredit.class_type_info.name
                          ? "border-orange-500 bg-orange-50"
                          : "hover:bg-muted/50"
                        }`}
                      onClick={() =>
                        setSelectedClassType(
                          selectedClassType === classCredit.class_type_info.name
                            ? null
                            : classCredit.class_type_info.name
                        )
                      }
                    >
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          {classCredit.class_type_info.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">Purchased</p>
                            <p className="font-medium text-lg">
                              {classCredit.totalCreditsPurchased}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Spent</p>
                            <p className="font-medium text-lg">
                              {classCredit.totalCreditsSpent}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Balance</p>
                            <p className="font-semibold text-xl text-primary">
                              {classCredit.balance}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium text-sm">
                              ${classCredit.class_type_info.price}
                            </p>
                          </div>
                        </div>
                        {classCredit.class_type_info.duration && (
                          <Badge variant="outline">
                            {classCredit.class_type_info.duration} min
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No class credits available</p>
                    <p className="text-sm">
                      Class credits will appear here when available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div> */}

          {/* Right Column: Transactions (3/4) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Transaction History
                  {selectedClassType && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      - {selectedClassType}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead className="text-center">Credit</TableHead>
                        <TableHead>Comments</TableHead>
                        {/* <TableHead className="text-right">Actions</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions?.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {transaction.student.first_name}{" "}
                            {transaction.student.last_name}
                          </TableCell>
                          <TableCell>{transaction.activity}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-semibold ${
                                transaction.credit > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.credit > 0 ? "+" : ""}
                              {transaction.credit}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {transaction.comment}
                          </TableCell>
                          {/* <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {selectedClassType
                      ? `No transactions found for ${selectedClassType}`
                      : "No transactions yet"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCreditToFamilyModal
        isOpen={isAddCreditModalOpen}
        onClose={() => setIsAddCreditModalOpen(false)}
        familyName={familyData.name}
        onAddCredit={handleAddCredit}
      />

      <SetupAutoPaymentModal
        isOpen={isAutoPaymentModalOpen}
        onClose={() => setIsAutoPaymentModalOpen(false)}
        familyName={familyData.name}
        onSetupAutoPayment={handleSetupAutoPayment}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        familyName={familyData.name}
        familyId={familyData.id}
        onAddTransaction={handleAddTransaction}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
    </DashboardLayout>
  );
}
