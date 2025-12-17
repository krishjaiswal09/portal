
import React, { useState, useEffect } from 'react';
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Upload, Download, Send, Paperclip, FileIcon, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";
import { ChatInterface } from "@/components/user-management/ChatInterface";
import { useAuth } from "@/contexts/AuthContext";
import { type User } from "@/components/user-management/mockData";
import { extractFile } from '@/utils/extractFileFromUrl';
import { makeLinkDownload } from '@/utils/makeLinkDownload';


const mockResources = {
  '1': [
    { id: 1, subject: 'Bharatanatyam Basic Positions', fileName: 'basic_positions.pdf', fileSize: '2.3 MB', uploadDate: '2024-01-10' },
    { id: 2, subject: 'Practice Music - Alarippu', fileName: 'alarippu_music.mp3', fileSize: '4.1 MB', uploadDate: '2024-01-12' },
  ],
  '2': [
    { id: 1, subject: 'Advanced Hand Gestures', fileName: 'hand_gestures.pdf', fileSize: '1.8 MB', uploadDate: '2024-01-08' },
    { id: 2, subject: 'Performance Video Reference', fileName: 'performance_ref.mp4', fileSize: '15.2 MB', uploadDate: '2024-01-14' },
  ],
};

export default function MessagesResources() {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [students, setStudents] = useState<User[]>([]);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [conversation, setConversation] = useState<any | null>(null)
  const [resourceForm, setResourceForm] = useState({
    subject: '',
    file: null as File | null
  });

  // Get students for messages
  const getUsersForMessages = useQuery({
    queryKey: ["getUsersForMessages11", user?.id],
    queryFn: () =>
      fetchApi<User[]>({
        path: `classes/class-schedule/users/instructor/${user?.id}`,
      }),
    enabled: !!user?.id,
  });

  // Get user conversations
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
          created_by: user?.id
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
      const studentsData: User[] = getUsersForMessages.data?.map((v) => ({
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
      setStudents(studentsData)
    }
  }, [getUsersForMessages.isLoading, getUsersForMessages.data]);

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (!student || !user?.id) return

    setSelectedStudent(studentId)
    setSelectedStudentName(student.name)

    // Check if conversation exists
    const existingConversation = conversationsQuery.data?.success ? conversationsQuery.data.conversations?.find(
      (conv) => conv.members?.some((p: any) => p.user_id == studentId)
    ) : null

    if (existingConversation) {
      setConversationId(existingConversation.id)
      setConversation(existingConversation)
    } else {
      // Create new conversation
      createConversationMutation.mutate({
        participantIds: [user.id.toString(), studentId]
      })
    }
  };

  const handleAddResource = () => {
    if (resourceForm.subject && resourceForm.file && selectedStudent) {
      console.log('Adding resource:', resourceForm, 'for student:', selectedStudent);
      setResourceForm({ subject: '', file: null });
      setIsAddResourceModalOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResourceForm({ ...resourceForm, file });
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
    <InstructorDashboardLayout title="Messages & Resources">
      <div className="space-y-6">
        {/* Student Selection */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Student Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={handleStudentSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a student to communicate with..." />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search by name or email...">
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <span>{student.name} / {student.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {connectionError && (
                <p className="text-sm text-red-500 mt-2">Connection error: {connectionError}</p>
              )}
            </div>

            {selectedStudent && (
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
                  {selectedStudent && selectedStudentName && conversationId ? (
                    <Card>
                      <CardContent className="p-0">
                        <div className="h-[600px]">
                          <ChatInterface
                            studentName={selectedStudentName}
                            teacherName="Current Instructor"
                            refetchMessage={messagesQuery}
                            conversationId={conversationId.toString()}
                            conversation={conversation}
                            userId={user?.id.toString() || ""}
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
                        <h3 className="text-lg font-semibold mb-2">Select a Student</h3>
                        <p className="text-muted-foreground">
                          Choose a student from the dropdown above to start a conversation
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
                          Resources for {students.find(s => s.id === selectedStudent)?.name}
                        </CardTitle>
                        {/* <Dialog open={isAddResourceModalOpen} onOpenChange={setIsAddResourceModalOpen}>
                          <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              Add Resource
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Resource</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                  id="subject"
                                  placeholder="Enter resource subject"
                                  value={resourceForm.subject}
                                  onChange={(e) => setResourceForm({ ...resourceForm, subject: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="file">Attach File</Label>
                                <Input
                                  id="file"
                                  type="file"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.jpeg,.png"
                                />
                                {resourceForm.file && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Selected: {resourceForm.file.name}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setIsAddResourceModalOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddResource}>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Resource
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog> */}
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
                                  Uploaded on {new Date(resource.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => makeLinkDownload(resource.media_url, extractFile(resource.media_url))}>
                                <Download className="w-4 h-4" />
                              </Button>
                              {/* <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button> */}
                            </div>
                          </div>
                        ))}

                        {(!mockResources[selectedStudent as keyof typeof mockResources] ||
                          mockResources[selectedStudent as keyof typeof mockResources].length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                              No resources shared with this student yet.
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {!selectedStudent && (
              <div className="text-center py-12 text-gray-500">
                Please select a student to start messaging or sharing resources.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  );
}
