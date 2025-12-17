import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { toast } from "@/hooks/use-toast";

interface AddClassTypeModalProps {
  categoryId: string;
  onAddClassType: (classType: any) => void;
}

export function AddClassTypeModal({
  categoryId,
  onAddClassType,
}: AddClassTypeModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    defaultCredits: 4,
    defaultPrice: 0,
    paymentMethod: "",
    currency: "",
    duration: 60,
  });

  const { data: classTypesData, error: classTypesError } = useQuery({
    queryKey: ["gateway"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "payment-gateway",
      }),
  });

  const { data: currencyData, error: currencyError } = useQuery({
    queryKey: ["currency"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "currency",
      }),
  });

  const addClassTypeMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi({
        path: "classes/class-type",
        method: "POST",
        data: payload,
      }),
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      defaultCredits: 4,
      defaultPrice: 0,
      paymentMethod: "",
      currency: "",
      duration: 60,
    });
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() &&
      formData.defaultCredits > 0 &&
      formData.defaultPrice > 0 &&
      formData.paymentMethod &&
      formData.currency &&
      formData.duration > 0
    ) {
      const payload = {
        name: formData.name.trim(),
        credit: formData.defaultCredits,
        price: formData.defaultPrice,
        payment_gateway: parseInt(formData.paymentMethod),
        category: parseInt(categoryId),
        currency: parseInt(formData.currency),
        duration: formData.duration,
        is_active: true,
      };
      addClassTypeMutation.mutate(payload, {
        onSuccess: (data) => {
          toast({
            title: "Class Type Added Successfully",
            description: "Class Type Added Successfully",
            duration: 3000,
          });
          onAddClassType(data); // Pass the actual API response
          resetForm();
        },
        onError: (error: any) => {
          toast({
            title: "Error Adding Class Type",
            description: error?.message || "An unexpected error occurred.",
            variant: "destructive",
            duration: 5000,
          });
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-3 w-3" />
          Add Class Type
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Class Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="class-name">Class Type Name</Label>
            <Input
              id="class-name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Private Guitar 60 mins"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (mins)</Label>
            <Select
              value={formData.duration.toString()}
              onValueChange={(value) => handleChange("duration", Number(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="40">40 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default-credits">Default Credits</Label>
              <Input
                id="default-credits"
                type="number"
                value={formData.defaultCredits}
                onChange={(e) =>
                  handleChange("defaultCredits", Number(e.target.value))
                }
                placeholder="4"
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="default-price">Default Price</Label>
              <Input
                id="default-price"
                type="number"
                value={formData.defaultPrice}
                onChange={(e) =>
                  handleChange("defaultPrice", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="1"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(v: string) => handleChange("currency", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyData &&
                    currencyData.length > 0 &&
                    currencyData.map(
                      (cur: { id: number | string; name: string }) => (
                        <SelectItem key={cur.id} value={String(cur.id)}>
                          {cur.name}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(v: string) => handleChange("paymentMethod", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {classTypesData?.map(
                    (method: { id: number; name: string }) => (
                      <SelectItem key={method.id} value={String(method.id)}>
                        {method.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.name.trim() ||
                formData.defaultCredits <= 0 ||
                formData.defaultPrice <= 0 ||
                !formData.paymentMethod ||
                !formData.currency ||
                formData.duration <= 0
              }
            >
              Add Class Type
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
