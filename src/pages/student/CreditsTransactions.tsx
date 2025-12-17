import React, { useState, useEffect } from "react";
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCreditModal } from "@/components/student/AddCreditModal";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const CreditsTransactions = () => {
  const { user } = useAuth();
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [selectedClassTypes, setSelectedClassTypes] = useState<number[]>([]);
  const { toast } = useToast();

  const { data: studentTransactionHistory, isLoading: transactionLoading } =
    useQuery({
      queryKey: ["student-transactions"],
      queryFn: () =>
        fetchApi<any[]>({
          path: `student-credit-history/student/${user.id}`,
        }),
    });

  const { data: familyData, isLoading: familyDataLoading } =
    useQuery({
      queryKey: ["family-by-user"],
      queryFn: () =>
        fetchApi<any>({
          path: `family/by-user/${user.id}`,
        }),
    });

  const {
    data: studentCreditOverview,
    isLoading: studentCreditOverviewLoading,
  } = useQuery({
    queryKey: ["student-credit-overview"],
    queryFn: () =>
      fetchApi<any[]>({
        path: `student-credit-overview/user/${user.id}`,
      }),
  });

  const { data: familyManagerCheck } = useQuery({
    queryKey: ["family-manager-check", user.id],
    queryFn: () =>
      fetchApi<{ is_family_manager: boolean }>({
        path: `family/check-manager/${user.id}`,
      }),
  });


  const creditTransactions =
    studentTransactionHistory?.map((transaction: any) => ({
      id: transaction.id.toString(),
      date: transaction.date,
      teacherName: `${transaction.student.first_name} ${transaction.student.last_name}`,
      activity: transaction.activity,
      credit: transaction.credit,
      comments: transaction.comment,
      classType: transaction.class_type_info?.name || "N/A",
      creditType: transaction.credit_type,
    })) || [];

  // Filter credit overview to only show assigned class types from family data
  const assignedClassTypeIds = familyData?.class_type || [];
  const filteredCreditOverview = studentCreditOverview?.filter((overview: any) =>
    assignedClassTypeIds.includes(overview.class_type)
  ) || [];

  const creditSummary = filteredCreditOverview.map((overview: any) => ({
    classType: overview.class_type_info?.name || 'N/A',
    classTypeId: overview.class_type,
    purchased: overview.totalCreditsPurchased,
    used: overview.totalCreditsSpent,
    balance: overview.balance,
    price: overview.class_type_info?.price || '0',
    duration: overview.class_type_info?.duration || 0
  }));

  // Get available class types from family data
  const availableClassTypes = familyData?.class_types || [];

  // Initialize selected class types when family data loads
  useEffect(() => {
    if (availableClassTypes.length > 0 && selectedClassTypes.length === 0) {
      setSelectedClassTypes(availableClassTypes.map((ct: any) => ct.id));
    }
  }, [availableClassTypes, selectedClassTypes.length]);

  // Filter data based on selected class types
  const filteredCreditSummary = creditSummary.filter((summary) =>
    selectedClassTypes.some((selectedType) => {
      const classTypeData = availableClassTypes.find(
        (ct: any) => ct.id === selectedType
      );
      return classTypeData?.name === summary.classType;
    })
  );

  const filteredTransactions = creditTransactions.filter((transaction) =>
    selectedClassTypes.some((selectedType) => {
      const classTypeData = availableClassTypes.find(
        (ct: any) => ct.id === selectedType
      );
      return classTypeData?.name === transaction.classType;
    })
  );

  // Show all data if no filters match or show filtered data
  const displayCreditSummary =
    filteredCreditSummary.length === 0 && creditSummary.length > 0
      ? creditSummary
      : filteredCreditSummary;
  const displayTransactions =
    filteredTransactions.length === 0 && creditTransactions.length > 0
      ? creditTransactions
      : filteredTransactions;

  const handleClassTypeToggle = (classTypeId: number) => {
    setSelectedClassTypes((prev) =>
      prev.includes(classTypeId)
        ? prev.filter((id) => id !== classTypeId)
        : [...prev, classTypeId]
    );
  };

  const handleSetupAutoPayment = () => {
    toast({
      title: "Auto Payment Setup",
      description: "Auto payment configuration saved successfully!",
    });
  };

  return (
    <StudentDashboardLayout title="Credits & Transactions">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              Credits & Transactions
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your credits and payment settings
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {familyManagerCheck?.is_family_manager && (
              <Button
                onClick={() => setShowAddCreditModal(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Credit
              </Button>
            )}
            {/* <Button onClick={handleSetupAutoPayment} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Setup Auto Payment
            </Button> */}
          </div>
        </div>

        {/* Auto Payment Toggle */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Auto Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Auto Payment</p>
                <p className="text-sm text-gray-600">
                  Automatically purchase credits when balance is low
                </p>
              </div>
              <Switch
                checked={autoPaymentEnabled}
                onCheckedChange={setAutoPaymentEnabled}
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Filter by Class Type */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Class Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {selectedClassTypes.length} class type
                {selectedClassTypes.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex flex-wrap gap-2">
                {availableClassTypes.map((classType: any) => (
                  <Badge
                    key={classType.id}
                    variant={
                      selectedClassTypes.includes(classType.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleClassTypeToggle(classType.id)}
                  >
                    {classType.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Credits Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentCreditOverviewLoading || familyDataLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading credits overview...
              </div>
            ) : displayCreditSummary?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No credit data found for selected filter
              </div>
            ) : (
              displayCreditSummary?.map((classType, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {classType.classType}
                    </h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">${classType.price}</Badge>
                      {classType.duration > 0 && (
                        <Badge variant="outline">{classType.duration} min</Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Purchased
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {classType.purchased}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Used
                        </span>
                      </div>
                      <p className="text-xl font-bold text-red-600">
                        {classType.used}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Balance
                        </span>
                      </div>
                      <p className="text-xl font-bold text-green-600">
                        {classType.balance}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-900">Date</th>
                      <th className="text-left p-3 font-medium text-gray-900">User Name</th>
                      <th className="text-left p-3 font-medium text-gray-900">Activity</th>
                      <th className="text-left p-3 font-medium text-gray-900">Class Type</th>
                      <th className="text-left p-3 font-medium text-gray-900">Credit</th>
                      <th className="text-left p-3 font-medium text-gray-900">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionLoading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          Loading transactions...
                        </td>
                      </tr>
                    ) : displayTransactions?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          No transactions found for selected filter
                        </td>
                      </tr>
                    ) : (
                      displayTransactions?.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="p-3 text-sm">{transaction.teacherName}</td>
                          <td className="p-3 text-sm">
                            <div>
                              <p className="font-medium">{transaction.activity}</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            <div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {transaction.classType}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            <span className={`font-medium ${transaction.credit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.credit > 0 ? '+' : ''}{transaction.credit}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{transaction.comments}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <AddCreditModal
          isOpen={showAddCreditModal}
          onClose={() => setShowAddCreditModal(false)}
        />
      </div>
    </StudentDashboardLayout>
  );
};

export default CreditsTransactions;