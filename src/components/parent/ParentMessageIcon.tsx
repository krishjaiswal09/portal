
import React from 'react'
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function ParentMessageIcon() {
  const navigate = useNavigate()
  const unreadCount = 3 // Mock unread count

  const handleClick = () => {
    navigate('/parent/messages')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        size="lg"
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </Button>
    </div>
  )
}
