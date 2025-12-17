
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Group, GroupFormData } from "@/types/group";
import { mockUsers } from "./mockData";
import { mockTeachers } from "@/data/groupData";
import { X, Users, UserCheck } from "lucide-react";

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: GroupFormData) => void;
  group?: Group | null;
}

export function GroupFormModal({ isOpen, onClose, onSave, group }: GroupFormModalProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    members: [],
    teacherId: ''
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        members: group.members,
        teacherId: group.teacherId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        members: [],
        teacherId: ''
      });
    }
  }, [group, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleMemberToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const selectedTeacher = mockTeachers.find(t => t.id === formData.teacherId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {group ? 'Edit Group' : 'Create New Group'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name *</Label>
            <Input
              id="groupName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter group description"
              rows={3}
            />
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <Label>Assign Teacher *</Label>
            <Select 
              value={formData.teacherId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {mockTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div className="flex items-center gap-2">
                      <span>{teacher.name}</span>
                      <span className="text-muted-foreground text-sm">({teacher.subject})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Member Selection */}
          <div className="space-y-3">
            <Label>Select Members</Label>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={user.id}
                    checked={formData.members.includes(user.id)}
                    onCheckedChange={() => handleMemberToggle(user.id)}
                  />
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-1">
                      {user.roles.map((role) => (
                        <span 
                          key={role}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.members.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                {formData.members.length} member{formData.members.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Summary */}
          {formData.teacherId && formData.members.length > 0 && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Group Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Teacher:</span> {selectedTeacher?.name}</p>
                <p><span className="font-medium">Members:</span> {formData.members.length} selected</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.name || !formData.teacherId || formData.members.length === 0}
            >
              {group ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
