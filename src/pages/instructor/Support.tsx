
import React, { useState } from 'react'
import { InstructorDashboardLayout } from "@/components/InstructorDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HeadphonesIcon, MessageSquare, Plus, Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"

export default function InstructorSupport() {
  const [activeTab, setActiveTab] = useState("tickets")
  const [showNewTicket, setShowNewTicket] = useState(false)

  const supportTickets = [
    {
      id: "TKT-001",
      subject: "Cannot access class recordings",
      category: "Technical",
      priority: "High",
      status: "Open",
      date: "2024-01-15",
      lastUpdate: "2024-01-15"
    },
    {
      id: "TKT-002",
      subject: "Payment not reflecting in account",
      category: "Billing",
      priority: "Medium",
      status: "In Progress",
      date: "2024-01-14",
      lastUpdate: "2024-01-15"
    },
    {
      id: "TKT-003",
      subject: "How to reschedule multiple classes?",
      category: "General",
      priority: "Low",
      status: "Resolved",
      date: "2024-01-12",
      lastUpdate: "2024-01-13"
    }
  ]

  const faqData = [
    {
      question: "How do I reschedule a class?",
      answer: "Go to Classes > Find your class > Click Reschedule > Select new date and time."
    },
    {
      question: "How to mark attendance for students?",
      answer: "During or after the class, go to the class details and mark attendance for each student."
    },
    {
      question: "Can I see my payment history?",
      answer: "Yes, you can view your payment history in the Profile section under Payment Details."
    },
    {
      question: "How to upload teaching materials?",
      answer: "Use the Resources section to upload and share materials with your students."
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Open</Badge>
      case 'In Progress':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">In Progress</Badge>
      case 'Resolved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Resolved</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High</Badge>
      case 'Medium':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Medium</Badge>
      case 'Low':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <InstructorDashboardLayout title="Support">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="font-semibold mb-2">Create Support Ticket</h3>
              <p className="text-sm text-gray-600 mb-4">Get help with technical or general issues</p>
              <Button 
                onClick={() => setShowNewTicket(true)} 
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <HeadphonesIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="font-semibold mb-2">Live Chat Support</h3>
              <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
              <Button variant="outline">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="font-semibold mb-2">FAQ & Guides</h3>
              <p className="text-sm text-gray-600 mb-4">Find answers to common questions</p>
              <Button variant="outline">
                Browse FAQ
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Content */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold">Support Center</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tickets" className="mt-6">
                {showNewTicket ? (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Support Ticket</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input id="subject" placeholder="Brief description of your issue" />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="billing">Billing & Payments</SelectItem>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Please provide detailed information about your issue..."
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Submit Ticket
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowNewTicket(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supportTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{new Date(ticket.date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(ticket.lastUpdate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6">
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Support Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Monday - Friday: 9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Saturday: 10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Sunday: Closed</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">For urgent technical issues during classes:</p>
                      <p className="font-semibold">+91 1800-123-4567</p>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </InstructorDashboardLayout>
  )
}
