
import React, { useState } from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Download, Upload, FileText, Video, Link, Calendar, Clock } from "lucide-react"
import { mockAssignments } from "@/data/studentDashboardData"

const AssignmentsResources = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return FileText
      case 'video': return Video
      case 'link': return Link
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'video': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'link': return 'bg-green-100 text-green-800 border-green-200'
      case 'notes': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'submitted': return 'bg-green-100 text-green-800 border-green-200'
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <StudentDashboardLayout title="Assignments & Resources">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Assignments & Resources</h1>
            <p className="text-gray-600 mt-1">Access your study materials and submit assignments</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resources List */}
          <div className="lg:col-span-2 space-y-4">
            {mockAssignments.map((item) => {
              const IconComponent = getTypeIcon(item.type)
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(item.type)}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                            <Badge variant="outline">
                              {item.subject}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Uploaded: {item.uploadDate}
                            </span>
                            {item.dueDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Due: {item.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {item.type === 'assignment' && item.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => setSelectedAssignment(item.id)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Assignment
                        </Button>
                      )}
                      {item.fileUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Assignment Submission Panel */}
          <div className="space-y-6">
            {selectedAssignment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submit Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, or Video files</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                    <Textarea 
                      placeholder="Add any notes about your submission..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                      Submit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedAssignment(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Assignments</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    {mockAssignments.filter(a => a.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Submitted</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {mockAssignments.filter(a => a.status === 'submitted').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Resources</span>
                  <Badge variant="outline">
                    {mockAssignments.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}

export default AssignmentsResources
