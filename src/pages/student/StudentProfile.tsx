import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, Save, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api/fetchApi';
import { useAuth } from '@/contexts/AuthContext';
import { useArtForm } from '@/hooks/use-artForms';
import { useUploadBucket } from '@/hooks/use-upload-bucket';

const StudentProfile = () => {
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const { data: artForms = [] } = useArtForm(); // Renamed to artForms for clarity
  const [activeTab, setActiveTab] = useState('personal');
  const { toast } = useToast();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-234-567-8906",
    gender: "Male",
    ageType: "Adult",
    country: "United States",
    bio: "Passionate about Indian classical arts with 3 years of experience in Bharatanatyam.",
    parentName: "Jane Doe",
    parentPhone: "+1-234-567-8908",
    parentEmail: "jane.doe@example.com"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePicture, setProfilePicture] = useState<string>('');
  const uploadMutation = useUploadBucket();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Fetch current user profile
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => fetchApi({
      path: `users/${user?.id}`,
    }),
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: any) => fetchApi({
      path: `users/${user?.id}`,
      method: 'PUT',
      data: {
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        phone_number: updatedData.phone,
        gender: updatedData.gender.toLowerCase(),
        age_type: updatedData.ageType.toLowerCase(),
        country: updatedData.country,
        art_form: Array.isArray(updatedData.artForms) ? updatedData.artForms.join(', ') : updatedData.artForms,
        notes: updatedData.bio,
        profile_picture_url: updatedData.profilePicture,
      },
    }),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Password reset mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string; email: string }) => fetchApi({
      path: 'auth/reset-password',
      method: 'POST',
      data,
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully!"
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    },
  });

  useEffect(() => {
    if (userProfile && !isLoading) {
      const profile = userProfile as any;
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone_number || profile.phone || '',
        gender: profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Male',
        ageType: profile.age_type ? profile.age_type.charAt(0).toUpperCase() + profile.age_type.slice(1) : 'Adult',
        country: profile.country || '',
        bio: profile.notes || profile.bio || '',
        parentName: profile.parent_first_name && profile.parent_last_name
          ? `${profile.parent_first_name} ${profile.parent_last_name}`.trim()
          : profile.parent_name || '',
        parentPhone: profile.parent_phone_number || profile.parent_phone || '',
        parentEmail: profile.parent_email || '',
      });
      setProfilePicture(profile.profile_picture_url || '');
    }
  }, [userProfile, isLoading]);

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ ...profileData, profilePicture });
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        path: 'student/profile',
        file: file
      });
      setProfilePicture(result.url);
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordUpdate = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    resetPasswordMutation.mutate({
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      email: user?.email || ''
    });
  };

  return (
    <StudentDashboardLayout title="Student Profile">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profilePicture || "/avatars/student-avatar.png"} alt={`${profileData.firstName} ${profileData.lastName}`} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xl">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-1">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-gray-600 mb-4">{profileData.email}</p>

                <div className="space-y-2">
                  <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                    {profileData.ageType}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Information */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-3">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">First Name</label>
                          <Input
                            value={profileData.firstName}
                            onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Last Name</label>
                          <Input
                            value={profileData.lastName}
                            onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium mb-2 block">Email Address</label>
                          <Input
                            value={profileData.email}
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email address cannot be changed. Contact support if needed.</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone Number</label>
                          <Input
                            value={profileData.phone}
                            onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Gender</label>
                          <Select
                            value={profileData.gender}
                            onValueChange={value => setProfileData({ ...profileData, gender: value })}
                            disabled={!isEditing}
                          >
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
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Age Type</label>
                          <Select
                            value={profileData.ageType}
                            onValueChange={value => setProfileData({ ...profileData, ageType: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kid">Kid</SelectItem>
                              <SelectItem value="Adult">Adult</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Country</label>
                          <Input
                            value={profileData.country}
                            onChange={e => setProfileData({ ...profileData, country: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Art Forms & Bio */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-3">Learning Preferences</h4>
                      {/* <div>
                        <label className="text-sm font-medium mb-2 block">Art Forms</label>
                        <Input
                          value={profileData.artForms}
                          onChange={e => setProfileData({ ...profileData, artForms: e.target.value })}
                          disabled={!isEditing}
                          placeholder="e.g., Bharatanatyam, Hindustani Vocal"
                        />
                      </div> */}

                      {/* <div>
                        <Label>Art Forms they can teach</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {artForms.map(form => <div key={`${form.value}_${form.name}`} className="flex items-center space-x-2">
                          
                      <Checkbox
                        id={`art-${form.value}_${form.name}`}
                        checked={profileData.artForms.includes(form.value.toString())}
                        onCheckedChange={() => {
                          const currentArray = profileData.artForms;
                          const value = form.value.toString();
                          const updatedArray = currentArray.includes(value)
                            ? currentArray.filter(item => item !== value)
                            : [...currentArray, value];
                          setProfileData({ ...profileData, artForms: updatedArray });
                        }}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={`art-${form.value}_${form.name}`} className="text-sm">
                        {form.name}
                      </Label>
                    </div>)}
                  </div>
                </div> */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Bio</label>
                        <Textarea
                          value={profileData.bio}
                          onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={3}
                          placeholder="Tell us about your learning journey..."
                        />
                      </div>
                    </div>

                    {/* Parent Information (if applicable) */}
                    {profileData.ageType === 'Kid' && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-3">Parent Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Parent Name</label>
                            <Input
                              value={profileData.parentName}
                              onChange={e => setProfileData({ ...profileData, parentName: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Parent Phone</label>
                            <Input
                              value={profileData.parentPhone}
                              onChange={e => setProfileData({ ...profileData, parentPhone: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-2 block">Parent Email</label>
                            <Input
                              value={profileData.parentEmail}
                              onChange={e => setProfileData({ ...profileData, parentEmail: e.target.value })}
                              disabled={!isEditing}
                              type="email"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-gray-700">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Current Password</label>
                          <Input 
                            type="password" 
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">New Password</label>
                          <Input 
                            type="password" 
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                        </div>
                        <Button 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={handlePasswordUpdate}
                          disabled={resetPasswordMutation.isPending}
                        >
                          {resetPasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-sm text-gray-700 mb-4">Account Security</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h5 className="font-medium">Two-Factor Authentication</h5>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h5 className="font-medium">Login Notifications</h5>
                            <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div >
      </div >
    </StudentDashboardLayout >
  );
};

export default StudentProfile;