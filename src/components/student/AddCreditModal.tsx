import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { StripeProvider } from "@/components/stripe/StripeProvider";
import { StripePaymentForm } from "@/components/stripe/StripePaymentForm";

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCreditModal({ isOpen, onClose }: AddCreditModalProps) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentGateway, setPaymentGateway] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: familyData, isLoading: familyDataLoading } = useQuery({
    queryKey: ["family-by-user"],
    queryFn: () => fetchApi<any>({ path: `family/by-user/${user?.id}` }),
    enabled: isOpen && !!user?.id,
  });

  const { data: studentClassTypes } = useQuery({
    queryKey: ["student-class-types", selectedStudent],
    queryFn: () => fetchApi<any[]>({ path: `class-types/student/${selectedStudent}` }),
    enabled: !!selectedStudent,
  });

  console.log(familyData, "familyData");

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

  // Get class types based on student selection or family data
  const availableClassTypes = selectedStudent && studentClassTypes 
    ? studentClassTypes 
    : familyData?.class_types || [];

  // Get family members for student selection
  const familyMembers = familyData?.users || [];

  const selectedClassTypeData = availableClassTypes.find(
    (ct: any) => ct.id === Number(selectedClassType)
  );

  // Calculate price with discount
  const originalPrice = selectedClassTypeData
    ? Number(selectedClassTypeData.price) * quantity
    : 0;

  const discountPercentage = familyData?.discount_percentage || 0;
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const calculatedPrice = (originalPrice - discountAmount).toFixed(2);

  // Get currency name from selected class type
  const currencyName = selectedClassTypeData?.currency_name || 'USD';

  const handleAddCredit = async () => {
    if (!selectedStudent || !selectedClassType || !paymentGateway) {
      toast({
        title: "Missing Information",
        description: "Please select student, class type and payment gateway",
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
        student_id: Number(selectedStudent),
        class_type: Number(selectedClassType),
        quantity,
      },
      {
        onSuccess: () => {
          toast({
            title: "Credits Added Successfully",
            description: `${quantity} credits added to your account`,
          });
          queryClient.invalidateQueries({
            queryKey: ["student-credit-overview"],
          });
          queryClient.invalidateQueries({ queryKey: ["student-transactions"] });
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
            student_id: Number(selectedStudent),
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
    queryClient.invalidateQueries({ queryKey: ["student-credit-overview"] });
    queryClient.invalidateQueries({ queryKey: ["student-transactions"] });
    resetForm();
  };

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedClassType("");
    setQuantity(1);
    setPaymentGateway("");
    setShowPaymentForm(false);
    setClientSecret(null);
    setIsCreatingPaymentIntent(false);
    onClose();
  };

  const handleDialogClose = () => {
    setSelectedStudent("");
    setSelectedClassType("");
    setQuantity(1);
    setPaymentGateway("");
    setShowPaymentForm(false);
    setClientSecret(null);
    setIsCreatingPaymentIntent(false);
    onClose();
  };

  const handleBackToForm = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    setIsCreatingPaymentIntent(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
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
        ) : showPaymentForm && paymentGateway === "stripe" && clientSecret ? (
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
                    <span>{selectedClassTypeData ? selectedClassTypeData.credit * quantity : 0}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Original:</span>
                      <span className="line-through">{originalPrice.toFixed(2)} {currencyName}</span>
                    </div>
                  )}
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPercentage}%):</span>
                      <span>-{discountAmount.toFixed(2)} {currencyName}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total:</span>
                    <span>{calculatedPrice} {currencyName}</span>
                  </div>
                </div>
              </div>

              <StripePaymentForm
                amount={parseFloat(calculatedPrice)}
                currency={selectedClassTypeData?.currency_name || "USD"}                onSuccess={handleStripePaymentSuccess}
                onCancel={handleBackToForm}
                disabled={purchaseCreditMutation.isPending}
                loading={purchaseCreditMutation.isPending}
                studentId={Number(selectedStudent)}
                classType={Number(selectedClassType)}
                quantity={quantity}
                clientSecret={clientSecret}
              />
            </div>
          </StripeProvider>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="student">Select Student</Label>
              <Select
                value={selectedStudent}
                onValueChange={(value) => {
                  setSelectedStudent(value);
                  setSelectedClassType(""); // Clear class type when student changes
                }}
                disabled={familyDataLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      familyDataLoading
                        ? "Loading..."
                        : "Select student"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.filter((member: any) => member.roles.includes('student')).map((member: any) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.first_name} {member.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="classType">Class Type {selectedStudent ? "(Student's Class Types)" : ""}</Label>
              <Select
                value={selectedClassType}
                onValueChange={setSelectedClassType}
                disabled={familyDataLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      familyDataLoading
                        ? "Loading..."
                        : "Select class type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableClassTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name} - {type.price} {type.currency_name}
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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
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
                id="credits"
                value={selectedClassTypeData ? selectedClassTypeData.credit * quantity : 0}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="totalPrice">Total Price</Label>
              {discountPercentage > 0 && selectedClassTypeData && (
                <div className="text-sm text-green-600 mb-1">
                  Original: {originalPrice.toFixed(2)} {currencyName} | Discount ({discountPercentage}%): -{discountAmount.toFixed(2)} {currencyName}
                </div>
              )}
              <Input
                id="totalPrice"
                value={`${calculatedPrice} ${currencyName}`}
                readOnly
                className="bg-gray-100 font-semibold"
              />
            </div>

            <div>
              <Label htmlFor="paymentGateway">Payment Gateway</Label>
              <Select value={paymentGateway} onValueChange={setPaymentGateway}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">
                    Stripe
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddCredit}
                disabled={
                  purchaseCreditMutation.isPending || isCreatingPaymentIntent
                }
                className="bg-orange-600 hover:bg-orange-700 flex-1"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {purchaseCreditMutation.isPending || isCreatingPaymentIntent
                  ? "Processing..."
                  : "Add Credits"}
              </Button>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}