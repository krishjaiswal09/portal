
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Eye, Edit, BookOpen, User, Mail, Phone, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

interface InstructorTableProps {
  teachers: any[]
  onTeacherClick: (teacher: any) => void
}

export function InstructorTable({ teachers, onTeacherClick }: InstructorTableProps) {
  const isMobile = useIsMobile()

  const handleEdit = (e: React.MouseEvent, teacher: any) => {
    e.stopPropagation()
    console.log('Edit teacher:', teacher)
  }

  const handleDelete = (e: React.MouseEvent, teacher: any) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      console.log('Delete teacher:', teacher)
    }
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3">
        {teachers.map((teacher) => (
          <div 
            key={teacher.id}
            className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onTeacherClick(teacher)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src={teacher.avatar} />
                <AvatarFallback className="text-sm">
                  {teacher.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base truncate">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{teacher.email}</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onTeacherClick(teacher)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleEdit(e, teacher)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDelete(e, teacher)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-3 space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {teacher.specialization}
                  </Badge>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span>{teacher.students?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-muted-foreground" />
                        <span>{teacher.courses?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{teacher.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Instructor</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead className="hidden lg:table-cell">Students</TableHead>
            <TableHead className="hidden lg:table-cell">Courses</TableHead>
            <TableHead className="hidden sm:table-cell">Rating</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow 
              key={teacher.id} 
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onTeacherClick(teacher)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback className="text-sm">
                      {teacher.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-base">{teacher.name}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{teacher.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {teacher.specialization}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{teacher.students?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{teacher.courses?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTeacherClick(teacher)}
                    className="h-9 w-9 p-0"
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(e, teacher)}
                    className="h-9 w-9 p-0"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, teacher)}
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
