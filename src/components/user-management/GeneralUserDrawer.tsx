
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  GraduationCap,
  Users,
  BookOpen,
  Plus,
  ExternalLink
} from "lucide-react"
import { type User as UserType } from "./mockData"
import { ClassTable } from "@/components/class-management/ClassTable"
import { useNavigate } from 'react-router-dom'

interface GeneralUserDrawerProps {
  user: UserType | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdate: (user: UserType) => void
}

export function GeneralUserDrawer({ user, isOpen, onOpenChange, onUserUpdate }: GeneralUserDrawerProps) {
  const navigate = useNavigate()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<UserType>>({})

  if (!user) return null

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-purple-500 text-white'
      case 'student':
        return 'bg-pink-500 text-white'
      case 'parent':
        return 'bg-blue-500 text-white'
      case 'admin':
        return 'bg-primary text-primary-foreground'
      case 'support':
        return 'bg-green-500 text-white'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const handleEdit = (field: string) => {
    setEditingField(field)
    setFormData({ [field]: user[field as keyof UserType] })
  }

  const handleSave = () => {
    if (editingField) {
      onUserUpdate({ ...user, ...formData })
      setEditingField(null)
      setFormData({})
    }
  }

  const handleCancel = () => {
    setEditingField(null)
    setFormData({})
  }

  const handleNavigateToFamily = () => {
    navigate(`/user-details/${user.id}/family`)
    onOpenChange(false)
  }

  // Mock classes data for general user
  const mockClasses = [
    {
      id: '1',
      date: '2024-01-28',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      type: 'Private 60min',
      instructor: 'Ms. Priya Sharma',
      studentName: user.name,
      status: 'Scheduled'
    }
  ]

  const handleClassEdit = (classItem: any) => {
    console.log('Edit class:', classItem)
  }

  const handleClassDelete = (classId: string) => {
    console.log('Delete class:', classId)
  }

  const handleClassJoin = (classId: string) => {
    console.log('Join class:', classId)
  }

  const handleClassCancel = (classId: string) => {
    console.log('Cancel class:', classId)
  }

  const handleClassReschedule = (classId: string) => {
    console.log('Reschedule class:', classId)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{user.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.roles.map((role) => (
                  <Badge key={role} className={getRoleColor(role)} variant="default">
                    {role}
                  </Badge>
                ))}
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <span>{user.countryFlag}</span>
                  {user.country}
                </span>
                <span>Age: {user.ageType}</span>
                <span>Joined: {user.joinedDate}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {editingField === 'name' ? (
                      <div className="flex gap-2">
                        <Input
                          id="name"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <Button size="sm" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{user.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit('name')}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {editingField === 'email' ? (
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Button size="sm" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{user.email}</span>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit('email')}>
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.country}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.timezone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age Group</Label>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.ageType}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    User Classes
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      navigate('/classes/create')
                      onOpenChange(false)
                    }}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ClassTable
                  classes={mockClasses}
                  onEdit={handleClassEdit}
                  onDelete={handleClassDelete}
                  onJoin={handleClassJoin}
                  onCancel={handleClassCancel}
                  onReschedule={handleClassReschedule}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 space-y-4">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Family Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage family members, credits, and class assignments
                    </p>
                  </div>
                  <Button 
                    onClick={handleNavigateToFamily}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Family Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add notes about this user..."
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Clear</Button>
                    <Button>Save Notes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
