
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Download, Eye, Send, FileText, Paperclip, User } from "lucide-react";
import { ChatInterface } from "../user-management/ChatInterface";
import { type User as UserType } from "@/components/user-management/mockData";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/contexts/AuthContext";
import { extractFile } from '@/utils/extractFileFromUrl';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MessagesResourcesToggleProps {
  user: UserType;
  role: "student" | "instructor";
}

export function MessagesResourcesToggle({ user, role }: MessagesResourcesToggleProps) {
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'messages' | 'resources'>('messages');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversation, setConversation] = useState<any | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>('');

  const isInstructor = currentUser?.roles?.includes('instructor');

  // Get user conversations
  const getUsersForMessages = useQuery({
    queryKey: ["getUsersForMessages", user?.id],
    queryFn: () =>
      fetchApi<any[]>({
        path: role === "instructor" ? `classes/class-schedule/users/instructor/${user.id}` : `classes/class-schedule/instructors/student/${user.id}`,
      }),
  });

  const conversationsQuery = useQuery({
    queryKey: ["userConversations", user?.id],
    queryFn: () =>
      fetchApi<{ conversations: any[], success: boolean }>({
        path: "chat/conversations",
        params: { userId: user?.id },
      }),
    enabled: !!user?.id,
  });

  // Get messages for selected conversation
  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      fetchApi<{ messages: any[], success: boolean }>({
        path: `chat/messages/${conversationId}`,
      }),
    enabled: !!conversationId,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: (data: { participantIds: string[] }) =>
      fetchApi<{ data: any }>({
        path: "chat/conversation",
        method: "POST",
        data: {
          groupName: null,
          isGroup: false,
          participantIds: data.participantIds,
          created_by: currentUser?.id
        }
      }),
    onSuccess: (response) => {
      if (response.data) {
        setConversationId(response.data.id)
        setConversation(response.data)
      }
    },
  });

  // Socket.IO connection
  const { isConnected, connectionError } = useSocket();

  const getSelectedUser = (selected) => {
    if (selected) {
      return getUsersForMessages.data?.find((p: any) => p.id.toString() === selectedUser)
    }
  }


  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
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

  const handleUserSelect = (userId: string) => {
    if (!currentUser?.id || !userId) return;

    // Check if conversation exists
    const existingConversation = conversationsQuery.data?.success ? conversationsQuery.data.conversations?.find(
      (conv) => conv.members?.some((p: any) => p.user_id == userId)
    ) : null

    if (existingConversation) {
      setConversationId(existingConversation.id)
      setConversation(existingConversation)
    } else {
      // Create new conversation
      createConversationMutation.mutate({
        participantIds: [currentUser.id.toString(), userId]
      })
    }
  };

  useEffect(() => {
    if (selectedUser) {
      handleUserSelect(selectedUser);
    }
  }, [selectedUser, conversationsQuery.data, currentUser?.id]);

  const handleDownload = (resource: any) => {
    const link = document.createElement('a')
    link.href = resource.media_url
    link.download = resource.media_url
    link.click()
  }

  return (
    <div className="h-full flex flex-col min-h-[600px]">
      <Card className="border-border bg-card h-full flex flex-col">
        <CardHeader className="pb-4 border-b flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <MessageSquare className="w-6 h-6 text-primary" />
              Communication
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                {/* <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span> */}
                {connectionError && (
                  <span className="text-xs text-red-500">• Error</span>
                )}
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder={`Choose ${role === 'instructor' ? 'a student' : 'an instructor'} to start chatting`} />
                  </SelectTrigger>
                  <SelectContent searchable searchPlaceholder="Search by name or email...">
                    {getUsersForMessages.data?.map((person: any) => (
                      <SelectItem key={person.id} value={person.id.toString()}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{person.first_name} {person.last_name} / {person.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex bg-muted/50 rounded-lg p-1 w-full sm:w-auto border">
                <Button
                  variant={activeTab === 'messages' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 sm:flex-initial text-sm px-6 py-2.5 h-10 rounded-md transition-all ${activeTab === 'messages'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <Button
                  variant={activeTab === 'resources' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('resources')}
                  className={`flex-1 sm:flex-initial text-sm px-6 py-2.5 h-10 rounded-md transition-all ${activeTab === 'resources'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Resources
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden min-h-0">
          {activeTab === 'messages' ? (
            <div className="h-full flex flex-col p-6 min-h-0">
              {conversationId ? (
                <ChatInterface
                  studentName={isInstructor ? `${user.first_name} ${user.last_name}` : getSelectedUser(selectedUser)?.first_name + ' ' + getSelectedUser(selectedUser)?.last_name}
                  teacherName={isInstructor ? getSelectedUser(selectedUser)?.first_name + ' ' + getSelectedUser(selectedUser)?.last_name : `${user.first_name} ${user.last_name}`}
                  refetchMessage={messagesQuery}
                  conversationId={conversationId.toString()}
                  conversation={conversation}
                  userId={selectedUser.toString() || ""}
                  admin
                  initialMessages={messagesQuery.data?.success ? messagesQuery.data.messages : []}
                />
              ) : createConversationMutation.isPending ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold mb-2">Creating Conversation...</h3>
                    <p className="text-muted-foreground">Please wait while we set up your chat</p>
                  </div>
                </div>
              ) : !selectedUser ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a {role === 'instructor' ? 'Student' : 'Instructor'}</h3>
                    <p className="text-muted-foreground">Choose someone from the dropdown above to start chatting</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold mb-2">Loading Conversation...</h3>
                    <p className="text-muted-foreground">Please wait while we set up your chat</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 h-full flex flex-col overflow-y-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
                <div>
                  <h4 className="font-semibold text-lg text-foreground">Learning Resources & Downloads</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Resources shared with {user.name}
                  </p>
                </div>
                {/* <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button> */}
              </div>

              <div className="space-y-4 flex-1">
                {messagesQuery.data?.messages?.filter(v => v.message_type === "file")?.map((resource) => (
                  <div key={resource.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 gap-4 bg-card/50">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center text-xl flex-shrink-0 border">
                        {getFileIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {/* <Badge variant="outline" className="text-xs font-medium">{resource.type}</Badge> */}
                          <h5 className="font-semibold text-foreground text-base truncate">{extractFile(resource.media_url)}</h5>
                          <span className="hidden sm:flex items-center gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                            by {resource.sender_first_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                            {new Date(resource.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* <Button variant="outline" size="sm" className="flex-1 sm:flex-initial hover:bg-muted">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button> */}
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-initial hover:bg-muted">
                        <Download className="w-4 h-4" onClick={() => handleDownload(resource)} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
