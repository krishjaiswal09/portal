
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';

interface InstructorPaymentDetail {
  id: string;
  date: string;
  instructorName: string;
  studentName: string;
  type: string;
  class_type: string;
  activity: 'class_joined' | 'class_missed' | 'free_class' | 'makeup_class' | 'bonus_class' | 'class_completed';
  income: number;
  balance: number;
  comment: string;
  instructor_id?: number;
  class_id?: number;
  currency?: number;
}

interface EditInstructorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: InstructorPaymentDetail | null;
  onUpdatePayment: (payment: InstructorPaymentDetail) => Promise<void>;
}

export function EditInstructorPaymentModal({ isOpen, onClose, payment, onUpdatePayment }: EditInstructorPaymentModalProps) {
  const [formData, setFormData] = useState<InstructorPaymentDetail | null>(null);

  const classTypeQueries = useQuery({
    queryKey: ["classTypeQueries"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "classes/class-type",
      }),
    enabled: !!isOpen,
  });

  useEffect(() => {
    if (payment) {
      console.log(typeof payment.class_type);
      
      setFormData({ 
        ...payment,
        date: payment.date.split('T')[0],
        activity: payment.activity.toLowerCase().replace(/\s+/g, '_') as InstructorPaymentDetail['activity'],
        class_type: payment.class_type?.toString() || '',
      });
    }
  }, [payment, classTypeQueries?.data]);

  const handleSave = async () => {
    if (formData) {
      await onUpdatePayment(formData);
      onClose();
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'class_joined':
        return 'Class Joined';
      case 'class_missed':
        return 'Class Missed';
      case 'free_class':
        return 'Free Class';
      case 'makeup_class':
        return 'Makeup Class';
      case 'bonus_class':
        return 'Bonus Class';
      default:
        return activity;
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Payment Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Student Name</label>
            <Input
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Class Type</label>
            <Select 
              value={formData.class_type} 
              onValueChange={(value) => setFormData({...formData, class_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classTypeQueries?.data?.map((classType: any) => (
                  <SelectItem key={classType.id} value={classType.id}>
                    {classType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Activity</label>
            <Select 
              value={formData.activity} 
              onValueChange={(value) => setFormData({...formData, activity: value as InstructorPaymentDetail['activity']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class_joined">Class Joined</SelectItem>
                <SelectItem value="class_missed">Class Missed</SelectItem>
                <SelectItem value="free_class">Free Class</SelectItem>
                <SelectItem value="makeup_class">Makeup Class</SelectItem>
                <SelectItem value="bonus_class">Bonus Class</SelectItem>
                <SelectItem value="class_completed">Class Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Income</label>
            <Input
              type="number"
              value={formData.income}
              onChange={(e) => setFormData({...formData, income: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Balance</label>
            <Input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Comment</label>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
