
import React, { useState } from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { ParentMessageIcon } from "@/components/parent/ParentMessageIcon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Edit, Save, X, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/services/api/fetchApi'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { SectionLoader } from "@/components/ui/loader"

interface FamilyMember {
  id: number;
  email: string;
  phone_number: string;
  date_of_birth: string;
  country: string;
  timezone: string;
  city: string;
  state: string;
  pin: string;
  age_type: string;
  is_active: boolean;
  parent_id: number;
  gender: string;
  first_name: string;
  last_name: string;
  address: string;
  art_form: string[];
}

const ParentProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false)

  const { data: familyMembersData = [], isLoading: familyLoading } = useQuery<FamilyMember[]>({
    queryKey: ['family-members', user?.id],
    queryFn: () => fetchApi({
      path: `users/parent/${user?.id}`,
    }),
    enabled: !!user?.id,
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    country: '',
    bio: ''
  })

  // Initialize profile data when user data is available
  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone_number || '',
        gender: user.gender || '',
        country: user.country || '',
        bio: user.notes || ''
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => fetchApi({
      path: `users/${user?.id}`,
      method: 'PUT',
      data,
    }),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string; email: string }) => fetchApi({
      path: 'auth/reset-password',
      method: 'POST',
      data,
    }),
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: () => {
      toast.error('Failed to update password');
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone_number: profileData.phone,
      gender: profileData.gender,
      country: profileData.country,
      notes: profileData.bio,
    });
  }

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone_number || '',
        gender: user.gender || '',
        country: user.country || '',
        bio: user.notes || ''
      });
    }
    setIsEditing(false)
  }

  const handlePasswordUpdate = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    resetPasswordMutation.mutate({
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      email: user?.email || ''
    });
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const familyMembers = familyMembersData.map(member => ({
    id: member.id.toString(),
    name: `${member.first_name} ${member.last_name}`,
    relation: 'Child',
    age: calculateAge(member.date_of_birth),
    status: member.is_active ? 'Active' : 'Inactive',
    courses: member.art_form || [],
    initials: `${member.first_name[0]}${member.last_name[0]}`
  }))

  return (
    <ParentDashboardLayout title="Profile">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">SJ</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <span>✉</span>
                {profileData.email}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-blue-100 text-blue-800">Parent</Badge>
                <span className="text-sm text-gray-600">{familyMembers.length} Family Members</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white">Personal</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white">Security</TabsTrigger>
            <TabsTrigger value="family" className="data-[state=active]:bg-white">Family Members</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="py-2 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.email}</div>
                    <p className="text-sm text-gray-500">Contact support to change your email address</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select value={profileData.gender} onValueChange={(value) => setProfileData({ ...profileData, gender: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="py-2 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {isEditing ? (
                      <Select value={profileData.country} onValueChange={(value) => setProfileData({ ...profileData, country: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="py-2 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.country}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="py-3 px-3 bg-gray-50 rounded-md text-gray-600">{profileData.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handlePasswordUpdate}
                    disabled={resetPasswordMutation.isPending}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {resetPasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Family Members</h2>
            </div>

            {familyLoading ? (
              <SectionLoader text="Loading family members..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {familyMembers.map((member) => (
                  <Card key={member.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-600">{member.initials}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Users className="w-4 h-4" />
                            <span>{member.relation} • Age {member.age}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className="bg-green-100 text-green-800">{member.status}</Badge>
                            {/* <span className="text-sm text-gray-600">{member.courses.length} Courses</span> */}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Enrolled Courses:</p>
                          <div className="flex flex-wrap gap-2">
                            {member.courses.map((course, index) => (
                              <Badge key={index} variant="outline" className="text-sm">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ParentMessageIcon />
    </ParentDashboardLayout>
  )
}

export default ParentProfile
