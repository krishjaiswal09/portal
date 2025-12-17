
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Group } from "@/types/group";
import { mockUsers } from "./mockData";
import { MoreHorizontal, Eye, Edit, Trash2, Users } from "lucide-react";

interface GroupsTableProps {
  groups: Group[];
  onGroupClick: (group: Group) => void;
  onGroupEdit: (group: Group) => void;
  onGroupDelete: (groupId: string) => void;
}

export function GroupsTable({ groups, onGroupClick, onGroupEdit, onGroupDelete }: GroupsTableProps) {
  const getGroupMembers = (memberIds: string[]) => {
    return mockUsers.filter(user => memberIds.includes(user.id));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground font-medium">Group Name</TableHead>
                <TableHead className="text-muted-foreground font-medium">Profile</TableHead>
                <TableHead className="text-muted-foreground font-medium">Members</TableHead>
                <TableHead className="text-muted-foreground font-medium">Teacher</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => {
                const members = getGroupMembers(group.members);
                return (
                  <TableRow 
                    key={group.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onGroupClick(group)}
                  >
                    <TableCell className="py-4">
                      <div>
                        <p className="text-foreground font-medium">{group.name}</p>
                        <p className="text-muted-foreground text-sm">{group.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {members.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">+{members.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {members.slice(0, 2).map((member) => (
                          <div key={member.id} className="text-sm text-foreground">
                            {member.email}
                          </div>
                        ))}
                        {members.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{members.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {getInitials(group.teacherName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">{group.teacherName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={group.status === 'active' ? 'default' : 'secondary'}
                        className={group.status === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-secondary text-secondary-foreground'
                        }
                      >
                        {group.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="bg-popover border-border text-popover-foreground z-50"
                        >
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onGroupClick(group);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onGroupEdit(group);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGroupDelete(group.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {groups.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No groups found</p>
            <p className="text-sm text-muted-foreground">Create your first group to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
