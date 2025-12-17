
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onUpdateTransaction: (transaction: any) => void;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onUpdateTransaction
}: EditTransactionModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: '',
    studentName: '',
    activity: '',
    credit: '',
    comments: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date || '',
        studentName: transaction.studentName || '',
        activity: transaction.activity || '',
        credit: transaction.credit?.toString() || '',
        comments: transaction.comments || ''
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.studentName || !formData.activity || !formData.credit) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedTransaction = {
      ...transaction,
      ...formData,
      credit: parseInt(formData.credit)
    };

    onUpdateTransaction(updatedTransaction);
    toast({
      title: "Transaction Updated",
      description: "Transaction has been successfully updated.",
    });
    onClose();
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Transaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="activity">Activity *</Label>
            <Select
              value={formData.activity}
              onValueChange={(value) => setFormData({ ...formData, activity: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Private 60min Class">Private 60min Class</SelectItem>
                <SelectItem value="Private 40min Class">Private 40min Class</SelectItem>
                <SelectItem value="Group Class">Group Class</SelectItem>
                <SelectItem value="Credit Purchase">Credit Purchase</SelectItem>
                <SelectItem value="Credit Refund">Credit Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="credit">Credit *</Label>
            <Input
              id="credit"
              type="number"
              value={formData.credit}
              onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
              placeholder="Enter credit amount (negative for deduction)"
              required
            />
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Input
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Additional comments"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
