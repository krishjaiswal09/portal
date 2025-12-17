
import React, { useState } from 'react'
import { ParentDashboardLayout } from "@/components/ParentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function LeaveRequest() {
  const [leaveData, setLeaveData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    description: ''
  })

  const leaveHistory = [
    {
      id: 1,
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      reason: "Family Emergency",
      status: "approved",
      submittedDate: "2024-01-08",
      approvedBy: "Admin"
    },
    {
      id: 2,
      startDate: "2024-01-05",
      endDate: "2024-01-05",
      reason: "Medical Appointment",
      status: "pending",
      submittedDate: "2024-01-03"
    },
    {
      id: 3,
      startDate: "2023-12-20",
      endDate: "2023-12-22",
      reason: "Vacation",
      status: "rejected",
      submittedDate: "2023-12-15",
      rejectionReason: "Classes cannot be missed during exam preparation"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Leave request submitted:', leaveData)
    // Handle form submission
  }

  const handleInputChange = (field: string, value: string) => {
    setLeaveData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <ParentDashboardLayout title="Leave Request">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Leave Request
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Request leave for Arya's classes and track status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{leaveHistory.length}</div>
              <p className="text-xs text-gray-500 mt-1">This year</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {leaveHistory.filter(item => item.status === 'approved').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Requests approved</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {leaveHistory.filter(item => item.status === 'pending').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Management */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Leave Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">New Request</TabsTrigger>
                <TabsTrigger value="history">Request History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={leaveData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={leaveData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Leave</Label>
                    <Input
                      id="reason"
                      placeholder="e.g., Medical Appointment, Family Emergency, Vacation"
                      value={leaveData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide any additional context or details..."
                      value={leaveData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Submit Leave Request
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date Range</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveHistory.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>
                                {new Date(request.startDate).toLocaleDateString()} - 
                                {new Date(request.endDate).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {request.startDate === request.endDate ? '1 day' : 
                                 `${Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              {getStatusBadge(request.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.submittedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
