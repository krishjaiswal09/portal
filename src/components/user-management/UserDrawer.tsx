
import React from 'react'
import { type User } from "./mockData"
import { InstructorDrawer } from "./InstructorDrawer"
import { StudentDrawer } from "./StudentDrawer"
import { GeneralUserDrawer } from "./GeneralUserDrawer"

interface UserDrawerProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdate: (user: User) => void
}

export function UserDrawer({ user, isOpen, onOpenChange, onUserUpdate }: UserDrawerProps) {
  if (!user) return null

  // Determine which drawer to show based on user roles
  if (user.roles.includes('instructor')) {
    return (
      <InstructorDrawer 
        user={user}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUserUpdate={onUserUpdate}
      />
    )
  }

  if (user.roles.includes('student')) {
    return (
      <StudentDrawer 
        user={user}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUserUpdate={onUserUpdate}
      />
    )
  }

  // General drawer for other roles (admin, parent, support, etc.)
  return (
    <GeneralUserDrawer 
      user={user}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onUserUpdate={onUserUpdate}
    />
  )
}
