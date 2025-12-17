
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, MoreHorizontal } from "lucide-react"
import { mockResources, resourceCategories } from "@/data/resourceData"
import { Resource, ResourceFilters } from "@/types/resource"

const ManageResources = () => {
  const navigate = useNavigate()
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [filters, setFilters] = useState<Partial<ResourceFilters>>({
    search: '',
    artForms: [],
    resourceTypes: [],
    visibility: 'all'
  })

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF': return '📄'
      case 'Video': return '🎥'
      case 'Audio': return '🎵'
      case 'Image': return '🖼️'
      default: return '📁'
    }
  }

  const getVisibilityBadge = (visibility: string) => {
    return visibility === 'Public' 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800">Public</Badge>
      : <Badge variant="secondary" className="bg-gray-100 text-gray-800">Private</Badge>
  }

  const getAccessTypeBadge = (accessType: string) => {
    return accessType === 'Downloadable'
      ? <Badge variant="outline" className="text-blue-600 border-blue-200">Downloadable</Badge>
      : <Badge variant="outline" className="text-orange-600 border-orange-200">View Only</Badge>
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResources(mockResources.map(r => r.id))
    } else {
      setSelectedResources([])
    }
  }

  const handleSelectResource = (resourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedResources(prev => [...prev, resourceId])
    } else {
      setSelectedResources(prev => prev.filter(id => id !== resourceId))
    }
  }

  const handleBatchDelete = () => {
    console.log('Deleting resources:', selectedResources)
    setSelectedResources([])
  }

  const handleBatchVisibility = (visibility: 'Public' | 'Private') => {
    console.log('Changing visibility to:', visibility, 'for resources:', selectedResources)
    setSelectedResources([])
  }

  return (
    <DashboardLayout title="Manage Resources">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              Manage Resources
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              View and manage all educational resources
            </p>
          </div>
          <Button onClick={() => navigate('/resources/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filters.visibility} onValueChange={(value) => setFilters(prev => ({...prev, visibility: value as any}))}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visibility</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Actions */}
        {selectedResources.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedResources.length} resource(s) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBatchVisibility('Public')}>
                    Make Public
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBatchVisibility('Private')}>
                    Make Private
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedResources.length === mockResources.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Art Forms</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedResources.includes(resource.id)}
                        onCheckedChange={(checked) => handleSelectResource(resource.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getFileTypeIcon(resource.fileType)}</span>
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {resource.fileName} • {resource.fileSize}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.fileType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {resource.artForms.slice(0, 2).map(form => (
                          <Badge key={form} variant="secondary" className="text-xs">
                            {form}
                          </Badge>
                        ))}
                        {resource.artForms.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.artForms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{resource.assignedTo.courses.length} Courses</div>
                        <div>{resource.assignedTo.instructors.length} Instructors</div>
                      </div>
                    </TableCell>
                    <TableCell>{resource.uploadedBy}</TableCell>
                    <TableCell>
                      {new Date(resource.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getVisibilityBadge(resource.visibility)}
                        {getAccessTypeBadge(resource.accessType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>👁️ {resource.viewCount}</div>
                        <div>⬇️ {resource.downloadCount}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default ManageResources
