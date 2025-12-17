import React, { useEffect, useState } from "react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Users,
  Settings,
  Trash2,
  Pencil,
  Plus,
  Percent,
  ToggleLeft,
} from "lucide-react";
import { type User as UserType } from "@/components/user-management/mockData";
import { SetupAutoPaymentModal } from "../user-management/SetupAutoPaymentModal";
import { EditTransactionModal } from "../user-management/EditTransactionModal";
import { AddTransactionModal } from "../user-management/AddTransactionModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";
import { log } from "node:console";

interface FamilyManagementTabProps {
  user: any;
}

export function FamilyManagementTab({ user }: FamilyManagementTabProps) {
  const [isAutoPaymentModalOpen, setIsAutoPaymentModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const [selectedClassType, setSelectedClassType] = useState<string | null>(
    null
  );
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [assignedClassTypes, setAssignedClassTypes] = useState<number[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(false);
  const [assignedClassCredits, setAssignedClassCredits] = useState<number[]>(
    []
  );
  const [selectedStudentFilter, setSelectedStudentFilter] =
    useState<string>("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch family data using family_id
  const { data: familyData, isLoading: familyLoading } = useQuery({
    queryKey: ["family", user?.family_id],
    queryFn: () => fetchApi({ path: `family/${user.family_id}` }),
    enabled: !!user?.family_id,
  });

  // Fetch class types
  const { data: classTypes, isLoading: classTypesLoading } = useQuery({
    queryKey: ["classTypes"],
    queryFn: () => fetchApi({ path: "classes/class-type" }),
  });

  // Fetch class credits for the family
  const getClassCredits = useQuery({
    queryKey: ["getClassCredits", user?.family_id],
    queryFn: () =>
      fetchApi<any[]>({
        path: `student-credit-overview/family/${user?.family_id}/summary`,
        method: "GET",
      }),
    enabled: !!user?.family_id,
  });

  // Fetch transaction history for the family
  const getTransactionHistory = useQuery({
    queryKey: ["getTransactionHistory", user?.family_id],
    queryFn: () =>
      fetchApi<any[]>({
        path: `student-credit-history/family/${user?.family_id}`,
        method: "GET",
      }),
    enabled: !!user?.family_id,
  });

  // Unified family update mutation
  const updateFamilyMutation = useMutation({
    mutationFn: (updateData: any) =>
      fetchApi({
        path: `family/${user.family_id}`,
        method: "PATCH",
        data: updateData,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Family updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["family", user?.family_id] });
      queryClient.invalidateQueries({
        queryKey: ["getClassCredits", user?.family_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["getTransactionHistory", user?.family_id],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update family",
        variant: "destructive",
      });
    },
  });

  // Real family data
  const family = {
    id: user?.family_id,
    name:
      (familyData as any)?.name ||
      user?.family?.name ||
      `${user?.first_name}'s Family`,
    members: (familyData as any)?.users || [],
    classTypes: (familyData as any)?.class_types || [],
    discount_percentage:
      (familyData as any)?.discount_percentage ||
      user?.discount_percentage ||
      0,
    auto_payment:
      (familyData as any)?.auto_payment || user?.auto_payment || false,
  };

  // Get class credits and transaction history data
  // const classCreditsData = getClassCredits?.data || [];
  const transactionHistoryData = getTransactionHistory?.data || [];

  // Initialize state with family's existing data
  useEffect(() => {
    if (familyData && getClassCredits?.data) {
      const assignedIds = (familyData as any)?.class_type || [];
      const assignedClassCreditsObjects = getClassCredits.data.filter(
        (credit: any) => assignedIds.includes(credit.class_type)
      );
      const assignedClassCreditsBalance = getClassCredits.data.filter(
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
      setAssignedClassTypes(assignedIds);
      setDiscountPercentage((familyData as any)?.discount_percentage || 0);
      setAutoPaymentEnabled((familyData as any)?.auto_payment || false);
    }
  }, [familyData, getClassCredits?.data]);

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
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

  const availableClassTypes =
    (classTypes as any)
      ?.map((ct: any) => ({
        id: ct?.id,
        name: ct?.name,
      }))
      .filter((ct: any) => ct?.id && ct?.name) || [];

  const handleClassTypeToggle = (classTypeId: number) => {
    setAssignedClassTypes((prev) =>
      prev.includes(classTypeId)
        ? prev.filter((type) => type !== classTypeId)
        : [...prev, classTypeId]
    );
  };
  console.log(assignedClassTypes)

  const handleSetupAutoPayment = (autoPaymentData: any) => {
    console.log("Setting up auto payment:", autoPaymentData);
  };

  const handleAddTransaction = (transactionData: any) => {
    // After adding transaction, invalidate queries to refresh data
    queryClient.invalidateQueries({
      queryKey: ["getClassCredits", user?.family_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["getTransactionHistory", user?.family_id],
    });
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction: any) => {
    console.log("Updating transaction:", updatedTransaction);
    setEditingTransaction(null);
    // After updating transaction, invalidate queries to refresh data
    queryClient.invalidateQueries({
      queryKey: ["getClassCredits", user?.family_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["getTransactionHistory", user?.family_id],
    });
  };

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setDiscountPercentage(numValue);
    }
  };

  const createUpdatePayload = () => ({
    name: family.name,
    discount_percentage: discountPercentage,
    class_type: assignedClassTypes,
    auto_payment: autoPaymentEnabled,
    users: family.members?.map((member: any) => member.id),
  });

  const handleSaveDiscount = () => {
    updateFamilyMutation.mutate(createUpdatePayload());
  };

  const handleAutoPaymentToggle = (enabled: boolean) => {
    setAutoPaymentEnabled(enabled);
    updateFamilyMutation.mutate({
      ...createUpdatePayload(),
      auto_payment: enabled,
    });
  };

  const handleSaveClassTypes = () => {
    updateFamilyMutation.mutate(createUpdatePayload());
  };

  const onRemoveMember = (familyId: string, memberId: string) => {
    console.log("Removing member:", familyId, memberId);
  };

  // Create student filter options
  const studentFilterOptions = [
    { label: "All Students", value: "" },
    ...family.members
      .filter(
        (member: any) =>
          member.roles?.includes("student") || member.roles?.includes("parent")
      )
      ?.map((member: any) => ({
        label: `${member.first_name} ${member.last_name}`,
        value: `${member.first_name} ${member.last_name}`,
      })),
  ];

  // Filter transactions by selected class type and student
  const filteredTransactions = transactionHistoryData.filter(
    (transaction: any) => {
      const classTypeMatch = selectedClassType
        ? transaction.class_type_info?.name
          ?.toLowerCase()
          .includes(selectedClassType.toLowerCase())
        : true;
      const studentMatch = selectedStudentFilter
        ? `${transaction.student?.first_name} ${transaction.student?.last_name}` ===
        selectedStudentFilter
        : true;
      return classTypeMatch && studentMatch;
    }
  );

  return (
    <>
      <div className="space-y-6 p-1">
        {/* Header - removed credit management buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">{family.name}</h2>
          </div>
        </div>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Family Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {family.members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No family members found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add members to this family to get started
                </p>
              </div>
            ) : (
              family.members?.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.profile_picture_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(
                          `${member.first_name} ${member.last_name}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {member.roles?.map((role: string) => (
                          <Badge
                            key={role}
                            className={`${getRoleColor(role)} text-xs`}
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* <div className="text-right">
                      <p className="text-2xl font-bold">{member.credits}</p>
                      <p className="text-sm text-muted-foreground">Credits</p>
                    </div> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMember(family.id, member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-1">
          <Card className="h-fit">
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
                    className={`p-4 rounded-lg border cursor-pointer transition-colors w-[calc(25%-12px)] inline-block m-1.5 ${selectedClassType === classCredit.class_type_info.name
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
                            {classCredit.totalCreditsPurchased -
                              classCredit.free_credits}
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
                            {classCredit.balance - classCredit.free_credits}
                          </p>
                        </div>
                        {/* <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium text-sm">
                            {classCredit.class_type_info.price}
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
        </div>

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
                    step="1"
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
                <Label htmlFor="auto-payment">Auto Payment</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically charge payment method when credits are low
                </p>
              </div>
              <Switch
                id="auto-payment"
                checked={autoPaymentEnabled}
                onCheckedChange={handleAutoPaymentToggle}
                disabled={updateFamilyMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Class Type Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assign Class Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableClassTypes?.map((classType) => (
                <div key={classType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${classType.id}`}
                    checked={assignedClassTypes.includes(classType.id)}
                    onCheckedChange={() => handleClassTypeToggle(classType.id)}
                  />
                  <Label htmlFor={`class-${classType.id}`} className="text-sm">
                    {classType.name}
                  </Label>
                </div>
              ))}
            </div>
            {assignedClassTypes?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Assigned Class Types:
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignedClassTypes?.map((typeId) => {
                    const classType = availableClassTypes?.find(
                      (ct) => ct.id === typeId
                    );
                    return (
                      <Badge key={typeId} variant="secondary">
                        {classType?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-4">
              <Button
                onClick={handleSaveClassTypes}
                disabled={updateFamilyMutation.isPending}
                size="sm"
              >
                {updateFamilyMutation.isPending
                  ? "Saving..."
                  : "Save Class Types"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Class Types and Transactions Layout - Enhanced for full page */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Class Credits (1/4) */}
          {/* <div className="lg:col-span-1">
            <Card className="h-fit">
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
                    <p className="text-muted-foreground">Loading class credits...</p>
                  </div>
                ) : classCreditsData?.length > 0 ? (
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
          <div className="lg:col-span-4">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">
                  Transaction History
                  {selectedClassType && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      - {selectedClassType}
                    </span>
                  )}
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="student-filter"
                      className="text-sm font-medium"
                    >
                      Filter by Student
                    </Label>
                    <SearchableSelect
                      options={studentFilterOptions}
                      value={selectedStudentFilter}
                      onValueChange={setSelectedStudentFilter}
                      placeholder="Select student..."
                      searchPlaceholder="Search students..."
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getTransactionHistory.isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Loading transactions...
                    </p>
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px]">Date</TableHead>
                          <TableHead className="min-w-[120px]">
                            Student Name
                          </TableHead>
                          <TableHead className="min-w-[150px]">
                            Activity
                          </TableHead>
                          <TableHead className="text-center min-w-[80px]">
                            Credit
                          </TableHead>
                          <TableHead className="min-w-[120px]">
                            Comments
                          </TableHead>
                          {/* <TableHead className="text-right min-w-[80px]">
                            Actions
                          </TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions?.map((transaction: any) => (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {transaction.student?.first_name}{" "}
                              {transaction.student?.last_name}
                            </TableCell>
                            <TableCell>{transaction.activity}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`font-semibold text-lg ${transaction.credit > 0
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
                                onClick={() =>
                                  handleEditTransaction(transaction)
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      {selectedClassType || selectedStudentFilter
                        ? `No transactions found for the selected filters`
                        : "No transactions yet"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SetupAutoPaymentModal
        isOpen={isAutoPaymentModalOpen}
        onClose={() => setIsAutoPaymentModalOpen(false)}
        familyName={family.name}
        onSetupAutoPayment={handleSetupAutoPayment}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        familyName={family.name}
        familyId={family.id}
        onAddTransaction={handleAddTransaction}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
    </>
  );
}
