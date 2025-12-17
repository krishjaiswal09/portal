import React, { useState } from 'react'
import { StudentDashboardLayout } from "@/components/StudentDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, HelpCircle, Send } from "lucide-react"

const SupportQueries = () => {
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  })

  const mockTickets = [
    {
      id: "ticket-1",
      subject: "Unable to access recorded class",
      category: "Technical",
      priority: "High",
      status: "Open",
      createdDate: "2024-06-20",
      lastUpdated: "2024-06-21",
      description: "I'm unable to play the recorded session from yesterday's Bharatanatyam class.",
      responses: [
        {
          from: "Support Team",
          message: "We're looking into this issue. Please try clearing your browser cache and try again.",
          timestamp: "2024-06-21 10:30"
        }
      ]
    },
    {
      id: "ticket-2",
      subject: "Request for additional practice materials",
      category: "Academic",
      priority: "Medium", 
      status: "Resolved",
      createdDate: "2024-06-18",
      lastUpdated: "2024-06-19",
      description: "Could you please provide additional practice exercises for Classical Vocal?",
      responses: [
        {
          from: "Academic Team",
          message: "Additional practice materials have been uploaded to your course resources section.",
          timestamp: "2024-06-19 14:20"
        }
      ]
    }
  ]

  const mockFAQs = [
    {
      question: "How do I join a live class?",
      answer: "You can join live classes by clicking the 'Join Class' button on your dashboard or in the My Classes section when the class is live."
    },
    {
      question: "Can I download class recordings?",
      answer: "Yes, class recordings are available for download 24 hours after the class ends. Look for the download button in your Class History."
    },
    {
      question: "How do I submit assignments?",
      answer: "Go to the Assignments & Resources section, find your assignment, and click 'Submit Assignment' to upload your work."
    },
    {
      question: "What should I do if I miss a class?",
      answer: "Don't worry! You can access the class recording and materials from your Class History section."
    },
    {
      question: "How do I change my profile information?",
      answer: "Visit your Profile section to update your personal information, contact details, and preferences."
    },
    {
      question: "When will I receive my certificates?",
      answer: "Certificates are automatically generated upon successful completion of courses and can be downloaded from the Exams & Certification section."
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleCreateTicket = () => {
    console.log('Creating ticket:', newTicket)
    setShowNewTicket(false)
    setNewTicket({ subject: '', category: '', priority: '', description: '' })
  }

  return (
    <StudentDashboardLayout title="Support & Queries">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Support & Queries</h1>
            <p className="text-gray-600 mt-1">Get help and find answers to your questions</p>
          </div>
          
          <Button 
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => setShowNewTicket(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Support Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Support Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create New Ticket */}
            {showNewTicket && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Support Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input 
                      placeholder="Brief description of your issue..."
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="academic">Academic Support</SelectItem>
                          <SelectItem value="billing">Billing & Payment</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
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
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Please provide detailed information about your issue..."
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      className="resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={handleCreateTicket}
                    >
                      <Send className="w-4 h-4 mr-2" />
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
            )}

            {/* My Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  My Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Created: {ticket.createdDate}</span>
                            <span>•</span>
                            <span>Updated: {ticket.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>

                      {/* Responses */}
                      {ticket.responses && ticket.responses.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-medium mb-2">Latest Response:</h4>
                          {ticket.responses.map((response, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium text-blue-900">{response.from}</span>
                                <span className="text-xs text-blue-600">{response.timestamp}</span>
                              </div>
                              <p className="text-sm text-blue-800">{response.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        {ticket.status === 'Open' && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {mockFAQs.map((faq, index) => (
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Quick Help & Contact Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  User Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Support Hours</h4>
                  <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Email Support</h4>
                  <p className="text-sm text-gray-600">support@artgharana.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Phone Support</h4>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Emergency Contact</h4>
                  <p className="text-sm text-gray-600">Available 24/7 for technical issues</p>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Open Tickets</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {mockTickets.filter(t => t.status === 'Open').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resolved Tickets</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {mockTickets.filter(t => t.status === 'Resolved').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Response Time</span>
                  <Badge variant="outline">
                    {"< 24h"}
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

export default SupportQueries
