import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon, Pencil } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentTransaction } from "@/types/payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { toast } from "@/hooks/use-toast";

interface Student {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
}

export interface ClassType {
  id?: string;
  name: string;
  paymentLink?: string;
  category?: string;
  credit: number;
  defaultPrice?: number;
  price?: string;
  paymentMethod?: any;
  payment_gateway?: number;
  currency?: any;
  currency_name?: string;
  payment_gateway_name?: string;
  category_name?: string;
  duration: number;
  sessionType?: any;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any | null;
  onUpdateTransaction: (transaction: PaymentTransaction) => void;
  onRefetch?: () => void;
}

export function EditPaymentModal({
  isOpen,
  onClose,
  transaction,
  onUpdateTransaction,
  onRefetch,
}: EditPaymentModalProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    country: "",
    classType: "",
    date: undefined as Date | undefined,
    paymentMethod: "",
    credits: 1,
    price: 0,
    currency_name: "",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);

  const studentsDataMutation = useQuery({
    queryKey: ["studentsdata"],
    queryFn: () =>
      fetchApi<{ data: any[] }>({
        path: "users?roles=student",
      }),
  });

  const classTypeQueries = useQuery({
    queryKey: ["classTypeQueries"],
    queryFn: () =>
      fetchApi<ClassType[]>({
        path: "classes/class-type",
      }),
  });

  const getTransactionById = useQuery({
    queryKey: ["transactionById", transaction?.id],
    queryFn: () =>
      fetchApi<any>({
        path: `transaction-history/${transaction?.id}`,
      }),
    enabled: !!transaction?.id && isOpen,
  });

  useEffect(() => {
    if (
      studentsDataMutation?.data?.data &&
      Array.isArray(studentsDataMutation?.data?.data)
    ) {
      setStudents(studentsDataMutation?.data?.data);
    }
  }, [studentsDataMutation?.data]);

  useEffect(() => {
    if (!classTypeQueries.isLoading && classTypeQueries.data) {
      setClassTypes(classTypeQueries.data);
    }
  }, [classTypeQueries.isLoading, classTypeQueries.data]);

  useEffect(() => {
    if (getTransactionById?.data) {
      const txn = getTransactionById.data;
      setFormData({
        studentId: txn.student_id?.toString() || "",
        country: txn.country?.toUpperCase() || "",
        classType: txn.class_type?.toString() || "",
        date: txn.date ? new Date(txn.date) : undefined,
        paymentMethod: txn.payment_method || "",
        credits: txn.credit || 1,
        price: parseFloat(txn.price) || 0,
        currency_name: txn.currency_name || "",
      });
    }
  }, [getTransactionById?.data]);

  const editTransaction = useMutation({
    mutationFn: async (payload: any) => {
      return await fetchApi<{ data: any }>({
        method: "PATCH",
        path: `transaction-history/${transaction?.id}`,
        data: payload,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction updated successfully!",
      });
      onRefetch?.();
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update transaction",
        variant: "destructive",
      });
    },
  });

  const paymentMethodOptions = [
    "Credits",
    "Credit Card",
    "Bank Transfer",
    "PayPal",
    "Cash",
    "UPI",
    "Stripe",
    "Razor Pay",
    "Zelle",
  ];

  const getCurrencySymbol = (country: string) => {
    switch (country.toUpperCase()) {
      case "USA":
      case "CANADA":
        return "$";
      case "UK":
        return "£";
      case "INDIA":
      case "GLOBAL":
      default:
        return "₹";
    }
  };

  const countries = ["INDIA", "CANADA", "USA", "GLOBAL", "UK"];

  const handleSave = () => {
    if (
      !formData.studentId ||
      !formData.country ||
      !formData.classType ||
      !formData.date ||
      !formData.paymentMethod
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      student_id: parseInt(formData.studentId),
      country: formData.country,
      class_type: parseInt(formData.classType),
      date: formData.date.toISOString().split("T")[0],
      payment_method: formData.paymentMethod,
      payment_gateway:
        formData.paymentMethod === "Credits" ? "Internal" : "External",
      credit: formData.credits,
      price: formData.price,
    };
    editTransaction.mutate(payload);
  };

  const handleClose = () => {
    setFormData({
      studentId: "",
      country: "",
      classType: "",
      date: undefined,
      paymentMethod: "",
      credits: 1,
      price: 0,
      currency_name: "",
    });
    onClose();
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Payment Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Student Name
            </label>
            <Select
              value={formData.studentId}
              onValueChange={(value) =>
                setFormData({ ...formData, studentId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.first_name} {student.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Country</label>
            <Select
              value={formData.country}
              onValueChange={(value) =>
                setFormData({ ...formData, country: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Class Type</label>
            <Select
              value={formData.classType}
              onValueChange={(value) =>
                setFormData({ ...formData, classType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id?.toString() || ""}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData({ ...formData, date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Payment Method
            </label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Credits</label>
            <Input
              type="number"
              min="1"
              value={formData.credits}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  credits: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Price ({formData.currency_name})
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={editTransaction.isPending}
            >
              {editTransaction.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
