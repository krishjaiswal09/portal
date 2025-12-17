
import { useEffect, useState } from "react"
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceViewerModal } from "@/components/student/ResourceViewerModal"
import { ChatInterface } from "@/components/user-management/ChatInterface"
import { studentResources, StudentResource } from "@/data/studentResourceData"
import { type User } from "@/components/user-management/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Download,
  Search,
  Filter,
  FileText,
  User as UserIcon,
  MessageSquare
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchApi } from "@/services/api/fetchApi"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useSocket } from "@/hooks/useSocket"
import {
  onNewResource,
  offNewResource,
  onConversationCreated,
  offConversationCreated
} from "@/services/socket/socket_events"
import { useAuth } from "@/contexts/AuthContext"
import { extractFile } from "@/utils/extractFileFromUrl"
import { getFileType } from "@/utils/getfileTypeViaFileExtension"

export default function MessagesResources() {
  const { user } = useAuth()
  const [resources] = useState<StudentResource[]>(studentResources)
  const [filteredResources, setFilteredResources] = useState<StudentResource[]>(resources)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [instructors, setInstructors] = useState<User[]>([]);
  const [selectedResource, setSelectedResource] = useState<StudentResource | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  // Messages state
  const [selectedInstructor, setSelectedInstructor] = useState("")
  const [selectedInstructorName, setSelectedInstructorName] = useState("")
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [conversation, setConversation] = useState<any | null>(null)

  const getUsersForMessages = useQuery({
    queryKey: ["getUsersForMessages", user?.id],
    queryFn: () =>
      fetchApi<any[]>({
        path: `classes/class-schedule/instructors/student/${user?.id}`,
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
      fetchApi<{ messages: any[] }>({
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
  const { isConnected, connectionError, socket } = useSocket()

  useEffect(() => {
    if (
      !getUsersForMessages.isLoading &&
      getUsersForMessages.data
    ) {
      const usersData: User[] = getUsersForMessages.data?.map((v) => ({
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
      setInstructors(usersData)
    }
  }, [getUsersForMessages.isLoading, getUsersForMessages.data]);

  useEffect(() => {
    if (!isConnected || !socket) return

    onNewResource(socket, (newResource: StudentResource) => {
      setFilteredResources(prev => [newResource, ...prev])
    })

    onConversationCreated(socket, (conv) => {
      // Auto-open conversation if created for this user
      if (conv.participants.includes(user?.id)) {
        setConversationId(conv.id)
        setConversation(conv)
      }
    })

    return () => {
      if (socket) {
        offNewResource(socket)
        offConversationCreated(socket)
      }
    }
  }, [isConnected, socket, user?.id])

  // Filter resources based on search and type
  const handleFilter = (search: string, type: string) => {
    let filtered = resources

    if (search) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.senderName.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (type !== "all") {
      filtered = filtered.filter(resource => resource.fileType.toLowerCase() === type.toLowerCase())
    }

    setFilteredResources(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    handleFilter(value, typeFilter)
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
    handleFilter(searchQuery, value)
  }

  const handleDownload = (resource: any) => {
    const link = document.createElement('a')
    link.href = resource.media_url
    link.download = resource.media_url
    link.click()
  }

  const handleInstructorSelect = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId)
    if (!instructor || !user?.id) return

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
        participantIds: [user.id.toString(), instructorId]
      })
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  console.log(selectedResource)

  return (
    <StudentDashboardLayout title="Messages & Resources">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Messages & Resources</h1>
            <p className="text-muted-foreground">
              Communicate with instructors and access shared materials
            </p>
          </div>
        </div>
        {/* Instructor Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Select Instructor to Chat
              {/* <div className="ml-auto flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div> */}
            </CardTitle>
            {connectionError && (
              <p className="text-sm text-red-500">Connection error: {connectionError}</p>
            )}
          </CardHeader>
          <CardContent>
            <Select value={selectedInstructor} onValueChange={handleInstructorSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an instructor to start chatting" />
              </SelectTrigger>
              <SelectContent searchable searchPlaceholder="Search by name or email...">
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{instructor.name} / {instructor.email}</span>
                      {instructor.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            {/* Chat Interface */}
            {selectedInstructor && selectedInstructorName && conversationId && (
              <Card>
                <CardContent className="p-0">
                  <div className="h-[600px]">
                    <ChatInterface
                      studentName="Current Student"
                      teacherName={selectedInstructorName}
                      refetchMessage={messagesQuery}
                      conversationId={conversationId.toString()}
                      conversation={conversation}
                      userId={user?.id?.toString() || ""}
                      initialMessages={messagesQuery.data?.messages || []}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {(!selectedInstructor || createConversationMutation.isPending) && (
              <Card>
                <CardContent className="text-center py-12">
                  {createConversationMutation.isPending ? (
                    <>
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <h3 className="text-lg font-semibold mb-2">Creating Conversation...</h3>
                      <p className="text-muted-foreground">Please wait while we set up your chat</p>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select an Instructor</h3>
                      <p className="text-muted-foreground">
                        Choose an instructor from the dropdown above to start a conversation
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {!selectedInstructor && !createConversationMutation.isPending && (
              <div></div>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>

              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messagesQuery.data?.messages?.filter(v => v.message_type === "file")?.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2 w-[200px]">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span title={extractFile(resource.media_url)} className="text-wrap truncate">{extractFile(resource.media_url)}</span>
                          {resource.isNew && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                              New
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(resource.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDownload(resource)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedResource(resource)
                            setViewerOpen(true)
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Your instructors haven't shared any resources yet"
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <ResourceViewerModal
          resource={{
            id: selectedResource.id,
            title: extractFile(selectedResource.media_url),
            type: getFileType(selectedResource.media_url) as 'audio' | 'video' | 'image' | 'document',
            url: selectedResource.media_url,
            description: selectedResource.description
          }}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
        />
      )}
    </StudentDashboardLayout>
  )
}
