
import { useState } from "react"
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ResourceViewerModal } from "@/components/student/ResourceViewerModal"
import { studentResources, StudentResource } from "@/data/studentResourceData"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Download,
  Search,
  Filter,
  FileText,
  User
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Resources() {
  const [resources] = useState<StudentResource[]>(studentResources)
  const [filteredResources, setFilteredResources] = useState<StudentResource[]>(resources)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedResource, setSelectedResource] = useState<StudentResource | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  // Filter resources based on search and type
  const handleFilter = (search: string, type: string) => {
    let filtered = resources

    if (search) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.senderName.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (type !== "all") {
      filtered = filtered.filter(resource => resource.fileType.toLowerCase() === type.toLowerCase())
    }

    setFilteredResources(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    handleFilter(value, typeFilter)
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
    handleFilter(searchQuery, value)
  }

  const handleDownload = (resource: StudentResource) => {
    // Create a mock download
    const link = document.createElement('a')
    link.href = `/resources/${resource.fileName}`
    link.download = resource.fileName
    link.click()

    console.log(`Downloading: ${resource.title}`)
  }

  const handleView = (resource: StudentResource) => {
    // Convert StudentResource to TopicResource format for the modal
    const topicResource = {
      id: resource.id,
      name: resource.title,
      type: resource.fileType.toLowerCase() as 'audio' | 'video' | 'image' | 'document',
      url: `/resources/${resource.fileName}`,
      description: resource.description
    }

    setSelectedResource(resource)
    setViewerOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <StudentDashboardLayout title="Resources">
      <div className="space-y-6">
        {/* Header and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Learning Resources</h1>
            <p className="text-muted-foreground">
              Access materials shared by your instructors
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>

            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resources Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {resource.title}
                      {resource.isNew && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                          New
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(resource.uploadDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {resource.senderName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleDownload(resource)}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Your instructors haven't shared any resources yet"
              }
            </p>
          </div>
        )}
      </div>

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <ResourceViewerModal
          resource={{
            id: selectedResource.id,
            title: selectedResource.title,
            type: selectedResource.fileType.toLowerCase() as 'audio' | 'video' | 'image' | 'document',
            url: `/resources/${selectedResource.fileName}`,
            description: selectedResource.description
          }}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
        />
      )}
    </StudentDashboardLayout>
  )
}
