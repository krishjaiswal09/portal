import { useState, useEffect } from "react";
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
import { Edit } from "lucide-react";
import { ClassType } from "@/types/classType";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface EditClassTypeModalProps {
  classType: ClassType;
  onEditClassType: (payload: any) => void;
}

export function EditClassTypeModal({
  classType,
  onEditClassType,
}: EditClassTypeModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: classType.name,
    credit: classType.credit,
    price: (classType as any).price || classType.defaultPrice,
    payment_gateway:
      (classType as any).payment_gateway || classType.paymentMethod,
    currency: (classType as any).currency || classType.currency,
    duration: classType.duration,
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

  useEffect(() => {
    setFormData({
      name: classType.name,
      credit: classType.credit,
      price: classType.price,
      payment_gateway: classType.payment_gateway,
      currency: classType.currency,
      duration: classType.duration,
    });
  }, [classType]);

  const handleFieldChange = (field: string, value: any) => {
    console.log(`Field ${field} changed to:`, value);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      console.log("Updated formData:", updated);
      return updated;
    });
  };

  const resetFormData = () => {
    setFormData({
      name: classType.name,
      credit: classType.credit,
      price: (classType as any).price || classType.defaultPrice,
      payment_gateway:
        (classType as any).payment_gateway || classType.paymentMethod,
      currency: (classType as any).currency || classType.currency,
      duration: classType.duration,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.credit > 0 && formData.price > 0) {
      const payload = {
        id: classType.id,
        name: formData.name.trim(),
        credit: formData.credit,
        price: formData.price,
        payment_gateway: formData.payment_gateway,
        currency: formData.currency,
        duration: formData.duration,
      };
      onEditClassType(payload);
      resetFormData();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Edit className="h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Class Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-class-name">Class Type Name</Label>
            <Input
              id="edit-class-name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-duration">Duration (mins)</Label>
            <Select
              value={formData.duration?.toString()}
              onValueChange={(value) =>
                handleFieldChange("duration", Number(value))
              }
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
              <Label htmlFor="edit-default-credits">Default Credits</Label>
              <Input
                id="edit-default-credits"
                type="number"
                value={formData.credit}
                onChange={(e) =>
                  handleFieldChange("credit", Number(e.target.value))
                }
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-currency">Currency</Label>
              <Select
                value={formData.currency.toString()}
                onValueChange={(value) =>
                  handleFieldChange("currency", Number(value))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyData?.map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id.toString()}
                    >
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-default-price">Default Price</Label>
              <Input
                id="edit-default-price"
                type="number"
                value={
                  typeof formData.price === "number" && Number.isInteger(formData.price)
                    ? formData.price
                    : formData.price?.toString().replace(/\.00$/, "")
                }
                onChange={(e) =>
                  handleFieldChange("price", Number(e.target.value))
                }
                min="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-payment-method">Payment Gateway</Label>
              <Select
                value={formData.payment_gateway.toString()}
                onValueChange={(value) =>
                  handleFieldChange("payment_gateway", Number(value))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classTypesData?.map((gateway) => (
                    <SelectItem key={gateway.id} value={gateway.id.toString()}>
                      {gateway.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetFormData();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.name.trim() ||
                formData.credit <= 0 ||
                formData.price <= 0
              }
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
