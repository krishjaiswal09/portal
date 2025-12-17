
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "./mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";

interface CreateFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFamily: (familyData: {
    name: string;
    students: any[];
  }) => void;
  existingUsers: User[];
}

export function CreateFamilyModal({ isOpen, onClose, onCreateFamily, existingUsers }: CreateFamilyModalProps) {
  const [familyName, setFamilyName] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchApi<{ data: User[] }>({ path: 'users' }),
    enabled: isOpen,
  });

  const users = usersData?.data || [];
  
  // Filter users by role
  const parents = users?.filter(user => user.roles.includes('parent'));
  const students = users?.filter(user => user.roles.includes('student'));

  // Convert students to options for MultiSelect
  const studentOptions = students.map(student => ({
    label: `${student.first_name} ${student.last_name} (${student.email})`,
    value: student.id.toString()
  }));

  const resetForm = () => {
    setFamilyName('');
    setSelectedParent('');
    setSelectedStudents([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a family name",
        variant: "destructive"
      });
      return;
    }

    if (!selectedParent) {
      toast({
        title: "Error",
        description: "Please select a parent",
        variant: "destructive"
      });
      return;
    }

    if (selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one student",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const userIds = [parseInt(selectedParent), ...selectedStudents.map(id => parseInt(id))];
      
      await fetchApi({
        method: 'POST',
        path: 'family',
        data: {
          name: familyName,
          users: userIds
        }
      });

      toast({
        title: "Success",
        description: `Family "${familyName}" created successfully!`,
        duration: 3000
      });

      resetForm();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast({
        title: "Error Creating Family",
        description: error?.message || "Failed to create family",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Family</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="familyName">Family Name</Label>
            <Input
              id="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Enter family name (e.g., Smith Family)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Select Parent</Label>
            <Select value={selectedParent} onValueChange={setSelectedParent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a parent" />
              </SelectTrigger>
              <SelectContent>
                {parents.map(parent => (
                  <SelectItem key={parent.id} value={parent.id.toString()}>
                    {parent.first_name} {parent.last_name} ({parent.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Select Students</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedStudents.length === 0
                    ? "Choose students..."
                    : `${selectedStudents.length} student(s) selected`
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border text-popover-foreground z-50 overflow-auto max-h-[300px] w-full">
                {studentOptions.map((student) => (
                  <DropdownMenuCheckboxItem
                    key={student.value}
                    checked={selectedStudents.includes(student.value)}
                    onCheckedChange={(checked) => {
                      const newStudents = checked
                        ? [...selectedStudents, student.value]
                        : selectedStudents.filter(id => id !== student.value)
                      setSelectedStudents(newStudents)
                    }}
                  >
                    {student.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedStudents.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedStudents.length} student(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !familyName.trim() || !selectedParent || selectedStudents.length === 0}
            >
              {isLoading ? "Creating..." : "Create Family"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
