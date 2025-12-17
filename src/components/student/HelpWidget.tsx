
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { TeacherChatModal } from "./TeacherChatModal"

export function HelpWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>

      <TeacherChatModal open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  )
}
