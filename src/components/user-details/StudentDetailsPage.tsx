import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type User } from "../user-management/mockData";
import { MessagesResourcesToggle } from "./MessagesResourcesToggle";
import { FamilyManagementTab } from "./FamilyManagementTab";
import { ProfileTab } from "./ProfileTab";
import { TimelineTab } from "./TimelineTab";
import { ScheduleRecordingsTab } from "./ScheduleRecordingsTab";
import { CourseProgressTab } from "./CourseProgressTab";
import {
  DollarSign,
  Plus,
  Edit,
  User as UserIcon,
  Calendar,
  BookOpen,
  Clock,
  Trophy,
  Star,
} from "lucide-react";

interface StudentDetailsPageProps {
  user: User;
}

export function StudentDetailsPage({ user }: StudentDetailsPageProps) {
  const mockClasses = [
    {
      date: "2024-01-26",
      time: "10:00 AM",
      instructor: "Ms. Priya Sharma",
      type: "Private 60min",
      status: "Completed",
      rating: 5,
    },
    {
      date: "2024-01-25",
      time: "2:00 PM",
      instructor: "Ms. Meera Nair",
      type: "Group Class",
      status: "Completed",
      rating: 4,
    },
    {
      date: "2024-01-24",
      time: "4:00 PM",
      instructor: "Ms. Priya Sharma",
      type: "Private 40min",
      status: "Completed",
      rating: 5,
    },
  ];

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 h-12 p-1 rounded-lg border">
          <TabsTrigger
            value="profile"
            className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Family Management
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Schedule & Recordings
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="text-sm font-medium px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Messages & Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-0">
          <ProfileTab user={user} />
        </TabsContent>

        <TabsContent value="courses" className="mt-6 space-y-0">
          <CourseProgressTab user={user} />
        </TabsContent>

        <TabsContent value="family" className="mt-6 space-y-0">
          <FamilyManagementTab user={user} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6 space-y-0">
          <ScheduleRecordingsTab user={user} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6 space-y-0">
          <TimelineTab user={user} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6 space-y-0">
          <div className="h-[calc(100vh-200px)]">
            <MessagesResourcesToggle user={user} role="student" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
