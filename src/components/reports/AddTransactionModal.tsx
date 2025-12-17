
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    learner: '',
    course: '',
    numberOfClasses: '1',
    transactionDate: undefined as Date | undefined,
    comments: ''
  });
  const { toast } = useToast();

  const learnerOptions = ['Alice Johnson', 'Bob Davis', 'Carol White', 'Eve Brown'];
  const courseOptions = ['Guitar Basics', 'Piano Intermediate', 'Violin Advanced', 'Drums Beginner'];

  const handleSave = () => {
    if (!formData.learner || !formData.course || !formData.transactionDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transaction Added",
      description: "The transaction has been successfully added.",
    });
    
    // Reset form
    setFormData({
      learner: '',
      course: '',
      numberOfClasses: '1',
      transactionDate: undefined,
      comments: ''
    });
    
    onClose();
  };

  const handleClose = () => {
    setFormData({
      learner: '',
      course: '',
      numberOfClasses: '1',
      transactionDate: undefined,
      comments: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Learner</label>
            <Select value={formData.learner} onValueChange={(value) => setFormData({...formData, learner: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select learner" />
              </SelectTrigger>
              <SelectContent>
                {learnerOptions.map((learner) => (
                  <SelectItem key={learner} value={learner}>{learner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Course</label>
            <Select value={formData.course} onValueChange={(value) => setFormData({...formData, course: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((course) => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">No of Classes</label>
            <Input
              type="number"
              min="1"
              value={formData.numberOfClasses}
              onChange={(e) => setFormData({...formData, numberOfClasses: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Transaction Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.transactionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.transactionDate ? format(formData.transactionDate, "PPP") : "Transaction date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.transactionDate}
                  onSelect={(date) => setFormData({...formData, transactionDate: date})}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Comments</label>
            <Textarea
              placeholder="Comments"
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Close
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
