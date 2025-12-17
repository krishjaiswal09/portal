import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Calendar, Edit, Trash2 } from "lucide-react";
import { GroupEditModal } from "./GroupEditModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/services/api/fetchApi";
import { toast } from "@/hooks/use-toast";
import { hasPermission } from "@/utils/checkPermission";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  student_ids: string[];
  instructor: string;
  schedule: string;
}

interface PostGroupPayload {
  name: string;
  student_ids: number[] | string[];
}

export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      fetchApi<{ data: Group[] }>({
        path: "groups",
      }),
  });

  const postGroupMutation = useMutation({
    mutationFn: async (payload: PostGroupPayload) => {
      return await fetchApi<{ data: any }>({
        method: "POST",
        path: "groups",
        data: payload,
      });
    },
  });

  const editGroupMutation = useMutation({
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: PostGroupPayload;
      id: string;
    }) => {
      return await fetchApi<{ data: any }>({
        method: "PUT",
        path: `groups/${id}`,
        data: payload,
      });
    },
  });

  useEffect(() => {
    if (groupsData && Array.isArray(groupsData)) {
      setGroups(groupsData);
    }
  }, [groupsData]);

  const getInitials = (student: any) => {
    if (student.full_name && student.full_name.trim().length > 0) {
      return student.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    if (student.email) {
      return student.email[0]?.toUpperCase() || "?";
    }
    return "?";
  };

  const filteredGroups = groups.filter((group: any) => {
    const nameMatch = group.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const studentMatch = Array.isArray(group.students)
      ? group.students.some((s: any) =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : false;
    return nameMatch || studentMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredGroups.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setIsEditModalOpen(true);
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsEditModalOpen(true);
  };

  const handleSaveGroup = (updatedGroup: Group) => {
    if (editingGroup) {
      const payload = {
        name: updatedGroup.name,
        student_ids: updatedGroup.student_ids,
      };
      editGroupMutation.mutate(
        { payload, id: updatedGroup.id },
        {
          onSuccess: (data) => {
            toast({
              title: "Group Updated",
              description: "The group was updated successfully.",
              variant: "default",
            });
            refetchGroups();
          },
          onError: (error: any) => {
            toast({
              title: "Failed to Update Group",
              description:
                error?.message || "An error occurred while updating the group.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      const newGroup = {
        ...updatedGroup,
      };
      postGroupMutation.mutate(newGroup, {
        onSuccess: (data) => {
          toast({
            title: "Group Created",
            description: "The group was created successfully.",
            variant: "default",
          });
          refetchGroups();
        },
        onError: (error: any) => {
          toast({
            title: "Failed to Create Group",
            description:
              error?.message || "An error occurred while creating the group.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }
    try {
      await fetchApi<{ data: any }>({
        method: "DELETE",
        path: `groups/${groupId}`,
      });
      toast({
        title: "Group Deleted",
        description: "The group was deleted successfully.",
        variant: "default",
      });
      refetchGroups();
    } catch (error: any) {
      toast({
        title: "Failed to Delete Group",
        description:
          error?.message || "An error occurred while deleting the group.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Group Management</h2>
            <p className="text-muted-foreground">
              Manage dance groups and their members
            </p>
          </div>
          {
            hasPermission("HAS_CREATE_USER_GROUP") && <Button
              onClick={handleCreateGroup}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Group
            </Button>
          }
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search groups by name or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Groups ({filteredGroups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGroups.map((group: any) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div
                        className="cursor-pointer hover:text-primary font-medium"
                        onClick={() => handleEditGroup(group)}
                      >
                        {group.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {Array.isArray(group.students) &&
                            group.students.slice(0, 3).map((student: any) => (
                              <Avatar
                                key={student.id}
                                className="h-6 w-6 border-2 border-background"
                              >
                                {/* No avatar image, fallback to initials */}
                                <AvatarFallback className="text-xs">
                                  {getInitials(student)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Array.isArray(group.students)
                            ? group.students.length
                            : 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {
                          hasPermission("HAS_EDIT_USER_GROUP") && <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditGroup(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                        {
                          hasPermission("HAS_DELETE_USER_GROUP") && <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGroup(group.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredGroups.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No groups found</p>
                <Button
                  variant="outline"
                  onClick={handleCreateGroup}
                  className="mt-2"
                >
                  Create your first group
                </Button>
              </div>
            )}
            {filteredGroups.length !== 0 && (
              <div className="flex justify-between items-center p-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Previous
                </Button>
                <p className="text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <GroupEditModal
        group={editingGroup}
        isOpen={isEditModalOpen && hasPermission("HAS_EDIT_USER_GROUP")}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
      />
    </>
  );
}
