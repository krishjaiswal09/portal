
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SetupAutoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyName: string;
  onSetupAutoPayment: (autoPaymentData: {
    amount: number;
    frequency: string;
    classType: string;
    paymentMethod: string;
    isEnabled: boolean;
    triggerAmount: number;
  }) => void;
}

export function SetupAutoPaymentModal({ 
  isOpen, 
  onClose, 
  familyName, 
  onSetupAutoPayment 
}: SetupAutoPaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [classType, setClassType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [triggerAmount, setTriggerAmount] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !frequency || !classType || !paymentMethod || !triggerAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    const triggerCreditAmount = parseFloat(triggerAmount);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(triggerCreditAmount) || triggerCreditAmount < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid trigger amount",
        variant: "destructive"
      });
      return;
    }

    onSetupAutoPayment({
      amount: paymentAmount,
      frequency,
      classType,
      paymentMethod,
      isEnabled,
      triggerAmount: triggerCreditAmount
    });

    // Reset form
    setAmount('');
    setFrequency('');
    setClassType('');
    setPaymentMethod('');
    setIsEnabled(true);
    setTriggerAmount('');
    onClose();

    toast({
      title: "Success",
      description: `Auto payment setup completed for ${familyName}!`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setup Auto Payment for {familyName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Auto Payment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerAmount">Trigger When Balance Below ($)</Label>
            <Input
              id="triggerAmount"
              type="number"
              step="0.01"
              min="0"
              value={triggerAmount}
              onChange={(e) => setTriggerAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Payment Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency} required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="when-low">When Balance Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="classType">Class Type</Label>
            <Select value={classType} onValueChange={setClassType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select class type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vocal">Vocal</SelectItem>
                <SelectItem value="instrumental">Instrumental</SelectItem>
                <SelectItem value="dance">Dance</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isEnabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
            <Label htmlFor="isEnabled">Enable Auto Payment</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Setup Auto Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
