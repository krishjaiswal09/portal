
import React from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card,  CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Award, Calendar, Eye } from "lucide-react"

export default function Certificates() {
  const certificates = [
    {
      id: 1,
      title: "Classical Dance - Level 1",
      course: "Classical Dance",
      issueDate: "2024-01-15",
      status: "completed",
      grade: "A+",
      instructor: "Ms. Priya Sharma",
      validUntil: "2025-01-15",
      certificateUrl: "/certificates/classical-dance-level1.pdf"
    },
    {
      id: 2,
      title: "Folk Dance Basics",
      course: "Folk Dance",
      issueDate: "2023-12-20",
      status: "completed",
      grade: "A",
      instructor: "Mr. Raj Kumar",
      validUntil: "2024-12-20",
      certificateUrl: "/certificates/folk-dance-basics.pdf"
    },
    {
      id: 3,
      title: "Classical Dance - Level 2",
      course: "Classical Dance",
      issueDate: null,
      status: "in-progress",
      grade: null,
      instructor: "Ms. Priya Sharma",
      progress: 75,
      expectedCompletion: "2024-03-15"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getGradeBadge = (grade: string) => {
    const colors = {
      'A+': 'bg-purple-100 text-purple-700',
      'A': 'bg-green-100 text-green-700',
      'B+': 'bg-blue-100 text-blue-700',
      'B': 'bg-yellow-100 text-yellow-700'
    }
    return (
      <Badge className={`${colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-700'} hover:bg-current`}>
        {grade}
      </Badge>
    )
  }

  return (
    <ParentDashboardLayout title="Certificates">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Certificates & Achievements
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            View and download Arya's course certificates and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Certificates</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{certificates.length}</div>
              <p className="text-xs text-gray-500 mt-1">Earned certificates</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {certificates.filter(cert => cert.status === 'completed').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Certificates earned</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {certificates.filter(cert => cert.status === 'in-progress').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Currently pursuing</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Grade</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">A</div>
              <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Award className="w-8 h-8 text-gradient-to-r from-orange-500 to-pink-500" />
                  {getStatusBadge(certificate.status)}
                </div>
                <CardTitle className="text-lg font-playfair font-bold mt-2">
                  {certificate.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{certificate.course}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Instructor:</span>
                    <span className="font-medium">{certificate.instructor}</span>
                  </div>
                  
                  {certificate.status === 'completed' ? (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">
                          {certificate.issueDate && new Date(certificate.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Grade:</span>
                        {certificate.grade && getGradeBadge(certificate.grade)}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium">
                          {certificate.validUntil && new Date(certificate.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">{certificate.progress}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full" 
                          style={{ width: `${certificate.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Expected:</span>
                        <span className="font-medium">
                          {certificate.expectedCompletion && new Date(certificate.expectedCompletion).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {certificate.status === 'completed' && (
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Summary */}
        <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold flex items-center">
              <Award className="w-6 h-6 mr-2 text-orange-500" />
              Achievement Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-gray-600">Certificates Earned</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">A</div>
                <div className="text-sm text-gray-600">Average Grade</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">75%</div>
                <div className="text-sm text-gray-600">Current Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
