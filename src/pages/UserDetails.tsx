import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {
  mockUsers,
  type User as UserType,
} from "@/components/user-management/mockData";
import { StudentDetailsPage } from "@/components/user-details/StudentDetailsPage";
import { InstructorDetailsPage } from "@/components/user-details/InstructorDetailsPage";
import { GeneralUserDetailsPage } from "@/components/user-details/GeneralUserDetailsPage";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { capitalize } from "@/utils/stringUtils";
import { hasPermission } from "@/utils/checkPermission";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUsers] = useState<UserType>();

  const usersQueries = useQuery({
    queryKey: ["userWithId"],
    queryFn: () =>
      fetchApi<UserType>({
        path: "users/" + userId,
      }),
  });

  useEffect(() => {
    if (!usersQueries.isLoading && usersQueries.data) {
      setUsers(usersQueries.data);
    }
  }, [usersQueries.isLoading, usersQueries.data]);

  if (!hasPermission("HAS_READ_USER")) {
    return (
      <DashboardLayout title="No Permission">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
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
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout title="User Not Found">
        {!usersQueries.isLoading && usersQueries.data && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              User Not Found
            </h2>
            <p className="text-muted-foreground">
              The user you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/users")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Management
            </Button>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Find user by ID
  // const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <DashboardLayout title="User Not Found">
        {!usersQueries.isLoading && usersQueries.data && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              User Not Found
            </h2>
            <p className="text-muted-foreground">
              The user you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/users")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Management
            </Button>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // const getInitials = (name: string) => {
  //   return name.split(' ').map(n => n[0]).join('').toUpperCase();
  // };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return "bg-purple-500 text-white";
      case "student":
        return "bg-pink-500 text-white";
      case "parent":
        return "bg-blue-500 text-white";
      case "admin":
        return "bg-primary text-primary-foreground";
      case "support":
        return "bg-green-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  // Determine which component to render based on user roles
  const renderUserDetails = () => {
    if (user.roles.includes("instructor")) {
      return <InstructorDetailsPage user={user} />;
    }

    if (user.roles.includes("student")) {
      return <StudentDetailsPage user={user} />;
    }

    // General component for other roles (admin, parent, support, etc.)
    return <GeneralUserDetailsPage user={user} />;
  };

  return (
    <DashboardLayout title={capitalize(`${user.first_name} ${user.last_name}`)}>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/users")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to User Management</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Compact User Header Card - Mobile Optimized */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16 sm:h-12 sm:w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {user.first_name?.[0].toUpperCase()}
                {user?.last_name?.charAt(0)?.toUpperCase() ?? ""}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 w-full">
              <div>
                <h1 className="text-xl sm:text-2xl font-playfair font-bold text-foreground">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-sm text-muted-foreground break-all">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <Badge
                    key={role}
                    className={getRoleColor(role)}
                    variant="default"
                  >
                    {capitalize(role)}
                  </Badge>
                ))}
                <Badge variant={user.status ? "default" : "secondary"}>
                  {capitalize(user.status)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-sm">{user.countryFlag}</span>
                  {user.country}
                </span>
                <span>
                  Age:{" "}
                  {user?.date_of_birth
                    ? (() => {
                        const dob = new Date(user.date_of_birth);
                        const today = new Date();
                        let age = today.getFullYear() - dob.getFullYear();
                        const m = today.getMonth() - dob.getMonth();
                        if (
                          m < 0 ||
                          (m === 0 && today.getDate() < dob.getDate())
                        ) {
                          age--;
                        }
                        return age;
                      })()
                    : ""}
                </span>
                <span className="hidden sm:inline">
                  Timezone: {user.timezone ? user.timezone : "global"}
                </span>
                <span>
                  Joined:{" "}
                  {user.created_at
                    ? (() => {
                        const createdDate = new Date(user.created_at);
                        const today = new Date();
                        let years =
                          today.getFullYear() - createdDate.getFullYear();
                        let months = today.getMonth() - createdDate.getMonth();
                        let days = today.getDate() - createdDate.getDate();

                        if (days < 0) {
                          months--;
                          // Get days in previous month
                          const prevMonth = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            0
                          );
                          days += prevMonth.getDate();
                        }
                        if (months < 0) {
                          years--;
                          months += 12;
                        }

                        let result = "";
                        if (years > 0)
                          result += `${years} year${years > 1 ? "s" : ""} `;
                        if (months > 0)
                          result += `${months} month${months > 1 ? "s" : ""} `;
                        if (years === 0 && months === 0)
                          result += `${days} day${days !== 1 ? "s" : ""} `;
                        return result.trim() ? `${result.trim()} ago` : "Today";
                      })()
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific content */}
        <div className="min-h-[600px]">{renderUserDetails()}</div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails;
