import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Paperclip, Calendar, MapPin, Phone, Users, Check, Send } from "lucide-react"
import { EmojiPicker } from "./EmojiPicker"
import { AttachmentDropdown } from "./AttachmentDropdown"
import { PollCreationModal } from "./PollCreationModal"
import { EventCreationModal } from "./EventCreationModal"

// ✅ Import socket event helpers
import {
  emitJoinConversation,
  emitSendMessage,
  onNewMessage,
  offNewMessage,
} from "@/services/socket/socket_events"
import { useSocket } from "@/hooks/useSocket"
import { UseQueryResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUploadBucket } from '@/hooks/use-upload-bucket'
import { fetchApi } from "@/services/api/fetchApi"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


interface Message {
  id: string
  sender_id: number
  sender_first_name: string
  sender_last_name: string
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'poll' | 'events'
  message?: string
  media_url?: string
  created_at: string
  poll?: {
    id: number
    question: string
    allow_multiple: boolean
    options: Array<{ id: number; text: string, vote_count: string }>
    votes: Array<{ option_id: number; vote_count: number }>
    user_votes: Array<{ option_id: number }>
  }
  // Legacy properties for compatibility
  senderId?: number
  senderName?: string
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'poll' | 'events'
  timestamp?: string
}

interface ChatInterfaceProps {
  studentName: string
  teacherName: string
  refetchMessage: UseQueryResult<{ messages: any[]; }, Error>
  conversationId: string
  conversation: any
  userId: string
  initialMessages?: Message[]
  admin?: boolean
}

export function ChatInterface({
  studentName,
  teacherName,
  refetchMessage,
  conversationId,
  conversation,
  userId,
  initialMessages = [],
  admin = false
}: ChatInterfaceProps) {
  const uploadMutation = useUploadBucket();
  const { socket } = useSocket()
  const fileRef = useRef<HTMLInputElement>()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isPollModalOpen, setIsPollModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ url: string, name: string } | null>(null)

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    if (!socket || !conversationId || !userId) return

    emitJoinConversation(socket, { conversationId, userId })

    onNewMessage(socket, (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      offNewMessage(socket)
    }
  }, [socket, conversationId, userId])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    console.log({
      conversationId,
      senderId: userId,
      message: newMessage.trim(),
      messageType: "text"
    })

    emitSendMessage(socket, {
      conversationId,
      senderId: userId,
      message: newMessage.trim(),
      messageType: "text"
    })

    refetchMessage.refetch()

    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  const handleAttachmentSelect = (type: string) => {
    switch (type) {
      case 'poll':
        setIsPollModalOpen(true)
        break
      case 'event':
        setIsEventModalOpen(true)
        break
      case 'file':
      case 'media':
      case 'audio':
        fileRef.current.click()
        break
      default:
        console.log('Attachment picker for', type)
    }
  }

  const queryClient = useQueryClient()

  // Create poll mutation
  const createPollMutation = useMutation({
    mutationFn: (pollData: { question: string; options: string[]; allowMultiple: boolean }) =>
      fetchApi<{ data: any }>({
        path: "chat/poll-message",
        method: "POST",
        data: {
          conversation_id: parseInt(conversationId),
          question: pollData.question,
          options: pollData.options,
          allow_multiple: pollData.allowMultiple,
          created_by: parseInt(userId)
        }
      }),
    onSuccess: () => {
      refetchMessage.refetch()
    }
  })

  // Vote on poll mutation
  const votePollMutation = useMutation({
    mutationFn: (voteData: { pollId: number; optionIds: number }) => {
      console.log(voteData)
      return fetchApi<{ data: any }>({
        path: "chat/poll/vote",
        method: "POST",
        data: {
          poll_id: Number(voteData.pollId),
          option_ids: +voteData.optionIds,
          user_id: parseInt(userId)
        }
      })
    },
    onSuccess: () => {
      refetchMessage.refetch()
    }
  })

  const handleCreatePoll = (pollData: any) => {
    if (!conversationId || !userId) return
    createPollMutation.mutate(pollData)
  }

  const handleCreateEvent = (eventData: any) => {
    // emitSendMessage(socket, {
    //   conversationId,
    //   senderId: userId,
    //   content: JSON.stringify(eventData),
    //   messageType: "event"
    // })
  }

  const getInitials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      const result = await uploadMutation.mutateAsync({
        path: 'messages/resouces',
        file: file
      });
      emitSendMessage(socket, {
        conversationId,
        senderId: userId,
        message: newMessage?.trim(),
        media_url: result.url,
        messageType: "file"
      })

      // onResourcesChange(resource);
    } catch (error) {
      console.error('Upload error:', error);
    }
    // Reset file input
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  const extractFile = (url) => {
    const fileName = url.split('/').pop(); // 133634666666508122.jpg_Sat...
    return fileName.split('_')[0];
  }

  const handleFileClick = (url: string) => {
    setSelectedFile({ url, name: extractFile(url) })
  }

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-medium">
          Conversation between {teacherName} & {studentName}
        </h3>
      </div>
      <input type={"file"} className="hidden" ref={fileRef} onChange={handleFileUpload} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const totalVotesFinal = msg.poll?.options?.reduce((sum, option) => option.vote_count && sum + (+option.vote_count), 0) ?? 0;
          return (<div
            key={msg.id}
            className={`flex gap-3 ${msg.sender_id?.toString() === userId ? 'flex-row-reverse' : ''}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(`${msg.sender_first_name} ${msg.sender_last_name}`)}</AvatarFallback>
            </Avatar>
            <div className={`max-w-xs ${msg.sender_id?.toString() === userId ? 'items-end' : ''}`}>
              <div className="text-xs text-muted-foreground mb-1">
                {msg.sender_first_name} {msg.sender_last_name} • {msg.created_at}
              </div>
              {msg.message_type === 'text' && (
                <Card className={`${msg.sender_id?.toString() === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.message}</p>
                  </CardContent>
                </Card>
              )}
              {msg.message_type === 'file' && (
                <Card onClick={() => handleFileClick(msg.media_url)} className={`cursor-pointer ${msg.sender_id?.toString() === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.message}</p>
                    <div key={msg.id} className="flex items-center gap-2 text-xs p-2 rounded bg-background/10">
                      <Paperclip className="w-3 h-3" />
                      <span className='text-wrap'>{extractFile(msg.media_url)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {msg.message_type === 'poll' && msg.poll && (
                <Card className="bg-card border max-w-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">{msg.poll.question}</h4>
                      <div className="space-y-2">
                        {msg.poll.options?.map((option: any) => {
                          const voteCount = option?.vote_count || 0
                          const totalVotes = conversation?.members?.length || 0
                          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                          const hasVoted = option?.votes?.some(v => v?.user_id == userId)

                          return (
                            <div key={option.id} className="space-y-1">
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left h-auto p-3 relative overflow-hidden ${hasVoted ? 'border-primary bg-primary/5' : ''
                                  }`}
                                onClick={() => votePollMutation.mutate({
                                  pollId: msg.poll.id,
                                  optionIds: option.id
                                })}
                                disabled={admin || votePollMutation.isPending}
                              >
                                <div
                                  className="absolute left-0 top-0 h-full bg-primary/10 transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                                <div className="flex items-center justify-between w-full relative z-10">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 border border-muted-foreground rounded flex items-center justify-center ${hasVoted ? 'bg-primary border-primary' : ''
                                      }`}>
                                      {hasVoted && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm">{option.text}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {voteCount} vote{voteCount !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {msg.poll.allow_multiple && (
                          <span>Multiple answers allowed</span>
                        )}
                        <span>Total votes: {totalVotesFinal}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={admin}
        />
        <AttachmentDropdown onAttachmentSelect={handleAttachmentSelect} admin={admin} />
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <Button onClick={handleSendMessage} disabled={admin} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* File Preview Modal */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center justify-between">
              {selectedFile?.name}
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedFile.url;
                    link.download = selectedFile.name;
                    link.click();
                  }}
                >
                  Download
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {selectedFile?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="rounded-lg max-h-[60vh] object-contain"
              />
            ) : selectedFile?.url?.match(/\.(mp4|mov|avi|mkv)$/i) ? (
              <video
                controls
                src={selectedFile.url}
                className="rounded-lg max-h-[60vh]"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>No preview available.</p>
                <Button
                  variant="link"
                  className="p-0 mt-2"
                  onClick={() => window.open(selectedFile.url, "_blank")}
                >
                  Open File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>


      {/* Modals */}
      <PollCreationModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        onCreatePoll={handleCreatePoll}
        disabled={admin}
      />
      <EventCreationModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  )
}
