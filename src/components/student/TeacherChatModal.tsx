
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, User as UserIcon } from "lucide-react"
import { ChatInterface } from "@/components/user-management/ChatInterface"
import { fetchApi } from "@/services/api/fetchApi"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useSocket } from "@/hooks/useSocket"
import { useAuth } from "@/contexts/AuthContext"
import { type User } from "@/components/user-management/mockData"

interface TeacherChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherChatModal({ open, onOpenChange }: TeacherChatModalProps) {
  const { user } = useAuth()
  const [instructors, setInstructors] = useState<User[]>([])
  const [selectedInstructor, setSelectedInstructor] = useState("")
  const [selectedInstructorName, setSelectedInstructorName] = useState("")
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [conversation, setConversation] = useState<any | null>(null)

  // Get instructors for messages
  const getUsersForMessages = useQuery({
    queryKey: ["getUsersForMessages", user?.id],
    queryFn: () =>
      fetchApi<any[]>({
        path: `classes/class-schedule/instructors/student/${user?.id}`,
      }),
    enabled: !!user?.id && open,
  })

  // Get user conversations
  const conversationsQuery = useQuery({
    queryKey: ["userConversations", user?.id],
    queryFn: () =>
      fetchApi<{ conversations: any[], success: boolean }>({
        path: "chat/conversations",
        params: { userId: user?.id },
      }),
    enabled: !!user?.id && open,
  })

  // Get messages for selected conversation
  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      fetchApi<{ messages: any[] }>({
        path: `chat/messages/${conversationId}`,
      }),
    enabled: !!conversationId,
  })

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
  })

  // Socket.IO connection
  const { isConnected, connectionError } = useSocket()

  useEffect(() => {
    if (!getUsersForMessages.isLoading && getUsersForMessages.data) {
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
      }))
      setInstructors(usersData)
    }
  }, [getUsersForMessages.isLoading, getUsersForMessages.data])

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat with Instructor
          </DialogTitle>
        </DialogHeader>

        {/* Instructor Selection */}
        <div className="mb-4">
          <Select value={selectedInstructor} onValueChange={handleInstructorSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an instructor to start chatting" />
            </SelectTrigger>
            <SelectContent searchable searchPlaceholder="Search by name or email...">
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>{instructor.name} / {instructor.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {connectionError && (
            <p className="text-sm text-red-500 mt-2">Connection error: {connectionError}</p>
          )}
        </div>

        {/* Chat Interface */}
        {selectedInstructor && selectedInstructorName && conversationId ? (
          <div className="flex-1" style={{
            height: "100px"
          }}>
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
        ) : (
          <Card className="flex-1">
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
      </DialogContent>
    </Dialog>
  )
}
