
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";
import { PermissionInterface } from '@/types/settings';

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (roleData: {
    name: string;
    description: string;
    permissions: PermissionInterface[];
    isActive: boolean;
  }) => void;
}

export function CreateRoleModal({ open, onOpenChange, onSave }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    if (roleName.trim() && description.trim()) {
      onSave({
        name: roleName,
        description: description,
        permissions: [],
        isActive: isActive
      });

      // Reset form
      setRoleName('');
      setDescription('');
      setIsActive(true);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setRoleName('');
    setDescription('');
    setIsActive(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Create a new user role with custom permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role's purpose"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="role-active">Active Role</Label>
              <p className="text-sm text-muted-foreground">Role will be available for assignment</p>
            </div>
            <Switch
              id="role-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!roleName.trim() || !description.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
