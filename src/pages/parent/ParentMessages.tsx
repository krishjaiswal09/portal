
import React, { useState, useEffect } from 'react';
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/user-management/ChatInterface"
import { fetchApi } from "@/services/api/fetchApi"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useSocket } from "@/hooks/useSocket"
import { type User } from "@/components/user-management/mockData"
import { extractFile } from '@/utils/extractFileFromUrl'
import {
  Download,
  FileText,
  MessageSquare,
  FileIcon,
  Trash2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useParentLearner } from '@/contexts/ParentLearnerContext';

export default function ParentMessages() {
  const { selectedLearner } = useParentLearner()
  if (!selectedLearner?.id) {
    return (
      <ParentDashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Learner Not selected</h2>
        </div>
      </ParentDashboardLayout>
    )
  }
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedInstructorName, setSelectedInstructorName] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [instructors, setInstructors] = useState<User[]>([]);
  const [conversation, setConversation] = useState<any | null>(null)

  // Get instructors for messages
  const getUsersForMessages = useQuery({
    queryKey: ["getUsersForMessages", selectedLearner?.id],
    queryFn: () =>
      fetchApi<any[]>({
        path: `classes/class-schedule/instructors/student/${selectedLearner?.id}`,
      }),
    enabled: !!selectedLearner?.id,
  });

  // Get user conversations
  const conversationsQuery = useQuery({
    queryKey: ["userConversations", selectedLearner?.id],
    queryFn: () =>
      fetchApi<{ conversations: any[], success: boolean }>({
        path: "chat/conversations",
        params: { userId: selectedLearner?.id },
      }),
    enabled: !!selectedLearner?.id,
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
          created_by: selectedLearner?.id
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

  useEffect(() => {
    if (
      !getUsersForMessages.isLoading &&
      getUsersForMessages.data
    ) {
      const instructorsData: User[] = getUsersForMessages.data?.map((v) => ({
        name: `${v.first_name} ${v.last_name}`,
        email: v.email,
        timezone: v.timezone,
        country: v.country,
        roles: v.roles,
        id: v.id,
        status: v.is_active ? "active" : "inactive",
        is_active: v.is_active,
        age_type: v.age_type,
        ...v
      }));
      setInstructors(instructorsData)
    }
  }, [getUsersForMessages.isLoading, getUsersForMessages.data]);

  const handleInstructorSelect = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId)
    if (!instructor || !selectedLearner?.id) return

    setSelectedInstructor(instructorId)
    setSelectedInstructorName(instructor.name)

    // Check if conversation exists
    const existingConversation = conversationsQuery.data?.success ? conversationsQuery.data.conversations?.find(
      (conv) => conv.members?.some((p: any) => p.user_id == instructorId)
    ) : null

    if (existingConversation) {
      setConversationId(existingConversation.id)
      setConversation(existingConversation)
    } else {
      // Create new conversation
      createConversationMutation.mutate({
        participantIds: [selectedLearner.id.toString(), instructorId]
      })
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileIcon className="w-4 h-4 text-red-500" />;
      case 'mp3':
      case 'wav':
        return <FileIcon className="w-4 h-4 text-blue-500" />;
      case 'mp4':
      case 'avi':
        return <FileIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <FileIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <ParentDashboardLayout title="Messages & Resources">
      <div className="space-y-6">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Instructor Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="instructor">Select Instructor</Label>
              <Select value={selectedInstructor} onValueChange={handleInstructorSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an instructor to communicate with..." />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search by name or email...">
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      <span>{instructor.name} / {instructor.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {connectionError && (
                <p className="text-sm text-red-500 mt-2">Connection error: {connectionError}</p>
              )}
            </div>

            {selectedInstructor && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Resources
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="mt-6">
                  {selectedInstructor && selectedInstructorName && conversationId ? (
                    <Card>
                      <CardContent className="p-0">
                        <div className="h-[600px]">
                          <ChatInterface
                            studentName={selectedLearner.name}
                            teacherName={selectedInstructorName}
                            refetchMessage={messagesQuery}
                            conversationId={conversationId.toString()}
                            conversation={conversation}
                            userId={selectedLearner?.id.toString() || ""}
                            initialMessages={messagesQuery.data?.success ? messagesQuery.data.messages : []}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : createConversationMutation.isPending ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                        <h3 className="text-lg font-semibold mb-2">Creating Conversation...</h3>
                        <p className="text-muted-foreground">Please wait while we set up your chat</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Select an Instructor</h3>
                        <p className="text-muted-foreground">
                          Choose an instructor from the dropdown above to start a conversation
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Resources from {instructors.find(i => i.id === selectedInstructor)?.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(messagesQuery.data?.messages?.filter(v => v.message_type === "file"))?.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              {getFileIcon(resource.media_url)}
                              <div>
                                <h4 className="font-medium">{resource.subject}</h4>
                                <p className="text-sm text-gray-600">
                                  {extractFile(resource.media_url)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Shared on {new Date(resource.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {(!messagesQuery.data?.messages?.filter(v => v.message_type === "file")?.length) && (
                          <div className="text-center py-8 text-gray-500">
                            No resources shared by this instructor yet.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {!selectedInstructor && (
              <div className="text-center py-12 text-gray-500">
                Please select an instructor to start messaging or view resources.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
