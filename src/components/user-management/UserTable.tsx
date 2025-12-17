import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { countries, type User } from "./mockData";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { hasPermission } from '@/utils/checkPermission';
interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
  onEditUser: (id: number) => void;
  onDeleteUser: (user: User) => void;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}
export function UserTable({
  users,
  onUserClick,
  onEditUser,
  onDeleteUser,
  currentPage,
  pageSize,
  totalUsers,
  onPageChange,
  onPageSizeChange
}: UserTableProps) {
  const totalPages = Math.ceil(totalUsers / pageSize);
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-purple-500 text-white';
      case 'student':
        return 'bg-pink-500 text-white';
      case 'parent':
        return 'bg-blue-500 text-white';
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'support':
        return 'bg-green-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  return <Card className="border-border bg-card">
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-muted/50">
              <TableHead className="text-muted-foreground font-medium">Profile</TableHead>
              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium">Roles</TableHead>
              <TableHead className="text-muted-foreground font-medium">Country</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>

              <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => <TableRow key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground font-medium cursor-pointer hover:text-primary capitalize" onClick={() => onUserClick(user)}>{user.name}</p>
                    <p className="text-muted-foreground text-sm">{user.ageType}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map(role => <Badge key={role} className={`${getRoleColor(role)} text-xs px-2 py-1`}>
                    {role}
                  </Badge>)}
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                <div className="flex items-center gap-3">
                  <span className="text-sm">{user.country}</span>
                  <span>{countries.find((v) => v.code === user.country)?.name || user.country}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={`capitalize ${user.status === 'Active' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}`}>
                  {user.status}
                </Badge>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground z-50">
                    {
                      hasPermission("HAS_READ_USER") && <DropdownMenuItem onClick={() => onUserClick(user)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    }
                    {
                      hasPermission("HAS_EDIT_USER") && <DropdownMenuItem onClick={() => onEditUser(parseFloat(user.id))}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                    }
                    {
                      hasPermission("HAS_DELETE_USER") && <DropdownMenuItem className="text-destructive" onClick={() => onDeleteUser(user)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && <div className="text-center py-12">
        <p className="text-muted-foreground">No users found matching your criteria</p>
      </div>}
    </CardContent>

    {/* Pagination */}
    {totalUsers > 0 && (
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalUsers}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    )}
  </Card>;
}