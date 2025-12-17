import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Globe,
  Clock,
  Users,
  Key,
} from "lucide-react";
import { type User as UserType } from "@/components/user-management/mockData";
import { capitalize } from "@/utils/stringUtils";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface ProfileTabProps {
  user: UserType;
}
export function ProfileTab({ user }: ProfileTabProps) {
  const { toast } = useToast();
  const BASE_URL =
    import.meta.env.VITE_FRONTEND_URL || "http://31.97.232.41:8080";
  let url = `${BASE_URL}/reset-password`;

  const forgotPasswordMutation = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: (email: string) =>
      fetchApi<{ message: string }>({
        path: "auth/forgot-password",
        method: "POST",
        data: { email, resetURL: url },
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset email sent successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to send password reset email",
        variant: "destructive",
      });
    },
  });
  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "student":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "parent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "admin":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "support":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const handleResetPassword = () => {
    forgotPasswordMutation.mutate(user.email);
  };
  return (
    <div className="space-y-4">
      {/* Main Profile Information - Mobile Friendly Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Personal Details */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium text-foreground break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>Phone</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {user.phone_number || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Country</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {user.countryFlag} {user.country}
                  </p>
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Age Type</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {user.age_type || "NA"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Gender</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {user.gender || "NA"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Timezone</span>
                  </div>
                  <Badge variant="outline">{user.timezone || "NA"}</Badge>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Bio</span>
                </div>
                <p className="text-foreground text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">
                  {user.notes || "No bio provided"}
                </p>
              </div>

              {/* Joined Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined Date</span>
                </div>
                <p className="font-medium text-foreground">
                  {format(new Date(user.created_at), "MMM dd, yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Status & Roles */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={!user.status ? "default" : "secondary"}
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : ""
                      }
                    >
                      {capitalize(user.status)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1  capitalize">
                    {user.roles.map((role) => (
                      <Badge
                        key={role}
                        className={getRoleColor(role)}
                        variant="outline"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleResetPassword}
                disabled={forgotPasswordMutation.isPending}
              >
                <Key className="w-4 h-4 mr-2" />
                {forgotPasswordMutation.isPending
                  ? "Sending..."
                  : "Reset Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
