import React from "react";
import {
  Users,
  Calendar,
  User as InstructorIcon,
  TrendingUp,
  TrendingDown,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyClassesSection } from "@/components/dashboard/MyClassesSection";
import { DemoEligibleInstructorsSection } from "@/components/dashboard/DemoEligibleInstructorsSection";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { SectionLoader } from "@/components/ui/loader";

const quickActions = [
  {
    title: "Schedule New Class",
    description: "Create and schedule classes",
    action: "/classes/create",
    icon: Calendar,
    color: "bg-primary",
    textColor: "text-primary-foreground",
  },
  {
    title: "Add New Student",
    description: "Register new students",
    action: "/users/add",
    icon: UserPlus,
    color: "bg-secondary",
    textColor: "text-secondary-foreground",
  },
  {
    title: "Schedule New Demo",
    description: "Create demo classes",
    action: "/demos/create",
    icon: BookOpen,
    color: "bg-accent",
    textColor: "text-accent-foreground",
  },
];

export function DashboardOverview() {
  const navigate = useNavigate();

  const allStudents = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () =>
      fetchApi<any[]>({
        path: "dashboard-stats",
      }),
  });

  const AllActiveStudents: any = allStudents?.data;

  const statsCards = [
    {
      title: "Active Students",
      value: AllActiveStudents?.activeStudents?.active_count?.toString() || "0",
      change: `${AllActiveStudents?.activeStudents?.percentage || 0}% ${AllActiveStudents?.activeStudents?.percentage > 0 ? "increase" : "decease"} from last month`,
      changeType: AllActiveStudents?.activeStudents?.percentage >= 0 ? "positive" : "negative",
      icon: Users,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Classes This Month",
      value: AllActiveStudents?.monthlyClasses?.active_count?.toString() || "0",
      change: `${AllActiveStudents?.monthlyClasses?.percentage || 0}% ${AllActiveStudents?.monthlyClasses?.percentage > 0 ? "increase" : "decease"} from last month`,
      changeType: AllActiveStudents?.monthlyClasses?.percentage >= 0 ? "positive" : "negative",
      icon: Calendar,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Active Instructors",
      value: AllActiveStudents?.activeInstructors?.active_count?.toString() || "0",
      change: `${AllActiveStudents?.activeInstructors?.percentage || 0}% ${AllActiveStudents?.activeInstructors?.percentage > 0 ? "increase" : "decease"} from last month`,
      changeType: AllActiveStudents?.activeInstructors?.percentage >= 0 ? "positive" : "negative",
      icon: InstructorIcon,
      color: "bg-muted/50 text-muted-foreground",
    },
  ];

  const handleQuickAction = (action: string) => {
    navigate(action);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Here's what's happening with your art school today.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-card border-border"
            onClick={() => handleQuickAction(action.action)}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 md:p-4 rounded-full ${action.color}`}>
                  <action.icon
                    className={`h-6 w-6 md:h-8 md:w-8 ${action.textColor}`}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm md:text-base text-foreground leading-tight">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stat Cards - Improved Mobile Layout */}
      {allStudents.isLoading ? (
        <SectionLoader text="Loading dashboard statistics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {statsCards.map((card, idx) => (
            <Card key={idx} className="bg-card shadow-sm border-border">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 md:p-3 rounded-lg ${card.color}`}>
                    <card.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  {card.changeType === "positive" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p
                    className={`text-xs ${card.changeType === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                      }`}
                  >
                    {card.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* My Classes Section */}
      <MyClassesSection />

      {/* Demo-Eligible Instructors Section */}
      <DemoEligibleInstructorsSection />
    </div>
  );
}
