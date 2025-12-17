import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface ReleaseSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  selectedCount: number;
  isLoading?: boolean;
}

export function ReleaseSlotModal({ isOpen, onClose, onConfirm, selectedCount, isLoading = false }: ReleaseSlotModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Confirm Slot Release
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              You are about to release <strong>{selectedCount}</strong> reserved slot{selectedCount !== 1 ? 's' : ''}.
              This action will make these time slots available for other students to book.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Release (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for releasing these slots..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Releasing...' : 'Release Slots'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}