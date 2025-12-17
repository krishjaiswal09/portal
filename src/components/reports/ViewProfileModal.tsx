
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, BookOpen } from 'lucide-react';

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

export function ViewProfileModal({ isOpen, onClose, userEmail, userName }: ViewProfileModalProps) {
  // Mock user data based on email
  const getUserData = () => {
    const isAdmin = userEmail.includes('@artgharana.com');
    const isInstructor = isAdmin && (userName.includes('Ms.') || userName.includes('Ustad') || userName.includes('Pandit'));
    
    return {
      name: userName,
      email: userEmail,
      role: isInstructor ? 'Instructor' : isAdmin ? 'Admin' : 'Student',
      joinDate: '2024-01-15',
      phone: '+91 98765 43210',
      courses: isInstructor ? ['Bharatanatyam', 'Classical Dance'] : ['Bharatanatyam Beginner'],
      status: 'Active',
      lastLogin: '2025-06-26 08:30 AM'
    };
  };

  const userData = getUserData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
                  <Badge variant={userData.role === 'Admin' ? 'default' : userData.role === 'Instructor' ? 'secondary' : 'outline'}>
                    {userData.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {userData.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Courses: {userData.courses.join(', ')}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">{userData.status}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{userData.lastLogin}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
