
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, FileText, Download, Eye, Send } from "lucide-react";
import { type User as UserType } from "@/components/user-management/mockData";

interface MessagesResourcesTabProps {
  user: UserType;
}

export function MessagesResourcesTab({ user }: MessagesResourcesTabProps) {
  const messages = [
    {
      id: '1',
      sender: 'Ms. Priya Sharma',
      subject: 'Great progress in today\'s class!',
      content: 'I wanted to let you know that your performance today was excellent. Keep up the good work!',
      timestamp: '2024-01-26 4:30 PM',
      read: false,
      type: 'feedback'
    },
    {
      id: '2',
      sender: 'Admin Team',
      subject: 'Class Schedule Update',
      content: 'Your next class has been rescheduled to Thursday 2:00 PM due to instructor availability.',
      timestamp: '2024-01-25 10:15 AM',
      read: true,
      type: 'notification'
    },
    {
      id: '3',
      sender: 'Ms. Meera Nair',
      subject: 'Practice Assignment',
      content: 'Please practice the basic steps we covered today. I\'ve attached some reference materials.',
      timestamp: '2024-01-23 6:45 PM',
      read: true,
      type: 'assignment'
    }
  ];

  const resources = [
    {
      id: '1',
      title: 'Bharatanatyam Basic Steps Guide',
      type: 'PDF',
      size: '2.5 MB',
      uploadedBy: 'Ms. Priya Sharma',
      uploadDate: '2024-01-20',
      category: 'Tutorial',
      accessed: 5
    },
    {
      id: '2',
      title: 'Practice Session Recording',
      type: 'Video',
      size: '125 MB',
      uploadedBy: 'Ms. Priya Sharma',
      uploadDate: '2024-01-18',
      category: 'Recording',
      accessed: 2
    },
    {
      id: '3',
      title: 'Classical Music Theory',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'Ms. Meera Nair',
      uploadDate: '2024-01-15',
      category: 'Theory',
      accessed: 3
    }
  ];

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'feedback':
        return 'bg-green-50 text-green-600';
      case 'notification':
        return 'bg-blue-50 text-blue-600';
      case 'assignment':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      default:
        return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages Section */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages & Communications
          </CardTitle>
          <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Compose Message
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                  !message.read ? 'bg-blue-50/50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{message.sender}</h4>
                    <Badge variant="outline" className={getMessageTypeColor(message.type)}>
                      {message.type}
                    </Badge>
                    {!message.read && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <h5 className="font-medium text-foreground mb-2">{message.subject}</h5>
                <p className="text-sm text-muted-foreground">{message.content}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    Mark as Read
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Learning Resources
          </CardTitle>
          <Button variant="outline" size="sm">
            Upload Resource
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                    {getFileTypeIcon(resource.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      by {resource.uploadedBy} • {resource.uploadDate}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{resource.type}</span>
                      <span>{resource.size}</span>
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                      <span>Accessed {resource.accessed} times</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Statistics */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Communication Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-muted-foreground">Total Messages</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">Resources Accessed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-muted-foreground">Unread Messages</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-muted-foreground">Resources Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
