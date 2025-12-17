
import React, { useState } from 'react'
import { DashboardLayout } from "@/components/DashboardLayout"
import UserManagementContent from "@/components/user-management/UserManagementContent"
import { FamilyManagement } from "@/components/user-management/FamilyManagement"
import { GroupManagement } from "@/components/user-management/GroupManagement"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UsersIcon, UserCheck, ArrowLeft } from "lucide-react"
import { hasPermission } from '@/utils/checkPermission'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate = useNavigate()

  const handleUserClick = (user: any) => {
    setSelectedUser(user)
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              User Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage students, families, groups, and user accounts
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="families" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Families
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {
              hasPermission("HAS_READ_USER") ? <UserManagementContent /> : <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Access Denied
                </h2>
                <p className="text-muted-foreground">
                  You do not have permission to view this page.
                </p>
                <Button onClick={() => navigate("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            }
          </TabsContent>

          <TabsContent value="families">
            {
              hasPermission("HAS_READ_FAMILY") ? <FamilyManagement onUserClick={handleUserClick} /> : <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Access Denied
                </h2>
                <p className="text-muted-foreground">
                  You do not have permission to view this page.
                </p>
                <Button onClick={() => navigate("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            }
          </TabsContent> <TabsContent value="groups">
            {
              hasPermission("HAS_READ_USER_GROUP") ? <GroupManagement /> : <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Access Denied
                </h2>
                <p className="text-muted-foreground">
                  You do not have permission to view this page.
                </p>
                <Button onClick={() => navigate("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            }
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default UserManagement
