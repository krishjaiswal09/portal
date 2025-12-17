
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddCreditToFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyName: string;
  onAddCredit: (creditData: any) => void;
}

export const AddCreditToFamilyModal: React.FC<AddCreditToFamilyModalProps> = ({
  isOpen,
  onClose,
  familyName,
  onAddCredit
}) => {
  const [formData, setFormData] = useState({
    classType: '',
    credits: 0,
    amount: 0,
    paymentMethod: '',
    notes: ''
  });

  const classTypes = [
    'Private 60min',
    'Private 40min',
    'Group Classes',
    'Trial Classes'
  ];

  const paymentMethods = [
    'Credit Card',
    'Bank Transfer',
    'PayPal',
    'Cash',
    'Check'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCredit(formData);
    onClose();
    // Reset form
    setFormData({
      classType: '',
      credits: 0,
      amount: 0,
      paymentMethod: '',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Credit - {familyName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Class Type *</Label>
            <Select value={formData.classType} onValueChange={(value) => setFormData(prev => ({ ...prev, classType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select class type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Credits
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
