import React, { useState, useEffect } from "react";
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X, Upload, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";
import { SectionLoader, InlineLoader } from "@/components/ui/loader";

export default function InstructorProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    timezone: "",
    bio: "",
    specialization: "",
    address: "",
  });

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone_number: profileData.phone,
        date_of_birth: profileData.dateOfBirth,
        address: `${profileData.address}, ${profileData.city}, ${profileData.state}, ${profileData.country}`,
        notes: profileData.bio,
        gender: profileData.gender.toLowerCase(),
        country: profileData.country,
        state: profileData.state,
        city: profileData.city,
        timezone: profileData.timezone,
      };

      await fetchApi({
        method: "PUT",
        path: `users/${user.id}`,
        data: updateData,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });

      setIsEditing(false);
      await fetchUserData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const fetchUserData = async () => {
    if (!user?.id) return;

    setIsDataLoading(true);
    try {
      const userData = (await fetchApi({
        method: "GET",
        path: `users/${user.id}`,
      })) as any;
      console.log("Fetched user data:", userData);

      setProfileData({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone_number || "",
        dateOfBirth: userData.date_of_birth
          ? new Date(userData.date_of_birth).toISOString().split("T")[0]
          : "",
        gender: userData.gender
          ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
          : "",
        country: userData.country || "",
        state: userData.state || "",
        city: userData.city || "",
        timezone: userData.timezone || "",
        bio: userData.notes || "",
        specialization: userData.art_form || "",
        address: userData.address || "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  return (
    <InstructorDashboardLayout title="My Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                  {profileData.firstName.charAt(0)}
                  {profileData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-playfair font-bold text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-orange-600 font-medium">
                      {profileData.specialization}
                    </p>
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {profileData.city}, {profileData.state},{" "}
                      {profileData.country}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>

                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          {isLoading ? <InlineLoader size="sm" /> : <Save className="h-4 w-4" />}
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <SectionLoader text="Loading profile data..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(value) =>
                      setProfileData({ ...profileData, gender: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        country: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) =>
                      setProfileData({ ...profileData, state: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profileData.timezone}
                    onValueChange={(value) =>
                      setProfileData({ ...profileData, timezone: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    className="mt-1 min-h-[120px]"
                  />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  );
}
