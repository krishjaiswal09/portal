
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, User, BookOpen, Eye, Edit, Check, X } from "lucide-react"
import { Instructor } from "@/types/instructor"
import { type User as InstructorUser } from "@/components/user-management/mockData";
import { useArtForm } from '@/hooks/use-artForms'
import { hasPermission } from '@/utils/checkPermission'

interface InstructorTableProps {
  instructors: InstructorUser[]
  viewMode: 'grid' | 'table'
  onAction: (action: string, instructorId: number) => void
}

export const InstructorTable: React.FC<InstructorTableProps> = ({
  instructors,
  viewMode,
  onAction
}) => {
  const { data: artForms = [] } = useArtForm(); // Renamed to artForms for clarity
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {instructors?.map((instructor) => (
          <Card key={instructor.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <Avatar className="w-12 h-12 md:w-16 md:h-16">
                    <AvatarImage src={instructor.avatar} />
                    <AvatarFallback className="text-sm md:text-lg font-semibold">
                      {getInitials(instructor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {
                        hasPermission("HAS_READ_INSTRUCTOR") && <DropdownMenuItem onClick={() => onAction('view', +instructor.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      }
                      {
                        hasPermission("HAS_EDIT_INSTRUCTOR") && <DropdownMenuItem onClick={() => onAction('edit', +instructor.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* onClick={() => onAction('view', instructor)} */}
                <div className="space-y-2 cursor-pointer" >
                  <h3 
                    className="font-semibold text-base md:text-lg text-foreground truncate cursor-pointer hover:text-primary transition-colors" 
                    onClick={() => onAction('view', +instructor.id)}
                  >
                    {instructor.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {(instructor.art_form as unknown as any[])?.map((form) => (
                      artForms.find(v => v.value == form)?.name && <Badge key={form} variant="secondary" className="text-xs">
                        {artForms.find(v => v.value == form)?.name}
                      </Badge>
                    ))}
                    {instructor.art_form?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{instructor.art_form.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="truncate">{instructor.email}</p>
                    <p className="text-xs">{instructor.country}</p>
                    <p className="text-xs">{instructor.languages?.length > 0 ? instructor.languages.join(', ') : ''}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={instructor.is_active ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {instructor.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <User className="w-3 h-3 mr-1" />
                      {/* {instructor.totalStudents} */}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {/* {instructor.totalClasses} */}
                    </Badge>
                    {instructor.kid_friendly && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-600">
                        Kid Friendly
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={instructor.assign_demos ? "default" : "secondary"} className="text-xs">
                      Demos: {instructor.assign_demos ? <Check className="w-3 h-3 ml-1" /> : <X className="w-3 h-3 ml-1" />}
                    </Badge>
                    <Badge variant={instructor.transfer_students ? "default" : "secondary"} className="text-xs">
                      Transfer: {instructor.transfer_students ? <Check className="w-3 h-3 ml-1" /> : <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Languages</TableHead>
            <TableHead>Art Forms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kid Friendly</TableHead>
            <TableHead>Can Assign Demos</TableHead>
            <TableHead>Can Transfer Students</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map((instructor) => (
            <TableRow key={instructor.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={instructor.avatar} />
                  <AvatarFallback className="text-sm font-semibold">
                    {getInitials(instructor.name)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{instructor.email}</p>
                </div>
              </TableCell>
              <TableCell>{instructor.gender}</TableCell>
              <TableCell>{instructor.country}</TableCell>
              <TableCell>
                <div className="max-w-32">
                  <p className="text-sm truncate">{instructor.languages?.length > 0 ? instructor.languages.join(', ') : ''}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-40">
                  {(instructor.art_form as unknown as any[])?.map((form) => (
                    artForms.find(v => v.value == form)?.name && <Badge key={form} variant="secondary" className="text-xs">
                      {artForms.find(v => v.value == form)?.name}
                    </Badge>
                  ))}
                  {instructor.art_form?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{instructor.art_form.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={instructor.is_active ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {instructor.status}
                </Badge>
              </TableCell>
              <TableCell>
                {instructor.kid_friendly ? (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-600">
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    No
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={instructor.assign_demos ? "default" : "secondary"} className="text-xs">
                  {instructor.assign_demos ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={instructor.transfer_students ? "default" : "secondary"} className="text-xs">
                  {instructor.transfer_students ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {
                      hasPermission("HAS_READ_INSTRUCTOR") && <DropdownMenuItem onClick={() => onAction('view', +instructor.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    }
                    {
                      hasPermission("HAS_EDIT_INSTRUCTOR") && <DropdownMenuItem onClick={() => onAction('edit', +instructor.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
