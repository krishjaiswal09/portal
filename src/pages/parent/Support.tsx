
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HeadphonesIcon, MessageSquare, Phone, Mail, HelpCircle, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function Support() {
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  })

  const supportTickets = [
    {
      id: "TKT-001",
      subject: "Payment issue with subscription",
      category: "Billing",
      priority: "high",
      status: "open",
      createdDate: "2024-01-20",
      lastUpdate: "2024-01-20",
      assignedTo: "Support Team"
    },
    {
      id: "TKT-002",
      subject: "Class schedule change request",
      category: "Schedule",
      priority: "medium",
      status: "in-progress",
      createdDate: "2024-01-18",
      lastUpdate: "2024-01-19",
      assignedTo: "Ms. Kavita Sharma"
    },
    {
      id: "TKT-003",
      subject: "Technical issue with video calls",
      category: "Technical",
      priority: "high",
      status: "resolved",
      createdDate: "2024-01-15",
      lastUpdate: "2024-01-16",
      assignedTo: "Tech Support"
    }
  ]

  const faqs = [
    {
      question: "How can I reschedule my child's class?",
      answer: "You can reschedule classes by going to the Class Schedule page and clicking on the class you want to change. You can also contact your account manager directly."
    },
    {
      question: "What if my child misses a class?",
      answer: "If your child misses a class, you can request a makeup session. Please contact support within 24 hours of the missed class to arrange a replacement."
    },
    {
      question: "How do I access my child's progress reports?",
      answer: "Progress reports are available in the 'My Child's Progress' section of your dashboard. Reports are updated after each class session."
    },
    {
      question: "Can I change my subscription plan?",
      answer: "Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect from the next billing cycle."
    },
    {
      question: "How do I download certificates?",
      answer: "Completed certificates can be downloaded from the Certificates page. Click on the certificate and select 'Download PDF'."
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Open</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Resolved</Badge>
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Medium</Badge>
      case 'low':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <HelpCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Support ticket submitted:', ticketData)
    // Handle form submission
  }

  const handleInputChange = (field: string, value: string) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <ParentDashboardLayout title="Support">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Support Center
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Get help and support for any questions or issues
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Call Support</h3>
              <p className="text-sm text-gray-600 mb-3">+91 98765 43210</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">support@artgharana.com</p>
              <Button size="sm" variant="outline">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Available 9 AM - 6 PM</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Dashboard */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-playfair font-bold flex items-center">
              <HeadphonesIcon className="w-6 h-6 mr-2" />
              Support Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tickets" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="create">Create Ticket</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tickets" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ticket.status)}
                              {getStatusBadge(ticket.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(ticket.lastUpdate).toLocaleDateString()}
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
              
              <TabsContent value="create" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={ticketData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="schedule">Class Scheduling</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={ticketData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={ticketData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue..."
                      value={ticketData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6">
                <div className="max-w-3xl">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Can't find what you're looking for?</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Our support team is here to help. Create a support ticket or contact us directly.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  )
}
