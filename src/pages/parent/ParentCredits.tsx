import React, { useState, useEffect } from "react";
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout";
import { ParentMessageIcon } from "@/components/parent/ParentMessageIcon";
import { ParentLearnerSelector } from "@/components/parent/ParentLearnerSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  Download,
  CalendarIcon,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParentLearner } from "@/contexts/ParentLearnerContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";

import { StripeProvider } from "@/components/stripe/StripeProvider";
import { StripePaymentForm } from "@/components/stripe/StripePaymentForm";

const ParentCredits = () => {
  const { selectedLearner } = useParentLearner();
  if (!selectedLearner?.id) {
    return (
      <ParentDashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Learner Not selected</h2>
        </div>
      </ParentDashboardLayout>
    );
  }
  const [autoPaymentEnabled, setAutoPaymentEnabled] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [selectedClassTypes, setSelectedClassTypes] = useState<number[]>([]);
  const [downloadDateRange, setDownloadDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedClassType, setSelectedClassType] = useState("");

  const [paymentGateway, setPaymentGateway] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: studentTransactionHistory, isLoading: transactionLoading } =
    useQuery({
      queryKey: ["student-transactions", selectedLearner?.id],
      queryFn: () =>
        fetchApi<any[]>({
          path: `student-credit-history/student/${selectedLearner?.id}`,
        }),
      enabled: !!selectedLearner?.id,
    });

  const {
    data: studentCreditOverview,
    isLoading: studentCreditOverviewLoading,
  } = useQuery({
    queryKey: ["student-credit-overview", selectedLearner?.id],
    queryFn: () =>
      fetchApi<any[]>({
        path: `student-credit-overview/user/${selectedLearner?.id}`,
      }),
    enabled: !!selectedLearner?.id,
  });

  const { data: familyData, isLoading: familyDataLoading } = useQuery({
    queryKey: ["family-by-user", selectedLearner?.id],
    queryFn: () =>
      fetchApi<any>({
        path: `family/by-user/${selectedLearner.id}`,
      }),
    enabled: !!selectedLearner?.id,
  });

  const { user } = useAuth();
  const { data: familyManagerCheck } = useQuery({
    queryKey: ["family-manager-check", user.id],
    queryFn: () =>
      fetchApi<{ is_family_manager: boolean }>({
        path: `family/check-manager/${user.id}`,
      }),
  });

  // Get class types from family data
  const availableClassTypes = familyData?.class_types || [];
  const familyDiscountPercentage = familyData?.discount_percentage || 0;

  // Initialize selected class types when family data loads
  useEffect(() => {
    if (availableClassTypes.length > 0 && selectedClassTypes.length === 0) {
      setSelectedClassTypes(availableClassTypes.map((ct: any) => ct.id));
    }
  }, [availableClassTypes, selectedClassTypes.length]);

  const purchaseCreditMutation = useMutation({
    mutationFn: (data: {
      student_id: number;
      class_type: number;
      quantity: number;
    }) =>
      fetchApi({
        path: "student-credit-history/purchase",
        method: "POST",
        data,
      }),
  });

  const creditTransactions =
    studentTransactionHistory?.length > 0
      ? studentTransactionHistory?.map((transaction: any) => ({
        id: transaction.id?.toString() || Math.random().toString(),
        date: transaction.date || new Date().toISOString(),
        teacherName: transaction.student
          ? `${transaction.student.first_name || ""} ${transaction.student.last_name || ""
            }`.trim()
          : "N/A",
        activity: transaction.activity || "N/A",
        credit: transaction.credit || 0,
        comments: transaction.comment || "No comments",
        classType: transaction.class_type_info?.name || "N/A",
        creditType: transaction.credit_type || "N/A",
      }))
      : [];

  const creditSummary =
    studentCreditOverview?.length > 0
      ? studentCreditOverview?.map((overview: any) => ({
        classType: overview.class_type_info?.name || "N/A",
        purchased: overview.totalCreditsPurchased || 0,
        used: overview.totalCreditsSpent || 0,
        balance: overview.balance || 0,
      }))
      : [];

  // Show all data if no filters match or show filtered data
  const filteredCreditSummary =
    creditSummary?.length > 0
      ? creditSummary?.filter((summary) =>
        selectedClassTypes.some((selectedType) => {
          const classTypeData = availableClassTypes.find(
            (ct: any) => ct.id === selectedType
          );
          return classTypeData?.name === summary.classType;
        })
      )
      : creditSummary;

  const filteredTransactions =
    creditTransactions?.length > 0
      ? creditTransactions?.filter((transaction) =>
        selectedClassTypes.some((selectedType) => {
          const classTypeData = availableClassTypes.find(
            (ct: any) => ct.id === selectedType
          );
          return classTypeData?.name === transaction.classType;
        })
      )
      : creditTransactions;

  // If filtered results are empty but original data exists, show all data
  const displayCreditSummary =
    filteredCreditSummary?.length === 0 && creditSummary?.length > 0
      ? creditSummary
      : filteredCreditSummary;
  const displayTransactions =
    filteredTransactions?.length === 0 && creditTransactions?.length > 0
      ? creditTransactions
      : filteredTransactions;

  const handleClassTypeToggle = (classTypeId: number) => {
    setSelectedClassTypes((prev) =>
      prev.includes(classTypeId)
        ? prev?.filter((id) => id !== classTypeId)
        : [...prev, classTypeId]
    );
  };

  const selectedClassTypeData = availableClassTypes.find(
    (ct: any) => ct.id.toString() === selectedClassType
  );

  const calculateTotalPrice = () => {
    if (!selectedClassTypeData) return 0;
    const basePrice = Number(selectedClassTypeData.price || 0);
    const baseTotal = basePrice * quantity;
    const discount = baseTotal * (familyDiscountPercentage / 100);
    return baseTotal - discount;
  };

  const calculatedPrice = calculateTotalPrice().toFixed(2);
  const basePrice = selectedClassTypeData ? (Number(selectedClassTypeData.price || 0) * quantity).toFixed(2) : "0.00";
  const discountAmount = selectedClassTypeData ? ((Number(selectedClassTypeData.price || 0) * quantity) * (familyDiscountPercentage / 100)).toFixed(2) : "0.00";

  const createStripePaymentIntent = async () => {
    setIsCreatingPaymentIntent(true);

    try {
      const token = localStorage.getItem("token");
      const BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "https://api.devportal.artgharana.com";

      const response = await fetch(
        `${BASE_URL}/stripe-payment/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            student_id: user?.id,
            class_type: Number(selectedClassType),
            quantity: quantity,
            currency_id: selectedClassTypeData?.currency_id
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const paymentIntentResponse = await response.json();
      setClientSecret(paymentIntentResponse.client_secret);
      setShowPaymentForm(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  };

  const handleStripePaymentSuccess = (paymentIntentId: string) => {
    // Payment successful - backend will handle credit addition via webhook
    toast({
      title: "Payment Successful!",
      description: `Your payment has been processed successfully. Credits will be added to your account shortly.`,
    });
    resetForm();
  };

  const resetForm = () => {
    setSelectedClassType("");
    setQuantity(1);
    setPaymentGateway("");
    setShowPaymentForm(false);
    setClientSecret(null);
    setIsCreatingPaymentIntent(false);
    setShowAddCreditModal(false);
    queryClient.invalidateQueries({ queryKey: ["student-transactions"] });
    queryClient.invalidateQueries({
      queryKey: ["student-credit-overview"],
    });
  };

  const handleBackToForm = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    setIsCreatingPaymentIntent(false);
  };

  const handleAddCredits = async () => {
    if (!selectedClassType || !paymentGateway || !selectedLearner?.id) {
      toast({
        title: "Missing Information",
        description: "Please select class type and payment gateway",
        variant: "destructive",
      });
      return;
    }

    if (paymentGateway === "stripe") {
      await createStripePaymentIntent();
      return;
    }

    // Handle non-Stripe payments (existing flow)
    purchaseCreditMutation.mutate(
      {
        student_id: +selectedLearner.id,
        class_type: Number(selectedClassType),
        quantity,
      },
      {
        onSuccess: () => {
          toast({
            title: "Credits Added Successfully",
            description: `${quantity} credits added to your account`,
          });
          resetForm();
        },
        onError: (error: any) => {
          toast({
            title: "Payment Failed",
            description: error?.message || "Failed to process payment",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDownloadTransactions = () => {
    toast({
      title: "Download Started",
      description: "Transaction history is being prepared for download.",
    });
  };

  return (
    <ParentDashboardLayout title="Credits & Transactions">
      <div className="space-y-6">
        <ParentLearnerSelector />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-playfair font-bold mb-2">
                Credits & Transactions
              </h2>
              <p className="text-gray-600">
                {selectedLearner
                  ? `Manage ${selectedLearner.name}'s credits and payment settings`
                  : "Manage credits and payment settings"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {familyManagerCheck?.is_family_manager && (
                <Dialog
                  open={showAddCreditModal}
                  onOpenChange={(open) => {
                    if (!open) resetForm();
                    setShowAddCreditModal(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Credit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {showPaymentForm ? "Complete Payment" : "Add Credits"}
                      </DialogTitle>
                    </DialogHeader>

                    {isCreatingPaymentIntent ? (
                      <div className="space-y-4">
                        <div className="flex justify-center items-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                          <span className="ml-2 text-gray-600">
                            Initializing payment...
                          </span>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={handleBackToForm}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : showPaymentForm &&
                      paymentGateway === "stripe" &&
                      clientSecret ? (
                      <StripeProvider clientSecret={clientSecret}>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">
                              Order Summary
                            </h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Class Type:</span>
                                <span>{selectedClassTypeData?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span>{quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Credits:</span>
                                <span>{selectedClassTypeData?.credit * quantity}</span>
                              </div>
                              <div className="flex justify-between font-medium pt-1 border-t">
                                <span>Base Total:</span>
                                <span>{selectedClassTypeData?.currency_name || ''} {basePrice}</span>
                              </div>
                              {familyDiscountPercentage > 0 && (
                                <div className="flex justify-between text-red-600">
                                  <span>Discount ({familyDiscountPercentage}%):</span>
                                  <span>-{selectedClassTypeData?.currency_name || ''} {discountAmount}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-medium pt-1 border-t text-green-600">
                                <span>Final Total:</span>
                                <span>{selectedClassTypeData?.currency_name || ''} {calculatedPrice}</span>
                              </div>
                            </div>
                          </div>

                          <StripePaymentForm
                            amount={parseFloat(calculatedPrice)}
                            currency={selectedClassTypeData?.currency_name || "USD"}
                            onSuccess={handleStripePaymentSuccess}
                            onCancel={handleBackToForm}
                            disabled={purchaseCreditMutation.isPending}
                            loading={purchaseCreditMutation.isPending}
                            studentId={+selectedLearner?.id || 0}
                            classType={Number(selectedClassType)}
                            quantity={quantity}
                            clientSecret={clientSecret}
                          />
                        </div>
                      </StripeProvider>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="classType">Class Type</Label>
                          <Select
                            value={selectedClassType}
                            onValueChange={setSelectedClassType}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  familyDataLoading ? "Loading..." : "Select class type"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableClassTypes
                                ?.filter((type: any) => type.is_active)
                                ?.map((type: any) => (
                                  <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name} - {type.currency_name} {type.price}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                              disabled={quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(
                                  Math.max(1, parseInt(e.target.value) || 1)
                                )
                              }
                              className="w-20 text-center"
                              min="1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="credits">Credits</Label>
                          <Input
                            value={
                              selectedClassTypeData
                                ? selectedClassTypeData.credit * quantity
                                : 0
                            }
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>

                        <div>
                          <Label htmlFor="totalPrice">Total Price</Label>
                          <div className="text-sm text-green-600 mt-1">
                            {familyDiscountPercentage > 0 ? (
                              `Original: ${selectedClassTypeData?.currency_name || ''} ${basePrice} | Discount (${familyDiscountPercentage}%): -${selectedClassTypeData?.currency_name || ''} ${discountAmount}`
                            ) : (
                              `${selectedClassTypeData?.currency_name || ''} ${basePrice}`
                            )}
                          </div>
                          <Input
                            value={`${selectedClassTypeData?.currency_name || ''} ${calculatedPrice}`}
                            readOnly
                            className="bg-gray-100 font-semibold mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="paymentGateway">Payment Gateway</Label>
                          <Select
                            value={paymentGateway}
                            onValueChange={setPaymentGateway}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment gateway" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stripe">Stripe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleAddCredits}
                            disabled={
                              purchaseCreditMutation.isPending ||
                              isCreatingPaymentIntent
                            }
                            className="bg-orange-600 hover:bg-orange-700 flex-1"
                          >
                            {purchaseCreditMutation.isPending ||
                              isCreatingPaymentIntent
                              ? "Processing..."
                              : "Add Credits"}
                          </Button>
                          <Button variant="outline" onClick={resetForm}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}

              {/* <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Setup Auto Payment
              </Button> */}
            </div>
          </div>

          {/* Auto Payment Settings */}
          {/* <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Auto Payment Settings</CardTitle>
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filter by Class Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  {selectedClassTypes?.length} class type
                  {selectedClassTypes?.length !== 1 ? "s" : ""} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableClassTypes?.map((classType: any) => (
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Credits Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentCreditOverviewLoading || familyDataLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading credits overview...
                </div>
              ) : displayCreditSummary?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No credit data found
                  {studentCreditOverview && (
                    <div className="mt-2 text-xs">
                      Raw data: {JSON.stringify(studentCreditOverview)}
                    </div>
                  )}
                </div>
              ) : (
                displayCreditSummary?.map((classType, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-lg mb-3 text-gray-900">
                      {classType.classType}
                    </h4>
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
              )}{" "}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <div className="flex gap-2">
                  <Popover
                    open={showDatePicker}
                    onOpenChange={setShowDatePicker}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Date Range
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <div className="p-3">
                        <div className="space-y-3">
                          <div>
                            <Label>From Date</Label>
                            <Calendar
                              mode="single"
                              selected={downloadDateRange.from}
                              onSelect={(date) =>
                                setDownloadDateRange((prev) => ({
                                  ...prev,
                                  from: date,
                                }))
                              }
                              className="rounded-md border"
                            />
                          </div>
                          <div>
                            <Label>To Date</Label>
                            <Calendar
                              mode="single"
                              selected={downloadDateRange.to}
                              onSelect={(date) =>
                                setDownloadDateRange((prev) => ({
                                  ...prev,
                                  to: date,
                                }))
                              }
                              className="rounded-md border"
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTransactions}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-900">
                          Date
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900">
                          Teacher Name
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900">
                          Activity
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900">
                          Credit
                        </th>
                        <th className="text-left p-3 font-medium text-gray-900">
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionLoading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-gray-500"
                          >
                            Loading transactions...
                          </td>
                        </tr>
                      ) : displayTransactions?.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-gray-500"
                          >
                            No transactions found
                            {studentTransactionHistory && (
                              <div className="mt-2 text-xs">
                                Raw data:{" "}
                                {JSON.stringify(studentTransactionHistory)}
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        displayTransactions?.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3 text-sm">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-sm">
                              {transaction.teacherName}
                            </td>
                            <td className="p-3 text-sm">
                              <div>
                                <p className="font-medium">
                                  {transaction.activity}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {transaction.classType}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <span
                                className={`font-medium ${transaction.credit > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                                  }`}
                              >
                                {transaction.credit > 0 ? "+" : ""}
                                {transaction.credit}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {transaction.comments}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ParentMessageIcon />
    </ParentDashboardLayout>
  );
};

export default ParentCredits;
