import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { User } from "./mockData";
import { hasPermission } from "@/utils/checkPermission";

interface Family {
  id: number;
  name: string;
  discount_percentage: number;
  created_at: string;
  updated_at: string;
  class_type: string | null;
  auto_payment: boolean;
  users: User[];
  class_types: any[];
}

interface FamilyCardProps {
  family: Family;
  onFamilyClick: (family: Family) => void;
  onAddMemberClick: (family: Family) => void;
  onUserClick: (user: User) => void;
}

export function FamilyCard({
  family,
  onFamilyClick,
  onAddMemberClick,
  onUserClick,
}: FamilyCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  console.log(family)

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

  return (
    <Card
      className="border-border bg-card cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onFamilyClick(family)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {family.name}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Primary Contact: {family.users[0]?.name} {family.users[0]?.last_name}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {family.users && family.users.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick(member);
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getInitials(`${member.first_name} ${member.last_name}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{member.first_name} {member.last_name}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {member.roles?.map((role) => (
                      <Badge
                        key={role}
                        className={`${getRoleColor(role)} text-xs`}
                      >
                        {role}
                      </Badge>
                    )) || (
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          student
                        </Badge>
                      )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {/* <p className="text-sm font-medium">${member.credits}</p> */}
                <p className="text-sm capitalize">
                  {member.age_type || member.ageType}
                </p>
              </div>
            </div>
          ))}
        </div>

        {
          hasPermission("HAS_CREATE_FAMILY") && <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddMemberClick(family);
              }}
            >
              <UserPlus className="h-3 w-3" />
              Add Member
            </Button>
          </div>
        }
      </CardContent>
    </Card>
  );
}
