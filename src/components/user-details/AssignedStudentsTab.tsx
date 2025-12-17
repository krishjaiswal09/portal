import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail } from "lucide-react";
import { type User } from "../user-management/mockData";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";

interface AssignedStudentsTabProps {
  user: User;
}

export function AssignedStudentsTab({ user }: AssignedStudentsTabProps) {
  
  const {
    data: assignedStudentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assigned-students", user.id],
    queryFn: async () => {
      const response = await fetchApi({
        path: `classes/class-schedule/users/instructor/${user.id}`,
        method: "GET",
      });
      return response;
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-foreground flex items-center gap-2 text-xl">
          <Users className="w-6 h-6 text-primary" />
          Assigned Students (
          {Array.isArray(assignedStudentsData)
            ? assignedStudentsData?.length
            : 0}
          )
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading assigned students...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading students. Please try again.
          </div>
        ) : !Array.isArray(assignedStudentsData) ||
          assignedStudentsData?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No students assigned yet.
          </div>
        ) : (
          <div className="space-y-4">
            {assignedStudentsData?.map((student: any) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                      {getInitials(
                        `${student.first_name} ${student.last_name}`
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {student.first_name} {student.last_name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Art Form:
                      </span>
                      {student.artform && student.artform.length > 0 ? (
                        student.artform.map((art: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {art}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No art form assigned
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Joined:{" "}
                        {new Date(student.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={student.is_active ? "default" : "secondary"}>
                    {student.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
